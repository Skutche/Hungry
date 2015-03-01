var UI = require('ui');
var ajax = require('ajax');
var postCode, lat, lng, latlng;
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};
 
function locationSuccess(pos) {
  //Dummy coordinates for Camden 51.540113, -0.142139
  /*var lat = 51.540113;
  var lng = -0.142139;*/
  lat =  pos.coords.latitude;
  lng =  pos.coords.longitude; 
  latlng = lat + "," + lng;
  
  // Construct URL
  var URL = 'http://maps.google.com/maps/api/geocode/json?latlng=' + latlng + '&sensor=false';
  
    // Make the request
  ajax(
    {
      url: URL,
      type: 'json'
    },
    function(data) {
      // Success
  
      if (data.results[0]) {
        for (var r = 0; r < data.results.length; ++r) {
          for (var i = 0; i < data.results[r].address_components.length; ++i) {
            for (var j = 0; j < data.results[r].address_components[i].types.length; ++j) {
              //For non-UK postcodes remove '_prefix'
              if (!postCode && data.results[r].address_components[i].types[j] == "postal_code") {
                postCode = data.results[r].address_components[i].long_name;
                
                displayCard();
                logPostcode();
              }
            }
          }
        }
      }
    },
    function(error) {
      // Failure
      console.log('Google Maps request failed: ' + error);
    }
  );
}

function displayCard() {
  //Following code only for demonstration purposes
  var card = new UI.Card({
    title:'Coordinates: ' + lat + ", " + lng,
    subtitle:'Postcode: ' + postCode
  });
  card.show();
}
 
function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
}
 
Pebble.addEventListener('ready',
  function(e) {
    // Request current position
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
);

function logPostcode() {
  console.log(postCode);
}
