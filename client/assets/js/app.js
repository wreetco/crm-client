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
      .when("/contacts", {
				templateUrl: "./views/contacts.html",
				controller: "ContactController"
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

  .directive("contenteditable", function() {
    return {
      restrict: "A",
      require: "ngModel",
      link: function(scope, element, attrs, ngModel) {

        function read() {
          ngModel.$setViewValue(element.html());
        }

        ngModel.$render = function() {
          element.html(ngModel.$viewValue || "");
        };

        element.bind("blur keyup change", function() {
          scope.$apply(read);
        });
      }
    };
  })

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



