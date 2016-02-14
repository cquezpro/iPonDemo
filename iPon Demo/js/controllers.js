var gProduct = 1;
var bSat = false;
var bLowBatt = false;
var gSatValue = 90;
var gPreSatValue = 0;
var gLowBattValue = 30;
var gPreLowBattValue = 0;

angular.module('iPonDemo.controllers', ['ionic', 'ionic.rating', 'ngCordova'])
.constant('baseURL','http://crm.welcomepickups.com/drivers-app/api/v1/')
.constant('api','/some/api/info')
.service('urls',
	function(domain, api) { 
		this.apiUrl = domain+api;
	}
)
.service('sharedProperties', function () {
        var property = {};
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

.controller('ConnectCtrl', function($scope, $rootScope, FriendService, $http, $timeout, $ionicLoading,  $interval, $state,  $ionicPopup, $ionicActionSheet, $window, sharedProperties) {	
        
    $scope.bFound = false;
    $scope.device_id = "";
    
    $scope.init = function() {
        $scope.status = {};
        $scope.status.bConnecting = true;
        $scope.status.bConnect = false;    
        $scope.status.bConnected = false;
        
        $scope.status.use_time = "4 Hours 37 Minutes";
        $scope.status.connectedClass = "blue";
        $scope.status.connectedSmallText = "It's time to";
        $scope.status.connectedBigText = "Change";
        
        sharedProperties.setProperty($scope.status);

        $scope.Batt_URL = "img/Batt_0.png";
        $scope.Sat_URL = "img/Tampon_90.png";
        
        //Run Scan BLE
        setTimeout(function(){ 
           $scope.scanBLE(); 
        }, 2000);
        
    };    
    
    
	$scope.scanBLE = function () {    
        $scope.bFound = false;
         ble.isEnabled(
            function () {
                var scanSeconds = 30;
                //alert("Scanning for BLE peripherals for " + scanSeconds + " seconds.");
                ble.startScan([], function(device) {
                    console.log("---start Scan----");                    
                    if($scope.bFound == true) {
                        return ;
                    }
                    
                    if(device.name != "TK0583 iPon") {
                        return ;
                    }
                    
                    console.log(JSON.stringify(device));
                    $scope.bConnect = true;
                    $scope.bFound = true;
                    console.log(device.id);
                    $scope.device_id = device.id;
                    
                   ble.connect($scope.device_id, connectSuccess, connectFailure);
                    
                }, function (reason) {
                   alert("BLE Scan failed " + reason);
                });
                
                setTimeout(ble.stopScan,
                    scanSeconds * 1000,
                    function () {
                        console.log("Scan complete");                        
                        if($scope.bFound == false) {
                           $scope.tryConnecting();
                        }
                    },
                    function () {
                        console.log("stopScan failed");                        
                        if($scope.bFound == false) {
                            $scope.tryConnecting();
                        }
                    }
               );
                
            },
            function () {
                alert("Bluetooth is *not* enabled, Please enable Bluetooth");
            }
        );        
    };
    
    var connectSuccess = function(deviceInfo) {
        alert("connectSuccess ");
        
        $scope.bDeviceConnected = true;
        
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.status.bConnect = false;
                $scope.status.bConnected = true;
                $scope.status.bConnecting = false;
            });
        }, 500);
        
        console.log(JSON.stringify(deviceInfo));
        
        //Battery
        bat_characteristic_uuid = "50000006-dead-beef-cafe-000000000000";
        bat_service_uuid = "50000000-dead-beef-cafe-000000000000";
        ble.startNotification($scope.device_id, bat_service_uuid, bat_characteristic_uuid, bat_notifySuccess, bat_notifyFailure);
        
        //Saturation
        sat_characteristic_uuid = "50000001-dead-beef-cafe-000000000000";
        sat_service_uuid = "50000000-dead-beef-cafe-000000000000";
        ble.startNotification($scope.device_id, sat_service_uuid, sat_characteristic_uuid, sat_notifySuccess, sat_notifyFailure);
        
        /*characteristic_uuid = "f000ffc1-0451-4000-b000-000000000000";
        service_uuid = "f000ffc0-0451-4000-b000-000000000000";
        ble.startNotification($scope.device_id, service_uuid, characteristic_uuid, sat_notifySuccess, sat_notifyFailure);*/
        
        //service_uuid = "1800";
        //characteristic_uuid = "2a00";
        //service_uuid = "fff0";
        //characteristic_uuid = "fff8";        
        
        /*setInterval(function(){ 
            ble.read($scope.device_id, service_uuid, characteristic_uuid, readSuccess, readFailure);
          }, 
        3000);*/                     
    };
    
    var readSuccess = function(arrData) {        
        alert("readSuccess ");
        /*var array = new Uint8Array(arrData.length);
       for (var i = 0, l = string.length; i < l; i++) {
           array[i] = string.charCodeAt(i);
           console.log(array[i]);
        }*/
        //console.log(ab2str(arrData));
        var data = new Uint8Array(arrData);
        console.log(typeof(data[0]));
        console.log(data[0].toString(16));
        console.log(typeof(data[1]));
        console.log(data[1].toString(16));
        console.log("data 0 = " + data[0] + "  data 1  = " + data[1]);
    };
    
    var readFailure = function() {
        alert("readFailure");    
    };
    
    var bat_notifySuccess = function(arrData) {
        console.log("battery - notifySuccess");        
        var data = new Uint8Array(arrData);
        
        console.log(data[0].toString());
        var a = data[0].toString();        
        var p = parseInt(a);
        
        if(bLowBatt && p >= gLowBattValue) {
            var msg = gLowBattValue.toString() + "% Battery on Charm";
            if(gPreLowBattValue != gLowBattValue) {
                gPreLowBattValue = gLowBattValue;
                setTimeout(function () {
                    if (window.cordova && window.cordova.plugins.notification) {
                        cordova.plugins.notification.local.schedule({ message: msg });
                    }
                }, 500);
            }
                //alert(gLowBattValue + "% Battery on Charm");
        }

        console.log("Battery percentage = " + p);
        
        if(p>=0 && p<25) {
            $scope.Batt_URL = "img/Batt_0.png";
        } else if(p>=25 && p<50) {
            $scope.Batt_URL = "img/Batt_25.png";
        } else if(p>=50 && p<75) {
            $scope.Batt_URL = "img/Batt_50.png";
        } else if(p>=75 && p<100) {
            $scope.Batt_URL = "img/Batt_75.png";
        } else if(p>75) {
            $scope.Batt_URL = "img/Batt_100.png";
        }
        
        console.log("battery percentage = " + a);
    };
    
    var bat_notifyFailure = function() {
        alert("battery - notifyFailure");
        ble.disconnect($scope.device_id, function () {
            //disconnect success
        }, function() {
            // failture
        });
    };
            
    var sat_notifySuccess = function(arrData) {
        console.log("saturation - notifySuccess");        
        var data = new Uint16Array(arrData);
        
        console.log(data[0].toString());
        var a = data[0].toString();
        
        var p = parseInt(a) * 100/1800;        
        console.log("Saturation percentage = " + p);
        
        if(bSat && p >= gSatValue) {
            //alert(gSatValue + "% iPon Saturaton Level Reached");
            var msg = gSatValue.toString() + "% iPon Saturaton Level Reached";
            if(gPreSatValue != gSatValue) {
                gPreSatValue = gSatValue;
                setTimeout(function () {
                    if (window.cordova && window.cordova.plugins.notification) {
                        cordova.plugins.notification.local.schedule({ message: msg });
                    }
                }, 500);   
            }            
        }
        
        $scope.percent = p;
        $scope.updateSaturationStatus();
    };
    
    var sat_notifyFailure = function() {
        alert("saturation - notifyFailure");            
        ble.disconnect($scope.device_id, function () {
            //disconnect success
        }, function() {
            // failture
        });
    };

    var connectFailure = function(err) {
        console.log(err);
        alert("connectFailure ");
        $scope.tryConnecting();
    };
    
    $scope.tryConnecting = function() {
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.status.bConnecting = false;
                $scope.status.bConnect = true;
                $scope.status.bConnected = false;
            });
        }, 500);
        
    };
    
    $scope.tryConnect = function() {        
        /*setTimeout(function () {
            $scope.$apply(function () {
                $scope.status.bConnect = false;
                $scope.status.bConnected = true;
                $scope.status.bConnecting = false;
            });
        }, 500);*/
        
        $scope.scanBLE();
    };
    
    $scope.tryConnected = function() {
        
        setTimeout(function () {
            $scope.$apply(function () {
                $scope.status.bConnect = true;
                $scope.status.bConnected = false;
                $scope.status.bConnecting = false;
                
                ble.disconnect($scope.device_id, disconnectSuccess, disconnectFailure);
            });
        }, 500);
        
        $scope.Batt_URL = "img/Batt_0.png";       
        
    };
    
    var disconnectSuccess = function () {
        alert("disconnectSuccess ");
        $scope.bDeviceConnected = false;
    };
    
    var disconnectFailure = function () {
        alert("disconnectFailure ");
    };      
   
    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $scope.updateSaturationStatus();
    });
    
    $scope.updateSaturationStatus = function () {
        console.log("updateSaturationStatus percent = " + $scope.percent);
        var p = $scope.percent;
        
        if(!$scope.bDeviceConnected) {
            $scope.tryConnecting();
            return ;    
        }
        
        if(!p) {
            return ;
        }
        
        $scope.status = sharedProperties.getProperty();
               
        setTimeout(function () {
            $scope.$apply(function () {
                if($scope.status.connectedClass == "blue") { // Tampon
                    $scope.Sat_URL = "img/Tampon_90.png";            
                    if(p>=0 && p<25) {
                        $scope.Sat_URL = "img/Tampon_10.png";
                    } else if (p>=25 && p<50) {
                        $scope.Sat_URL = "img/Tampon_25.png";
                    } else if (p>=50 && p<75) {
                        $scope.Sat_URL = "img/Tampon_50.png";
                    } else if (p>=75 && p<90) {
                        $scope.Sat_URL = "img/Tampon_75.png";
                    } else {
                        $scope.Sat_URL = "img/Tampon_90.png";
                    }
                    
                } else { //Pantiliner
                    $scope.Sat_URL = "img/Pad_90.png";
                    if(p>=0 && p<25) {
                        $scope.Sat_URL = "img/Pad_10.png";
                    } else if (p>=25 && p<50) {
                        $scope.Sat_URL = "img/Pad_25.png";
                    } else if (p>=50 && p<75) {
                        $scope.Sat_URL = "img/Pad_50.png";
                    } else if (p>=75 && p<90) {
                        $scope.Sat_URL = "img/Pad_75.png";
                    } else {
                        $scope.Sat_URL = "img/Pad_90.png";
                    }                    
                }  
            });
        }, 500);        
    }
    
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


