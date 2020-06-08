//Circles to represent magnitude of earthquakes on the map
function createCircle(feature) {
    //Circle variation based on Richter scale
    for (var i = 0; i < feature.length; i++) {
  
      var color = "";
  
      if (feature.properties.mag >= 8) {
        color = "##EC6988";}
      else if (feature.properties.mag >= 7) {
        color = "#FE8176";}
      else if (feature.properties.mag >= 6) {
        color = "#FE8F77";}
      else if (feature.properties.mag >= 5) {
        color = "#FE9F6D";}
      else if (feature.properties.mag >= 4) {
        color = "#FDB768";}
      else if (feature.properties.mag >= 3) {
        color = "#FDCD6D";}
      else if (feature.properties.mag >= 2) {
        color = "#FDE281";}
      else {
        color = "#FEFE9A";}
  
      L.circle(feature, {
        fillOpacity: 0.8,
        color: "white",
        fillColor: color,
        radius: feature.properties.mag * 5000}).addTo(myMap);
    }
  }


