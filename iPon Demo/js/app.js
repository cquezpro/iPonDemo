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
  
   $rootScope.$on('$locationChangeStart', function(ev, next, current) {

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.tabs.position("bottom"); 
  $ionicConfigProvider.tabs.style("standard");
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  })

  .state('app.welcome', {
    url: "/welcome",
    views: {
      'menuContent': {
         templateUrl: "templates/welcome.html"
      }
    }
  })

  .state('app.map', {
    url: "/map",
    views: {
      'menuContent': {
		 templateUrl: "templates/map.html"
      }
    }
  })

   .state('app.contact-list', {
      url: "/contact-list",
      views: {
        'menuContent': {
          templateUrl: "templates/contact-list.html",
          controller: 'ContactlistCtrl'
        }
      }
    })	

  .state('app.contact', {
    url: "/contact-list/:contactId",
    views: {
      'menuContent': {
        templateUrl: "templates/contact.html",
        controller: 'ContactCtrl'
      }
    }
  });
  
  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

