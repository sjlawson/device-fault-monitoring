# Sample project

The main elements involve integrating with an API and

(1) displaying a selector of options based on one API response,

(2) displaying or plotting (tabular or graph) data from a second endpoint, using Python and/or JavaScript frameworks.

---

Running the app:

1. you must add a .env file with a key called `API_BASE_URL` that points to the data source used for this app. 
2. Docker and docker-compose are required to run the app.
3. Run `docker-compose up` to start the app.
4. 

---

## Interactive Plot
Display time series data on an interactive Plotly chart showing fluctuations in voltage

![Time series plot](plot.png)

## Heatmap static plot
Show a heatmap to highlight high average peaks

![Heatmap](heatmap.png)

---
TODO: Add Lat-Lon data and present devices on a map with ability to draw boundaries and show data for locations.
