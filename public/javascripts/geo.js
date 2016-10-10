function newMap(map, latitude, longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: latitude, lng: longitude},
  zoom: 10
  });
  var marker = new google.maps.Marker({
    position: {lat: latitude, lng: longitude},
    map: map,
    title: 'You are here'
  });
}

function newInfo(latitude, longitude, locAccuracy) {
  var output = document.getElementById("info");
  var locAccuracy = Math.round(locAccuracy *= 3.28084);
  output.innerHTML = "<p>Latitude:<BR>" + latitude + "<BR><BR>Longitude:<BR>" + longitude + 
  "<BR><BR>Margin of error:<BR>" + locAccuracy + " feet(+/-)</p>";
}

function success(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;
  var locAccuracy = position.coords.accuracy;
  var map;
  newMap(map, latitude, longitude);
  newInfo(latitude, longitude, locAccuracy);
}

function failure(err) {
  if (err.code == 1) {
    alert("Your browser is not allowing this site to locate your computer. If you want to change this, refresh the page, click the 'locate' button again, and click 'allow' when your browser asks for your permission.");
  } else {
    alert("Your location is unavailable.")
  }
}

function locate() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(success, failure, {timeout:70000}); 
  } else {
    alert("Sorry, your browser doesn't support geolocation.");
    return;
  }
};