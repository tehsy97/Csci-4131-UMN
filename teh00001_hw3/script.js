var int;
var slideIndex = 0;
var marker;
var infowindow;
var myLatLng;
var map;
var markers = [];
var searchButton;
var directionsService;
var directionsDisplay;

function initMap() {
  myLatLng = { lat: 44.9727, lng: -93.23540000000003 };
  /* Create a map and place it on the div */
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 14,
    center: myLatLng
  });

  infoWindow = new google.maps.InfoWindow();
  var geocoder = new google.maps.Geocoder(); // Create a geocoder object

  var input = document.getElementById("eventlocation");
  var autocomplete = new google.maps.places.Autocomplete(input);

  var n = document.getElementsByClassName("getname");
  var p = document.getElementsByClassName("getplace");

  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: map,
    panel: document.getElementById("right-panel")
  });

  google.maps.event.addListener(map, "click", function(event) {
    geocoder.geocode(
      {
        latLng: event.latLng
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            // alert(results[0].formatted_address);
            input.value = results[0].formatted_address;
          }
        }
      }
    );
  });

  var place = [];
  var address = [];
  for (i = 0; i < n.length; i++) {
    if (place.length == 0 || !place.includes(n[i].innerHTML)) {
      place.push(n[i].innerHTML);
      address.push(p[i].innerText);
    }
  }

  for (i = place.length - 1; i >= 0; i--) {
    geocodeAddress(geocoder, address[i], place[i]);
  }

  var service = new google.maps.places.PlacesService(map);
  searchButton = document.getElementById("search");
  var goButton = document.getElementById("go");
  // Perform a nearby search.
  searchNearBy(service);
  toDestination(goButton);
}

function toDestination(goButton) {
  directionsDisplay.setMap(map);
  goButton.addEventListener("click", function() {
    deleteMarkers();
    var radios = document.getElementsByName("transport");
    var tMode;
    // loop through list of radio buttons
    for (var i = 0, len = radios.length; i < len; i++) {
      if (radios[i].checked) {
        // radio checked?
        tMode = radios[i].value; // if so, hold its value in tMode
        break; // and break out of for loop
      }
    }
    //get input
    var fin_destination = document.getElementById("destination").value;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var cur_location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          displayRoute(
            cur_location,
            fin_destination,
            tMode,
            directionsService,
            directionsDisplay
          );
        },
        function() {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function createMarkers(place) {
  var image = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };

  var marker = new google.maps.Marker({
    map: map,
    icon: image,
    title: place.name,
    position: place.geometry.location
  });
  markers.push(marker);

  infowindow = new google.maps.InfoWindow({
    content: place.name + "<br>" + place.formatted_address
  });

  google.maps.event.addListener(marker, "click", function() {
    infowindow.setContent(place.name + "<br>" + place.formatted_address);
    infowindow.open(map, this);
  });
}

// This function takes a geocode object, a map object, and an address, and
// if successful in finding the address, it places a marker with a callback that shows an
// info window when the marker is "clicked"
function geocodeAddress(geocoder, address, place_name) {
  geocoder.geocode({ address: address }, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      var iconBase = "https://maps.google.com/mapfiles/kml/pushpin/";
      map.setCenter(results[0].geometry.location);
      var marker2 = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location,
        title: address,
        icon: iconBase + "red-pushpin.png"
      });

      markers.push(marker2);
      var infowindow2 = new google.maps.InfoWindow({
        content: place_name + "<br>" + address
      });

      google.maps.event.addListener(
        marker2,
        "click",
        createWindow(map, infowindow2, marker2)
      );
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    } //end if-then-else
  }); // end call to geocoder.geocode function
} // end geocodeAddress function

// Function to return an anonymous function that will be called when the rmarker created in the
// geocodeAddress function is clicked
function createWindow(rmap, rinfowindow, rmarker) {
  return function() {
    rinfowindow.open(rmap, rmarker);
  };
} //end create (info) window

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function showsSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length - 1) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";
  //  setTimeout(showSlides, 2000); // Change image every 2 seconds
}

