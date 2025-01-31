from flask import render_template, flash, redirect, url_for, request, send_file
from flask_login import current_user, login_user, logout_user, login_required
from flask_restx import Api, Resource
import pandas as pd
from app import app, db
import sqlalchemy as sa
from app.forms import LoginForm, RegistrationForm
from app.models import User
from urllib.parse import urlsplit
import requests
import plotly.graph_objects as go
import io
from plotly.subplots import make_subplots
import plotly.express as px


@app.route('/')
@app.route('/index')
# @login_required  # uncomment when we care about security
def index():
    return render_template('index.html', title='Home')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = db.session.scalar(
            sa.select(User).where(User.username == form.username.data))
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or urlsplit(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)

    return render_template('login.html', title='Sign In', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('login'))
    return render_template('register.html', title='Register', form=form)


# Initialize Flask-RestX
api = Api(app, version='1.0', title='Sample API',
          description='A simple API demonstration')

# Create a namespace for our API endpoints
ns = api.namespace('api', description='API operations')

@ns.route('/data/get_data/<string:mac>/<string:date>')
@ns.param('mac', 'MAC address of the device')
@ns.param('date', 'Date in YYYYMMDD format')
class DataResource(Resource):
    def get(self, mac, date): 
        """
        Return time series data for a given MAC address and date

        source response:
        {
            "ix": Array(60901), 
            "voltage4hzCal": Array(60901), 
            "sldminAveragePeaksMax": Array(60901)
        }
        """
        res = requests.get(f"https://whisker-interview.vercel.app/data/get_data?mac={mac}&date={date}")
        data = res.json()
        df = pd.DataFrame(data)
        df['ix'] = pd.to_datetime(df['ix'])
        df = df.resample('1min', on='ix').mean()
        return df.reset_index().to_json(orient='records')
    

@ns.route('/data/get_mac_dates')
class DataSelectResource(Resource):
    def get(self):
        """
        Return a list of MAC addresses and dates
        {"page":1,"per_page":2,"total":6,"total_pages":3,"data":[{"mac":"4B-96-AB-51-7F-C4","date":"20221212"},{"mac":"57-B6-A6-51-7F-C4","date":"20221212"}]}
        """
        res = requests.get("https://whisker-interview.vercel.app/data/list_data?page=1&per_page=20")
        data = res.json()

        return data

@ns.route('/data/get_plot/<string:mac>/<string:date>')
@ns.param('mac', 'MAC address of the device')
@ns.param('date', 'Date in YYYYMMDD format')
class PlotResource(Resource):
    def get(self, mac, date):
        """Return a plotly plot as an image for the given MAC address and date"""
        res = requests.get(f"https://whisker-interview.vercel.app/data/get_data?mac={mac}&date={date}")
        data = res.json()
        df = pd.DataFrame(data)
        df['ix'] = pd.to_datetime(df['ix'])
        df = df.resample('1min', on='ix').mean()

        # Create the plot
        fig = make_subplots(specs=[[{"secondary_y": True}]])
        fig.add_trace(go.Scatter(x=df.index, 
                         y=df['voltage4hzCal'], 
                         mode='lines', 
                         name='voltage 4hz Cal',
                        ),
             secondary_y=False)
        fig.add_trace(go.Scatter(x=df.index, 
                         y=df['averagePeaksMax'], 
                         mode='lines+markers', 
                         name='avg Peaks Max'
                        ),
             secondary_y=True
                        )
        
        fig.update_layout(
            title=f'Time Series Data for {mac}',
            xaxis_title='Time',
            width=900,
            height=400
        )

        # Convert plot to image
        img_bytes = fig.to_image(format="png")
        img_io = io.BytesIO(img_bytes)
        img_io.seek(0)
        
        return send_file(
            img_io,
            mimetype='image/png',
            as_attachment=False
        )


@ns.route('/data/get_heatmap_plot/<string:mac>/<string:date>')
@ns.param('mac', 'MAC address of the device')
@ns.param('date', 'Date in YYYYMMDD format')
class PlotHeatMapResource(Resource):
    def get(self, mac, date):
        """Return the data used to create the plot for the given MAC address and date"""
        res = requests.get(
            f"https://whisker-interview.vercel.app/data/get_data?mac={mac}&date={date}")
        data = res.json()
        df = pd.DataFrame(data)
        df['ix'] = pd.to_datetime(df['ix'])
        df = df.set_index('ix')
        fig = px.imshow(df[['averagePeaksMax']], color_continuous_scale='RdBu_r', origin='lower')
        # fig.show()
        img_bytes = fig.to_image(format="png")
        img_io = io.BytesIO(img_bytes)
        img_io.seek(0)
        
        return send_file(
            img_io,
            mimetype='image/png',
            as_attachment=False
        )
