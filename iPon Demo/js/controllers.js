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

	$scope.bConnecting = true;
    $scope.bConnect = false;    
    $scope.bConnected = false;
    
    $scope.use_time = "4 Hours 37 Minutes";
    $scope.connectedClass = "blue";
    $scope.connectedSmallText = "It's time to";
    $scope.connectedBigText = "Change";

    $scope.Batt_URL = "img/Batt_0.png";
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

    $scope.tryConnecting = function() {
        $scope.bConnecting = false;
        $scope.bConnect = true;
        $scope.bConnected = false;
    };
    
    $scope.tryConnect = function() {
        $scope.bConnect = false;
        $scope.bConnected = true;
        $scope.bConnecting = false;
    };
    $scope.tryConnected = function() {
        $scope.bConnect = true;
        $scope.bConnected = false;
        $scope.bConnecting = false;
    };
    
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };
})

.controller('SettingCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {
    
    $scope.goConnect = function () {
		$state.go('connect');
    };
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };
})

.controller('AlertCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {
    $scope.goConnect = function () {
		$state.go('connect');
    };
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };;
})

.controller('CalendarCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {

    $scope.goConnect = function () {
		$state.go('connect');
    };
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };
})

.controller('BuyCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $compile, sharedProperties) {

    $scope.goConnect = function () {
		$state.go('connect');
    };
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };
    

    function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-area"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
})

.controller('HelpCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, sharedProperties) {

    $scope.goConnect = function () {
		$state.go('connect');
    };
    
    $scope.goSetting = function () {
		$state.go('settings');
    };

    $scope.goAlert = function () {
    	$state.go('alerts');
    };
    
    $scope.goCalendar = function () {
    	$state.go('calendar');
    };
    
    $scope.goBuy = function () {
    	$state.go('buy');
    };
    
    $scope.goHelp = function () {
    	$state.go('help');
    };
});


