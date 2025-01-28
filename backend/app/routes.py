from flask import render_template, flash, redirect, url_for, request
from flask_login import current_user, login_user, logout_user, login_required
from flask_restx import Api, Resource
import pandas as pd
from app import app, db
import sqlalchemy as sa
from app.forms import LoginForm, RegistrationForm
from app.models import User
from urllib.parse import urlsplit
import requests

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

@ns.route('/data/get_data')
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
        res = requests.get(f"https://whisker-interview.vercel.app/data/"
                           f"get_data?mac={mac}&date={date}")
        data = res.json()
        df = pd.DataFrame(data)
        
        return df.to_json()
