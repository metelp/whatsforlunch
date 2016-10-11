// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var shuffled;
var savedLocation;
var address;
var api;
var lat;
var long;

function initMap() {

  // locate();
  var pyrmont = {lat: 30.410111, lng: -97.725540};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 14
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      pyrmont = {lat: position.coords.latitude, lng: position.coords.longitude};
      console.log(position.coords.latitude);
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: pyrmont,
    radius: 2000,
    type: ['restaurant']
  }, callback);
}

function shuffle(array) {
    var counter = array.length, temp, index;

    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;

        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    shuffle(results);
    place = results.pop()
    results.unshift(place);
    createMarker(shuffle(results[0]));
    console.log(shuffle(results[0]).vicinity);
    address = shuffle(results[0]).vicinity;
    api = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyD9YrOSmjLQ9wPArBbys-hMBr4GtreXPPc";
    console.log(api);

     $.ajax({
      url: api,
      method: "GET",
      dataType: "json",
      jsonCallback: "info"
    })
    .done(function(data) {
      lat = data.results[0].geometry.location.latitude;
      long = data.results[0].geometry.location.longitude;
    });

      // 1600+Amphitheatre+Parkway,+Mountain+View,+CA);

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

function newMap(map, latitude, longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: latitude, lng: longitude},
  zoom: 15
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

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
infoWindow.setPosition(pos);
infoWindow.setContent(browserHasGeolocation ?
  'Error: The Geolocation service failed.' :
  'Error: Your browser doesn\'t support geolocation.');
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

