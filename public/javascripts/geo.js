// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var shuffled;
var savedLocation;
var startingLoc;
var address;
var api;
var lat;
var long;

function initMap() {

  // locate();
  var pyrmont = {lat: 30.410111, lng: -97.725540};

  map = new google.maps.Map(document.getElementById('map'), {
    center: pyrmont,
    zoom: 15
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      pyrmont = {lat: position.coords.latitude, lng: position.coords.longitude};
      // console.log(position.coords.latitude, position.coords.longitude);
      // map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

console.log(pyrmont);
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
      lat = data.results[0].geometry.location.lat;
      long = data.results[0].geometry.location.lng;
      createMarker(data.results[0])
      console.log(data.results[0]);
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: long},
        zoom: 18
      });
    });

  }
}