function startClock() {
  int = setInterval(function() {
    showsSlides();
  }, 2000);
}

function textValidator() {
  var letters = /^[0-9a-zA-Z ]+$/;
  var ename = document.forms["myForm"]["eventname"].value;
  var elocation = document.forms["myForm"]["eventlocation"].value;
  if (!ename.match(letters) && !elocation.match(letters)) {
    alert("Event Name and Location must be alphanumeric");
    return false;
  } else if (!elocation.match(letters)) {
    alert("Event Location must be alphanumeric");
    return false;
  } else if (!ename.match(letters)) {
    alert("Event Name must be alphanumeric");
    return false;
  }
}

function checkstrength() {
  var pwd = document.getElementById("password").value;
  var bar = document.getElementById("strength");
  var r = document.getElementById("result");
  var strength = 0;

  if (pwd.length <= 6 && pwd.length > 0) {
    bar.value = 1;
    r.className = "";
    r.classList.add("short");
    r.innerHTML = "Short";
  } else if (pwd.length >= 7) {
    strength += 1;
    // If password contains both lower and uppercase characters, increase strength value.
    if (pwd.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      strength += 1;
    }
    // If it has numbers and characters, increase strength value.
    if (pwd.match(/([a-zA-Z])/) && pwd.match(/([0-9])/)) strength += 1;
    // If it has one special character, increase strength value.
    if (pwd.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // If it has two special characters, increase strength value.
    if (pwd.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) {
      strength += 1;
    }
    // Calculated strength value, we can return messages
    // If value is less than 2
    if (strength < 2) {
      bar.value = 2;
      r.className = "";
      r.classList.add("weak");
      r.innerHTML = "Weak";
    } else if (strength == 2) {
      bar.value = 3;
      r.className = "";
      r.classList.add("good");
      r.innerHTML = "Good";
    } else {
      bar.value = 5;
      r.className = "";
      r.classList.add("strong");
      r.innerHTML = "Strong";
    }
  } else {
    bar.value = 0;
    r.innerHTML = "&nbsp";
  }
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: "en" },
    "google_translate_element"
  );
}

//check "find" options.
function checkOptions() {
  deleteMarkers();
  if (document.getElementById("others").selected != false) {
    document.getElementById("otherplaces").disabled = false;

    var r = document.getElementById("radius");
    searchButton.addEventListener("click", function() {
      var service = new google.maps.places.PlacesService(map);
      var input = document.getElementById("otherplaces").value;
      deleteMarkers();
      service.nearbySearch(
        { location: myLatLng, radius: r.value, keyword: [input] },
        function(results, status) {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
              createMarkers(results[i]);
            }
            map.setCenter(results[0].geometry.location);
          }
        }
      );
    });
  } else {
    deleteMarkers();
    document.getElementById("otherplaces").value = "null";
    document.getElementById("otherplaces").disabled = true;
  }
}

function searchNearBy(service) {
  document.getElementById("otherplaces").value="";
  var f = document.getElementById("find");
  var r = document.getElementById("radius");
  deleteMarkers();
  searchButton.addEventListener("click", function() {
    if (document.getElementById("others").selected != false) {
      deleteMarkers();
      return;
    }
    deleteMarkers();
    var selected = f.options[f.selectedIndex].value;
    service.nearbySearch(
      { location: myLatLng, radius: r.value, type: [selected] },
      function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarkers(results[i]);
          }
          map.setCenter(results[0].geometry.location);
        }
      }
    );
  });
}

function displayRoute(origin, destination, tMode, service, display) {
  service.route(
    {
      origin: origin,
      destination: destination,
      travelMode: tMode,
      avoidTolls: true
    },
    function(response, status) {
      if (status === "OK") {
        display.setDirections(response);
      } else {
        alert("Could not display directions due to: " + status);
      }
    }
  );
}
