// Spedmo Ionic Starter App

angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $localstorage, $ionicPopup, SpedmoService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    var push = PushNotification.init({
        android: {
            senderID: "871326282616"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });

    push.on('registration', function(data) {
        $localstorage.set('pushToken', data.registrationId);	
    });

    push.on('notification', function(data) {

        navigator.notification.confirm(data.message, function(buttonIndex) {
            switch(buttonIndex) {
                case 1:
                    // do nothing
                    break;
                case 2:
                	SpedmoService.loadSpedmo($localstorage.get('uuid'), data.additionalData.url);
                    break;
            }
        }, data.title, [ "Dismiss", "Show" ]);

    });

    push.on('error', function(e) {
        alert(e.message);
    });
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
	.state('start', {
		url : '/start',
		templateUrl : "views/start.html",
		controller : 'StartCtrl'
	})
	.state('webapp', {
		url : '/webapp',
		templateUrl : "views/blank.html",
		controller : 'WebAppCtrl'
	});
    
  	//if (typeof window.localStorage['uuid'] !== 'undefined'){	
  		$urlRouterProvider.otherwise('/webapp');
  	//} else {
  	//	$urlRouterProvider.otherwise('/start');	  
  	//}

});
