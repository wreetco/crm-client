(function() {
	'use strict';

	angular.module('application', ['ui.materialize', 'ngRoute', 'ngAnimate', 'application.controllers', 'application.services'])

	.config([
		'$locationProvider',
		'$routeProvider',
		function($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');
		//routes
		$routeProvider
			.when("/", {
				templateUrl: "./views/home.html",
				controller: "HomeController"
			})
      .when("/login", {
        templateUrl: "./views/_login_modal.html",
        controller: "AccountController"
      })
      .when("/contact", {
				templateUrl: "./views/contacts.html",
				controller: "ContactController"
			})
      .when("/contact/:id", {
				templateUrl: "./views/contacts.html",
			})
      .when("/contact/edit", {
				templateUrl: "./views/contacts.html",
			})
			.when("/settings", {
				templateUrl: "./views/settings.html",
				controller: "SettingsController"
			})
			.when("/statistics", {
				templateUrl: "./views/statistics.html",
				controller: "StatisticsController"
			})
			.otherwise({
				redirectTo: '/'
			});
		}
	])

  .config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpAddAuthHeaderIntercept');
  }])

  .run(['$rootScope', '$location', 'Session', function ($rootScope, $location, Session) {
    $rootScope.$on('$routeChangeStart', function (event) {
      if (!Session.isLoggedIn()) {
        //event.preventDefault();
        $location.path('/login');
      }
    });
  }])

  ;
}());



