//Global variables used for google map API
var infowindow;
var geocoder;
var map;

/*
Writes an input form to the page to all a new contact to be added to the database
// http://www.randomsnippets.com/2008/02/21/how-to-dynamically-add-form-elements-via-javascript/
*/
function writeAddForm() {
	document.getElementById("input_area").innerHTML = '<form name="newcontactform" id="newcontactform" onsubmit="return false"><label for="fname">First Name</label><input type="text" id="fname" placeholder="First Name" pattern="^([a-zA-Z]{1,25})?" maxlength="25" title="Only letters are allowed"/></br></form>';
	var test = document.getElementById("newcontactform");
	test.innerHTML += '<label for="lname">Last Name</label><input type="text" id="lname" placeholder="Last Name" pattern="^([a-zA-Z-]{1,25})?" maxlength="25" title="Only letters and dashes are allowed"/></br>';
	test.innerHTML += '<label for="phone">Phone</label><input type="tel" id="phone" placeholder="Phone" maxlength="14" title="Only enter 10 digits (no brackets or dashes)"/></br>';
	test.innerHTML += '<label for="email">Email</label><input type="email" id="email" placeholder="Email: user@domain.com" maxlength="45"/></br>';
	test.innerHTML += '<label for="fb">Facebook</label><input type="url" id="fb" placeholder="facebook link" pattern="((https:\/\/www.facebook.com\/)+[\\w.-]+)?" maxlength="45" title="Please copy the entire facebook.com link"/></br>';
	test.innerHTML += '<label for="addr1">Address Line 1</label><input type="text" id="addr1" placeholder="Address Line 1" pattern="(\\d+\\s([neswNESW\\s.]+)?\\w+\\s[A-z.]+)?" maxlength="45" title="Please input a valid address. Eg: 123 E Main St. or 987 8th Avenue"/></br>';
	test.innerHTML += '<label for="addr2">Address Line 2</label><input type="text" id="addr2" placeholder="Address Line 2" maxlength="25" title="Please input a valid apartment or suite number"/></br>';
	test.innerHTML += '<label for="city">City</label><input type="text" id="city" placeholder="City" pattern="[a-zA-Z\\s]{1,44}" maxlength="44" title="Please input a valid city"/></br>';
	test.innerHTML += '<label for="state">State</label><input type="text" id="state" placeholder="State" pattern="[A-Z]*" maxlength="25" title="Use 2 digit state codes instead of state names"/></br>';
	test.innerHTML += '<label for="zip">Zip</label><input type="text" id="zip" placeholder="Zip" pattern="^\\d{5}(?:[-]\\d{4})?$" maxlength="10" title="Please input a valid zip code: 12345 or 12345-6789"/></br>';
	test.innerHTML += '<button class="btn btn-danger formReset" type="button" onclick="reset(this)">Clear Form</button>';
	test.innerHTML += '<button class="btn btn-success formSubmit" type="submit" onclick="validate()">Submit</button>';
}

/*
Function provided by the google map API to initialize a map object
https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
*/
function initialize() {
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(44.0521, -123.0868);
    var mapOptions = {
    	zoom: 12,
    	center: latlng
    }
    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}
/*
Function provided by the google map API to transpose an address into geocordinates. A marker is added on the map
*/
function codeAddress(address) {
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        map.setZoom(14);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div><strong>' + results[0].formatted_address + '</strong><br>');
            infowindow.open(map, this);
        });
      } else {
        console.log('Geocode was not successful for the following reason: ' + status);
      }
	});
}
/*
Invokes lookupAddress.php to determine the address on file for a user. 
codeAddress is called with the result and a marker is added to the map.
*/
function openAddr(contact_id) {
	//unhide("map");
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			codeAddress(this.responseText);
		}
	};
	xmlhttp.open("GET","files/php/lookupAddress.php?contact_id="+contact_id,true);
	xmlhttp.send();
}