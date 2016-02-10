// Ionic iPonDemo App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'iPonDemo' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'iPonDemo.controllers' is found in controllers.js


ionic.Gestures.gestures.Hold.defaults.hold_threshold = 20;

angular.module('iPonDemo', ['ionic', 'ionic.rating', 'iPonDemo.controllers', 'iPonDemo.services', 'iPonDemo.sortable'])

.run(function($ionicPlatform, $rootScope, $location, $ionicLoading, $timeout) {
  $ionicPlatform.ready(function() {
	
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)   
    if(navigator.splashscreen)
        navigator.splashscreen.hide();

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }      
  
   
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position("bottom"); 
  $ionicConfigProvider.tabs.style("standard");
  $stateProvider
  .state('connect', {
    url: "/connect",
    templateUrl: "templates/connect.html",
    controller: 'ConnectCtrl'
  })

  .state('settings', {
    url: "/settings",
    templateUrl: "templates/settings.html",
    controller: 'SettingCtrl'
  })

  .state('alerts', {
    url: "/alerts",
    templateUrl: "templates/alerts.html",
    controller: 'AlertCtrl'
  })

  .state('calendar', {
    url: "/calendar",
    templateUrl: "templates/calendar.html",
    controller: 'CalendarCtrl'
  })
  
  .state('buy', {
    url: "/buy",
    templateUrl: "templates/buy.html",
    controller: 'BuyCtrl'
  })
    
  .state('help', {
    url: "/help",
    templateUrl: "templates/help.html",
    controller: 'HelpCtrl'
  });
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/connect');
});

