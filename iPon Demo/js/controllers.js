angular.module('iPonDemo.controllers', ['ionic', 'ionic.rating', 'jlareau.pnotify', 'ngCordova'])
.constant('baseURL','http://crm.welcomepickups.com/drivers-app/api/v1/')
.constant('api','/some/api/info')
.service('urls',
	function(domain, api) { 
		this.apiUrl = domain+api;
	}
)
.service('sharedProperties', function () {
        var property = [];
        return {
            getProperty: function () {
                return property;
            },
            setProperty: function(value) {
                property = value;
            }
        };
})
.directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                            scope.$eval(attrs.ngEnter);
                    });
                    
                    event.preventDefault();
                }
            });
        };
})
.controller('AppCtrl', function($scope, $rootScope, FriendService, $ionicModal, $timeout, $ionicLoading, $ionicSideMenuDelegate, $compile,$ionicLoading, $window, notificationService) {
  $rootScope.ContactList = [];
})

.controller('LoginCtrl', function($scope, $rootScope, FriendService, $http, $timeout, $ionicLoading,  $interval, $state,  $ionicPopup, $ionicActionSheet, sharedProperties) {	

	$scope.scanBLE = function () {
         ble.isEnabled(
            function () {
                alert("Bluetooth is enabled");
                /*ble.scan([], 15, function(device) {
                    alert(JSON.stringify(device));
                }, function (reason) {
                   alert("BLE Scan failed " + reason);
                });*/
                var scanSeconds = 10;
                alert("Scanning for BLE peripherals for " + scanSeconds + " seconds.");
                ble.startScan([], function (device) {
                    alert(JSON.stringify(device));
                }, function (reason) {
                   alert("BLE Scan failed " + reason);
                });

                setTimeout(ble.stopScan,
                    scanSeconds * 1000,
                    function () {
                        console.log("Scan complete");
                    },
                    function () {
                        console.log("stopScan failed");
                    }
                );
            },
            function () {
                alert("Bluetooth is *not* enabled, Please enable Bluetooth");
            }
        );       
        
    };

	$scope.forgotPassword = function () {
	   if($scope.loginData.email  == null || ($scope.loginData.email  != null && $scope.loginData.email.length < 1)) {
	   	   var alertPopup = $ionicPopup.alert({
			    title: 'Warning',
			    template: 'Please input Email Address!'
		   });
	   	   return ;
	   }
	   var sendPasswordTxt = '<span class="sendMail">Send Password at ' + $scope.loginData.email + '</span>';
	   var callTxt = '<a href="tel:+1-1800-555-5555" class="button">Call HQ to get a new Password</a>'
		// Show the action sheet
	   var forgotSheet = $ionicActionSheet.show({
	     buttons: [
	       { text: sendPasswordTxt },
	       { text: callTxt}
	     ],
	     titleText: '',
	     cancelText: 'Cancel',
	     cancel: function() {
	          // add cancel code..
        },
	     buttonClicked: function(index) {
	       if(index == 0) {
	       		$scope.resetPassword();
	       } else if(index == 1) {
				$scope.callPassword();
	       }
	       return true;
	     }
	   });

	};
	
	$scope.goPage = function () {
		var url="http://www.iPonDemo.co.uk";
		window.open(url, '_system', 'location=no');
	};	

	$scope.resetPassword = function () {
		return ;
	    var url  = "http://crm.welcomepickups.com/drivers-app/api/v1/login/" + $scope.loginData.email + "/resend_password";
	   	
	   	$ionicLoading.show({
    	  template: 'Loading...'
   		});

		$http.get(url).
		  success(function(data, status, headers, config) {
	    	$ionicLoading.hide();
	    	var alertPopup = $ionicPopup.alert({
			    title: 'Reset Password',
			    template: data.result
		   });
		    //alert(data);
		  }).
		  error(function(data, status, headers, config) {
		  	$ionicLoading.hide();
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	};
})

.controller('ContactlistCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {

	//$scope.contactlist = sharedProperties.getProperty();
	$scope.contactlist = [];
	$scope.page = 1;
	$scope.totalPage = 1;
	$scope.moredata = false;
	$scope.searchKey = "";

	$scope.init = function () {
		
	};

	$scope.loadMoreData = function () {
		
	};

	$scope.itemTapped = function(event, contact) {
		$state.go('app.contact', { contactId: contact.ContactId });
    };

    $scope.init();
})

// Controller that shows more detailed info about a contact
.controller('ContactCtrl', function($scope, $stateParams, FriendService, $window, $ionicLoading, $timeout) {
  console.log($stateParams.contactId);
  $scope.title = "Contact";
  $scope.contact = {};

	$ionicLoading.show({
    	  template: 'Loading...'
   	});

	$scope.openMap = function () {
		var url = "http://www.google.co.uk/maps/place/" + $scope.contact.CompanyAddressPostCode;
		var ref = window.open(url, '_system', 'location=no');
	};
});
