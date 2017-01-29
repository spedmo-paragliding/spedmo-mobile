angular.module('starter.services', [])

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

.service('UserService', function() {

  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})

.service('SpedmoService', function($localstorage, $http) {
	
	return {
		getUUID : function(accessToken) {			
			return $http.get('http://www.spedmo.com/json/getUUID.pg?accessToken=' + accessToken);
		},
		loadSpedmo : function(uuid, redirectUrl) {	
			
			var appDevice = 'unknown';
			if (ionic.Platform.isIOS()) {
				appDevice = 'ios';
			} else if (ionic.Platform.isAndroid()) {
				appDevice = 'android';
			}
			
			//alert('lat:' + $localstorage.get('latitude') + " lon:" +$localstorage.get('longitude') );
			var url = 'http://www.spedmo.com/uuidSignIn.pg?uuid=' + uuid + "&device=" + appDevice + "&pushToken=" + $localstorage.get('pushToken') + "&lat=" + $localstorage.get('latitude') + "&lon=" + $localstorage.get('longitude');
			
			if (redirectUrl!=null) {
				url = url + "&redirect=" + encodeURIComponent(redirectUrl)
			}
			
			var ref = window.open(url , '_blank', 'location=no,zoom=no,clearcache=yes,clearsessioncache=yes,toolbar=no');			
			ref.addEventListener('loadstart', function(event) { 			
				if (event.url.indexOf('signOut')!=-1) {
					ref.close();
					
				// this is a bit of a hacky way to send browser events to the device using inappbrowser page events.	
				} else if (event.url.indexOf('inAppBrowser.pg')!=-1) {					
					var action = /action=([^&]+)/.exec(event.url)[1];
										
					var facebookOptions = {
						method: action,					
					}; 	

					// if we have url param, add it to facebook request
					try {
					    var url = /url=([^&]+)/.exec(event.url)[1];					    
					    facebookOptions.link=url;
					}
					catch(err) {
					    console.log('aint got no url.');
					}
					
					// if we have a who param, add it to facebook request
					try {
					    var who = /who=([^&]+)/.exec(event.url)[1];					    
					    facebookOptions.to=who;
					}
					catch(err) {
					    console.log('aint got no who.');
					}
					
					facebookConnectPlugin.showDialog(facebookOptions, function() {
						// success, do nothing...
					}, function() {
						if (action=='send') {
					        navigator.notification.confirm('Install Facebook Messenger to use this feature.', function(buttonIndex) {
					        	// do nothing
					        }, 'Spedmo', [ "OK"]);
						}						
					});
				}
			});						
		}	
	}
});