.controller('SettingCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $ionicTabsDelegate, sharedProperties) {
    
    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $ionicTabsDelegate.select(-1);
    });
    
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
    
     $scope.selectProduct = function(idx) {
         if(idx === 1) {
           gProduct = 1;
           //alert("Tampon");
           $rootScope.connectedClass = "blue";
           $rootScope.connectedSmallText = "It's time to";
           $rootScope.connectedBigText = "Change";
             
           var property = {};
           property = {};
           property.bConnect = false;
           property.bConnected = true;
           property.bConnecting = false;
           property.use_time = "4 Hours 37 Minutes";
           property.connectedClass = "blue";
           property.connectedSmallText = "It's time to";
           property.connectedBigText = "Change";
           
           sharedProperties.setProperty(property);
             
           $scope.goConnect();
                      
         } else {
           gProduct = 2;
           //alert("Pantiliner");
           $rootScope.connectedClass = "light-blue";
           $rootScope.connectedSmallText = "You're doing";
           $rootScope.connectedBigText = "Great";
             
           var property = {};
           property = {};
           property.bConnect = false;
           property.bConnected = true;
           property.bConnecting = false;
           property.use_time = "2 Hours 23 Minutes";
           property.connectedClass = "light-blue";
           property.connectedSmallText = "You're doing";
           property.connectedBigText = "Great";
           
           sharedProperties.setProperty(property);
             
           $scope.goConnect();
             
         }
    };    
})

