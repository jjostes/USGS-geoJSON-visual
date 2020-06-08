// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-5-31&endtime=" +
  "2020-6-1&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p><b>Magnitude: </b>" + 
      feature.properties.mag +
      "</br><b>Time: </b>" +
      new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });


  // Defining streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v9",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });
  
  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var mag = earthquakeData.map(data => data.properties.mag)
  var lat = earthquakeData.map(data => data.geometry.coordinates[1])
  var long = earthquakeData.map(data => data.geometry.coordinates[0])

  console.log(earthquakeData)
  console.log(lat)
    
  //Conditional for circle color and size proportional to magnitude. Limited to mag of 7 due to none happening beyond that
  for (var i = 0; i < earthquakeData.length; i++) {

    var color = "";
    
    if (mag[i] >= 7) {
      color = "red";}
    else if (mag[i] >= 6) {
      color = "#D61A46";}
    else if (mag[i] >= 5) {
      color = "#FE2712";}
    else if (mag[i] >= 4) {
      color = "#FD4D0C";}
    else if (mag[i] >= 3) {
      color = "#FC7307";}
    else if (mag[i] >= 2) {
      color = "#FB9902";}
    else if (mag[i] >= 1) {
      color = "#FCBA12";}
    else {
      color = "#FDED2A";}

    L.circle([lat[i], long[i]], {
      color: color,
      opacity: 0.50,
      fillColor: color,
      fillOpacity: 0.25,
      radius: mag[i] * 50000
    }).addTo(myMap);
  }

  function getColor(d) {
    return d > 7 ? 'red' :
           d > 6  ? '#D61A46' :
           d > 5  ? '#FE2712' :
           d > 4  ? '#FD4D0C' :
           d > 3   ? '#FC7307' :
           d > 2   ? '#FB9902' :
           d > 1   ? '#FCBA12' :
                      '#FDED2A';}

  // Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 1, 2, 3, 4, 5, 6, 7],
          labels = [];

      div.innerHTML += '<h5>Richter Scale</h5>'
      // generating a label with a colored square for each interval of Richter scale
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(myMap);
  

}
