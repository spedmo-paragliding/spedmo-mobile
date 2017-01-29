angular.module('starter.controllers', [])

.controller('WebAppCtrl', function($scope, $state, $q, UserService, $ionicLoading, $ionicPlatform, SpedmoService, $localstorage) {

	$ionicPlatform.registerBackButtonAction(function(event) {
		event.preventDefault();
	}, 100);
	
	$scope.$on('$ionicView.enter', function(){
		// this is called if the user has a uuid stored from a previous log-in...
		SpedmoService.loadSpedmo($localstorage.get('uuid'), null);		
	});
	
	$scope.facebookSignIn = function() {
		SpedmoService.loadSpedmo($localstorage.get('uuid'), null);
	}
		
})

.controller('StartCtrl', function($scope, $state, $q, UserService, $ionicLoading, $ionicPlatform, SpedmoService, $localstorage) {
	
	// This is the success callback from the login method
	var fbLoginSuccess = function(response) {
		if (!response.authResponse) {
			fbLoginError("Cannot find the authResponse");
			return;
		}

		var authResponse = response.authResponse;
				
		SpedmoService.getUUID(user.authResponse.accessToken).success(function(data){
			$localstorage.set('uuid', data);
			SpedmoService.loadSpedmo(data, null);	
		});	
	};

	// This is the fail callback from the login method
	var fbLoginError = function(error) {
		console.log('fbLoginError', error);
		$ionicLoading.hide();
	};

	// this method is to get the user profile info from the facebook api
	var getFacebookProfileInfo = function(authResponse) {
		var info = $q.defer();

		facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null, function(response) {
			console.log(response);
			info.resolve(response);
		}, function(response) {
			console.log(response);
			info.reject(response);
		});
		return info.promise;
	};

	// This method is executed when the user press the "Login with facebook"
	// button
	$scope.facebookSignIn = function() {

		facebookConnectPlugin.getLoginStatus(function(success) {
			if (success.status === 'connected') {
				// the user is logged in and has authenticated your app, and
				// response.authResponse supplies
				// the user's ID, a valid access token, a signed request, and
				// the time the access token
				// and signed request each expire
				console.log('getLoginStatus', success.status);

				// check if we have our user saved
				var user = UserService.getUser('facebook');
				SpedmoService.getUUID(user.authResponse.accessToken).success(function(data){
					$localstorage.set('uuid', data);
					SpedmoService.loadSpedmo(data, null);	
				});							
			} else {
				// if (success.status === 'not_authorized') the user is logged
				// in to Facebook, but has not authenticated your app
				// else The person is not logged into Facebook, so we're not
				// sure if they are logged into this app or not.
				console.log('getLoginStatus', success.status);

				$ionicLoading.show({
					template : 'Logging in...'
				});

				// ask the permissions you need. You can learn more about FB
				// permissions here:
				// https://developers.facebook.com/docs/facebook-login/permissions/v2.4
				facebookConnectPlugin.login([ 'email', 'public_profile' ], fbLoginSuccess, fbLoginError);
			}
		});
	};
	
	$ionicPlatform.registerBackButtonAction(function(event) {
		event.preventDefault();
	}, 100);
		
});