.controller('AlertCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $ionicTabsDelegate, sharedProperties) {
    
    $scope.init = function() {
        console.log("init");
        $scope.SatMode = { checked: false };
        $scope.LowBattMode = { checked: false };
        $scope.SatValue = "90";
        $scope.LowBattValue = "10";    
        
        
        setTimeout(function () {
            $scope.$apply(function () {
                
                if(window.localStorage.getItem("bSat") == "true" || window.localStorage.getItem("bSat") == true) {
                    $scope.SatMode.checked = true;
                } else {
                    $scope.SatMode.checked = false;
                }
                
                if(window.localStorage.getItem("bLowBatt") == "true" || window.localStorage.getItem("bLowBatt") == true) {
                    $scope.LowBattMode.checked = true;                     
                } else {
                    $scope.LowBattMode.checked = false;
                }
                
                $scope.SatValue = window.localStorage.getItem("gSatValue");
                $scope.LowBattValue = window.localStorage.getItem("gLowBattValue");
                
                if($scope.SatMode.checked == null) {
                    $scope.SatMode.checked = false;
                }
                
                if($scope.LowBattMode.checked == null) {
                    $scope.LowBattMode.checked = false;
                }
                
                if($scope.SatValue == null) {
                    $scope.SatValue = "90";
                }
                
                if($scope.LowBattValue == null) {
                    $scope.LowBattValue = "10";
                }
                
                console.log("SatMode = " + $scope.SatMode.checked);
                console.log("LowBattMode = " + $scope.LowBattMode.checked);
                console.log("gSatValue = " + $scope.SatValue);
                console.log("gLowBattValue = " + $scope.LowBattValue);      
            });
        }, 500);
        
          
    };    
    
    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $ionicTabsDelegate.select(1);
    });
    
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
    
    $scope.changeSatMode = function () {
      //alert($scope.SatMode.checked);  
        bSat = $scope.SatMode.checked;
        window.localStorage.setItem("bSat", bSat);
    };
    
    $scope.changeLowBattMode = function () {
      //alert($scope.SatMode.checked);  
        bLowBatt = $scope.LowBattMode.checked;
        window.localStorage.setItem("bLowBatt", bLowBatt);
    };
    
    $scope.changeSatValue = function () {
        gSatValue = parseInt(this.SatValue);
        console.log(gSatValue );
        window.localStorage.setItem("gSatValue", gSatValue);
    };
    
    $scope.changeLowBattValue = function () {
        gLowBattValue = parseInt(this.LowBattValue);
        console.log(gLowBattValue);
        window.localStorage.setItem("gLowBattValue", gLowBattValue);
    };
    
    $scope.init();
})

.controller('CalendarCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $ionicTabsDelegate, sharedProperties) {
    
    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $ionicTabsDelegate.select(2);
    });
    
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

.controller('BuyCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $compile, $ionicTabsDelegate, sharedProperties) {

    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $ionicTabsDelegate.select(3);
    });
    
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
    

    /*function initialize() {
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
      };*/
})

.controller('HelpCtrl', function($scope, $rootScope, FriendService, $timeout, $ionicLoading,  $interval, $state, $ionicScrollDelegate, $ionicTabsDelegate, sharedProperties) {

    $scope.$on('$ionicView.enter', function (viewInfo, state) {
        $ionicTabsDelegate.select(3);
    });
    
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


function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}