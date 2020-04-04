from flask import Flask, render_template, redirect, jsonify 
import pandas as pd
import json 
import sqlalchemy
from sqlalchemy import create_engine
from config import dbuser, dbpassword 
import datetime as datetime


rds_connection_string = f"{dbuser}:{dbpassword}@localhost:5432/viruses"
engine = create_engine(f'postgresql://{rds_connection_string}')

app = Flask(__name__)

@app.route("/")
@app.route("/home")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/getCoronaCumulativeData")
def coronavirus():
    corona_cumulative_json = pd.read_sql("select * from corona_virus_by_country", con=engine)
    return corona_cumulative_json.to_json(orient='records')


@app.route("/updateData")
def updateData(): 

###### Reading csv and renaming country population data ######
    world_population = "raw_data/world_population.csv"
    population_csv = pd.read_csv(world_population)
    population_df = population_csv.drop(['Yearly Change', 'Net Change', 'Density (P/Km²)', 'Land Area (Km²)', 'Migrants (net)', 'Fert. Rate', 'Med. Age', 'Urban Pop %', 'World Share'], axis =1)
    country_population_df = population_df.rename(columns={'Country (or dependency)': 'country_name', 'Population (2020)': 'population'})
    country_population_df.loc[(country_population_df["country_name"] == 'US'),["country_name"]]='United States of America'
    country_population_df.loc[(country_population_df["country_name"] == 'Bahamas'),["country_name"]]='The Bahamas' 
##### Loading data to database ######
    engine.execute(sqlalchemy.text('TRUNCATE TABLE country_population').execution_options(autocommit=True))
    country_population_df.to_sql(name="country_population", con=engine, index=False, if_exists='append')

####### Reading and renaming coronavirus data ########
    coronavirus = "Raw_data/raw_coronavirus_data(1).csv"
    coronavirus_csv = pd.read_csv(coronavirus)

    coronavirus_df = coronavirus_csv.rename(columns={'Country': 'country_name', 'Date': 'report_date', 'Confirmed':'num_cases', 'Recovered': 'num_recovered', 'Deaths': 'num_deaths'})

    coronavirus_df.loc[(coronavirus_df["country_name"] == "US"),["country_name"]]='United States of America'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Bahamas'),["country_name"]]='The Bahamas'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Burma'),["country_name"]]='Myanmar'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Congo (Brazzaville)'),["country_name"]]='Democratic Republic of the Congo'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Guinea-Bissau'),["country_name"]]='Guinea Bissau'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Korea, South'),["country_name"]]='South Korea'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Serbia'),["country_name"]]='Republic of Serbia'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Tanzania'),["country_name"]]='United Republic of Tanzania'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Timor-Leste'),["country_name"]]='East Timor'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'West Bank and Gaza'),["country_name"]]='West Bank'
    coronavirus_df.loc[(coronavirus_df["country_name"] == 'Taiwan*'),["country_name"]]='Taiwan'
######## Loading data into database ########
    engine.execute(sqlalchemy.text('TRUNCATE TABLE corona_virus_bydate').execution_options(autocommit=True))
    coronavirus_df.to_sql(name="corona_virus_bydate", con=engine, index=False, if_exists='append')
     
    update_date = datetime.datetime.now()
    update_date_dict = {'last_update_date':update_date}
    update_date_df = pd.DataFrame([update_date_dict])
    engine.execute(sqlalchemy.text('TRUNCATE TABLE last_updated_date').execution_options(autocommit=True))
    update_date_df.to_sql(name="last_updated_date", con=engine, index=False, if_exists='append')

    return("updated")


@app.route("/getCoronaTimeSeriesData")
def Coronavirus_Timeseries(): 
    coronavirus_timeseries = pd.read_sql("select * from corona_virus_bydate", con=engine)
    return coronavirus_timeseries.to_json(orient='records')


@app.route("/getLastUpdated")
def LastUpdated():
    last_updated = pd.read_sql("select * from last_updated_date", con=engine)
    return last_updated.to_string()


@app.route("/geteboladata")
def ebola():
    ebola_csv = "Final_Dataset/final_ebola.csv"
    ebola = pd.read_csv(ebola_csv) 

    return ebola.to_json(orient='records')


@app.route("/getsarsdata")
def sars():
    sars_csv = "Final_Dataset/final_sars.csv"
    sars = pd.read_csv(sars_csv)

    return sars.to_json(orient='records')
    
if __name__=="__main__":
    app.run(debug=True)
