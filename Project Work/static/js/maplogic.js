// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Global Variables & Main Script:
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //


// Main Logic:


// Draw the map:
// Center of the Map coordinates
var mapCenter = getMapCenter();
// Zoom level
var mapZoom = getMapZoom();
// get Map (html element) Id
var mapId = getMapId();

// MapBox API Key
API_KEY = getMapBoxAPIKey();


// Define the Corona Map 
// (Pass in Id, Center & Zoom)
var coronaMap = createCoronaMap(mapId, mapCenter, mapZoom);

// Add Base Layer to Map
addBaseLayer(coronaMap);


// Add data to map: 

// Get the corona virus data and start plotting:
// SMTODO - Later replace d3.csv with d3.json
d3.csv("../static/data/coronadata.csv").then(function(coronaData) {

  // variable coronaData has the corona data
  

  // Read the GeoJson File 
  d3.json("../static/data/countries.geojson").then(function(geoData) {
    // Initiliaze match found
    var matchFound = false
    countryData = geoData.features;
    for (i=0; i<countryData.length; i++) {
      country_name_geo = countryData[i].properties.name;
      // Find the country name in corona data to add data to geoJson:
      matchFound = false;
      for (j=0; j<coronaData.length; j++) {
        if (country_name_geo == coronaData[j].country_name) {
          // Match Found - Add to GeoJson
          countryData[i]["num_cases"] = coronaData[j].num_cases;
          countryData[i]["num_deaths"] = coronaData[j].num_deaths;
          countryData[i]["num_recovered"] = coronaData[j].num_recovered;
          countryData[i]["population"] = coronaData[j].population;
          countryData[i]["num_cases_100k"] = coronaData[j].num_cases_100k;
          matchFound = true;
          break;
        }  
      }  
      // If no match found - Load default values (NOT FOUND)
      if (matchFound = false) {
        countryData[i]["num_cases"] = -999999.999;
        countryData[i]["num_deaths"] = -999999.999;
        countryData[i]["num_recovered"] = -999999.999;
        countryData[i]["population"] = -999999.999;
        countryData[i]["num_cases_100k"] = -999999.999;
      }
    }

    // Updated GeoJson available at this time - variable is "geoData"

    // Add boundaries, color & popup for the countries
    addCountryData(coronaMap, geoData);

  });
  
});

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Center Corrdinates
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapCenter() {
  
  var mapCenterCoords = [30, 0];
  return mapCenterCoords;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Default Zoom Level
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapZoom() {
  
  var mapZoomLevel = 2.25;
  return mapZoomLevel;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Map Element Id (In HTM:L for Leaflet) 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapId() {
 
  var mapIdInHtml = C_MAP_ID;
  return mapIdInHtml;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Get Mapbox API Key
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function getMapBoxAPIKey() {
  
  var mapboxAPIKey = "";
  mapboxAPIKey = C_MAPBOX_API_KEY;
  // SMTODO: Replace by calling API
  // mapboxAPIKey = d3.request(apiUrlMapboxKey).get({retrun});

  // Return the Key
  return mapboxAPIKey;

}
// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Create Corona Map
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
/**********************************************/
function createCoronaMap(pMapId ,pCenter, pZoom) {
  // Create the Map object
  var map = L.map(pMapId, {
    center: pCenter,
    zoom: pZoom
  });
  // Return the Map object
  return map;
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add Base Map Layer
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addBaseLayer(map) {
  // Adding tile layer
  var base = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    // id: "mapbox.streets",
    accessToken: API_KEY
  });
  base.addTo(map);
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Add Country Boundary
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addCountryData(pMap, pFinalCoronaData) {
  

  // Countries GeoJson Data for Coordinates & Corona Virus is in pFinalCoronaData: 
  // feature is a list of dictionaries that has all counytry coordinates  
  
  var country  = L.geoJson(pFinalCoronaData, 
    {
      // Add style, boundary & color etc. per Country  
      // Note: addCountryStyle is assigned function which takes "features" within GeoJson data as input  
      style : addCountryStyle,
      // Add other features to the map (Click / Mouse Over etc.) 
      onEachFeature: addMapFeature,
    })  
    country.addTo(pMap);

  // Return
  return; 

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : Map Style (For Country)
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
// Note: feature/ is a list of dictionaries that has all counytry coordinates  
function addCountryStyle(feature)

  {
  // Set the boundary & color per Country 
    return {
  // Boundary 
    // Boundary color: White 
    color: "white",
    // Boundary Weigth : 0.75
    weight: 0.75,
    // Fill Color 
    // Color per country 
    fillColor: color(feature.num_cases_100k),
    // Color opacity = 0.50
    fillOpacity: 0.50
  };
  

}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function color(pNumCaes100K) 
{

  // Assign color to country based on num cases / 100K 
  // 0  
  // 0-0.1 
  // 0.1-1.0 
  // 1-10 
  // 10-50
  // 50-100 
  // 100 and above
  // -99999.999 = Not Found: Black

  if (pNumCaes100K == -999999.999) {
    return "#000000";  
  } 
  if (pNumCaes100K == 0) {
    return "#84ff00";  
  } 
  if ((pNumCaes100K > 0) & (pNumCaes100K <= 0.100)) {
    return "#daffb3";  
  } 
  if ((pNumCaes100K > 0.100) & (pNumCaes100K <= 1.00)) {
    return "#ffcccc";  
  } 
  if ((pNumCaes100K > 1.00) & (pNumCaes100K <= 10.00)) {
    return "#ff9999";  
  } 
  if ((pNumCaes100K > 10.00) & (pNumCaes100K <= 50.00)) {
    return "#ff6666";  
  } 
  if ((pNumCaes100K > 50.00) & (pNumCaes100K <= 100.00)) {
    return "#ff3333";  
  } 
  if (pNumCaes100K > 100.00) {
    return "#e60000";  
  } 


}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Function : 
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //
function addMapFeature(feature , layer)
{
  // console.log("mapFeature")
  layer.on({
    // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
    mouseover: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.75
      });
    },
    // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
    mouseout: function(event) {
      layer = event.target;
      layer.setStyle({
        fillOpacity: 0.5
      });
    },
  });
  // Giving each feature a pop-up with information pertinent to it
  layer.bindPopup("<h3> Country: " + feature.properties.name + "</h3> <hr> <h4> Confirmed cases: " + feature.num_cases + "</h4>" + "<h4> Population: " + feature.population + "</h4>" + "<h4> Cases/100K Population: " + feature.num_cases_100k + "</h4>");
}

// ********************************************************************************************************************************************************* //
// --------------------------------------------------------------------------------------------------------------------------------------------------------- //
// ********************************************************************************************************************************************************* //

