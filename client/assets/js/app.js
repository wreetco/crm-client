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

  //Thanks to marko on StackOverflow https://jsfiddle.net/200eoamf/1/
  .directive('onReadFile', function ($parse) {
      return {
          restrict: 'A',
          scope: false,
          link: function(scope, element, attrs) {
              element.bind('change', function(e) {

                  var onFileReadFn = $parse(attrs.onReadFile);
                  var reader = new FileReader();

                  reader.onload = function() {
                      var fileContents = reader.result;
                      // invoke parsed function on scope
                      // special syntax for passing in data
                      // to named parameters
                      // in the parsed function
                      // we are providing a value for the property 'contents'
                      // in the scope we pass in to the function
                      scope.$apply(function() {
                          onFileReadFn(scope, {
                              'contents' : fileContents
                          });
                      });
                  };
                  reader.readAsText(element[0].files[0]);
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



