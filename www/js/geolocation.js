	var onSuccess = function(position) {
		/*
		 * alert('Latitude: ' + position.coords.latitude + '\n' + 'Longitude: ' +
		 * position.coords.longitude + '\n' + 'Altitude: ' +
		 * position.coords.altitude + '\n' + 'Accuracy: ' +
		 * position.coords.accuracy + '\n' + 'Altitude Accuracy: ' +
		 * position.coords.altitudeAccuracy + '\n' + 'Heading: ' +
		 * position.coords.heading + '\n' + 'Speed: ' + position.coords.speed +
		 * '\n' + 'Timestamp: ' + position.timestamp + '\n');
		 */
		localStorage['latitude'] = position.coords.latitude;
		localStorage['longitude'] = position.coords.longitude;
		
		if (localStorage['uuid'].length != 0) {
			var url = "http://www.spedmo.com/geoNotify.pg?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&pushToken=" + localStorage['pushToken']
					+ "&uuid=" + localStorage['uuid'] + "&device=" + device.platform;

			// fire off a request into the ether...
			$.get(url);
		}

	};

	// onError Callback receives a PositionError object
	//
	function onError(error) {
		// alert('code: ' + error.code + '\n' +
		// 'message: ' + error.message + '\n');
	}

	/*
	navigator.geolocation.watchPosition(onSuccess, onError, {
		maximumAge : 60000,
		timeout : 3600000,
		enableHighAccuracy : false
	});
	*/
	
	function getCurrentLocation() {
	    // runs every 10 minutes if app is active...
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	}
	

document.addEventListener("deviceready", function() {
	getCurrentLocation();
	setInterval(getCurrentLocation, 5*60*1000);
}, false);


// fire off a location request on a resume
document.addEventListener("resume", function() {
	getCurrentLocation();
}, false);