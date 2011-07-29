var Map = function() {
	return {
		getLatLngMidpoint: function(pointA, pointB) {
			var toRad = function(n) {
				return (n*Math.PI/180);
			};
			var toDeg = function(n) {
				return (n*180/Math.PI);
			};
			if (pointA && pointB) {
				var a = toRad(pointA.lat()), b = toRad(pointB.lat()), z = pointA.lng(), d = toRad(pointB.lng()-pointA.lng());
				var x = Math.cos(b) * Math.cos(d);
				var y = Math.cos(b) * Math.sin(d);
				var latitude = Math.atan2(Math.sin(a)+Math.sin(b), Math.sqrt((Math.cos(a)+x)*(Math.cos(a)+x) + y*y));
				var longitude = toRad(z) + Math.atan2(y, Math.cos(a) + x);	
				return (latitude && longitude) ? new google.maps.LatLng(toDeg(latitude), toDeg(longitude)) : null;
			}
			return null;
		},
		hCardToMarker: function(card) {
			var vCard = (card instanceof Object) ? card : Microformats.hCardToJSON(card);
			var latLngPoint = new google.maps.LatLng(vCard['adr']['geo']['latitude'], vCard['adr']['geo']['longitude']);
			// Create the custom Icon.			
			var markerIcon = new google.maps.Icon();
			markerIcon.image = vCard['photo'];
			markerIcon.shadow = 'http://maps.google.com/intl/en_us/mapfiles/ms/micons/pushpin_shadow.png';
			markerIcon.iconSize = new google.maps.Size(32, 32);
			markerIcon.shadowSize = new google.maps.Size(59, 32);
			markerIcon.iconAnchor = new google.maps.Point(11, 32);
			markerIcon.infoWindowAnchor = new google.maps.Point(20, 2);
			markerIcon.infoShadowAnchor = new google.maps.Point(22, 32);
			// Create the marker.
			var marker = new google.maps.Marker(latLngPoint,  {icon:markerIcon, title:vCard['fn']});
			google.maps.Event.addListener(marker, "click", function() {
				var googleMapsWeddingMap = document.getElementById('google-maps-wedding-map');
				marker.openInfoWindowHtml('<div class="maps-bubble">'+vCard['vCard'].innerHTML+'<p><a href="'+googleMapsWeddingMap.getAttribute('href')+'">'+googleMapsWeddingMap.firstChild.nodeValue+'<\/a><\/p><\/div>');
			});
			return marker;			
		}
	};
}();

var onGoogleMapsInitialize = function() {
	// Convert the 3 hCards to a JSON object literal.
	var vcardCeremony = Microformats.hCardToJSON('vcard-ceremony');
	var vcardReception = Microformats.hCardToJSON('vcard-reception');
	var vcardAccommodations = Microformats.hCardToJSON('vcard-accommodations');
	
	// Set up the location Points.
	var latLngCeremony = new google.maps.LatLng(vcardCeremony['adr']['geo']['latitude'], vcardCeremony['adr']['geo']['longitude']);
	var latLngReception = new google.maps.LatLng(vcardReception['adr']['geo']['latitude'], vcardReception['adr']['geo']['longitude']);
	var latLngAccommodations = new google.maps.LatLng(vcardAccommodations['adr']['geo']['latitude'], vcardAccommodations['adr']['geo']['longitude']);

	// Create the Events map and plot the locations.
	var mapEvents = new google.maps.Map2(document.getElementById('google-maps-events'));
	mapEvents.addControl(new google.maps.SmallMapControl());
	mapEvents.addControl(new google.maps.MapTypeControl());
	// Center the map between the Ceremony and Reception.
	mapEvents.setCenter(Map.getLatLngMidpoint(latLngCeremony, latLngReception), 11);
	// Create the markers.
	mapEvents.addOverlay(Map.hCardToMarker(vcardCeremony));
	mapEvents.addOverlay(Map.hCardToMarker(vcardReception));
	mapEvents.addOverlay(Map.hCardToMarker(vcardAccommodations));
	
	// Create the Accommodations maps and plot the locations.
	var mapAccommodations = new google.maps.Map2(document.getElementById('google-maps-accommodations'));
	mapAccommodations.addControl(new google.maps.SmallMapControl());
	mapAccommodations.addControl(new google.maps.MapTypeControl());
	mapAccommodations.setCenter(latLngAccommodations, 11);
	// To make sure both maps are seperate, we have to create new markers just for this map.
	mapAccommodations.addOverlay(Map.hCardToMarker(vcardCeremony));
	mapAccommodations.addOverlay(Map.hCardToMarker(vcardReception));
	mapAccommodations.addOverlay(Map.hCardToMarker(vcardAccommodations));
};

// Load Google Maps.
google.load('maps', '2.x');
google.setOnLoadCallback(onGoogleMapsInitialize);