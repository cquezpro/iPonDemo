angular.module('iPonDemo.controllers', ['ionic', 'ionic.rating', 'ngCordova'])
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

.controller('LoginCtrl', function($scope, $rootScope, FriendService, $http, $timeout, $ionicLoading,  $interval, $state,  $ionicPopup, $ionicActionSheet, sharedProperties) {	

	$scope.bConnect = false;

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
                	$scope.bConnect = true;
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

    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
})

.controller('SettingCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {

    $scope.goConnect = function () {
		$state.go('connect');
    };
})

.controller('AlertCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {

    $scope.goConnect = function () {
		$state.go('connect');
    };
});
