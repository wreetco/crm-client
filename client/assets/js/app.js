(function() {
	'use strict';

	angular.module('application', ['ui.materialize', 'ngRoute', 'ngAnimate'])

	.config([
		'$locationProvider',
		'$routeProvider',
		function($locationProvider, $routeProvider) {
		$locationProvider.hashPrefix('!');
		//routes
		$routeProvider
			.when("/", {
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

	//controllers

	.controller('ContactController', [
		'$scope',
		function($scope) {
			$scope.test = "Test Output Contact page";
		}
	])

	.controller('SettingsController', [
		'$scope',
		function($scope) {
			$scope.test = "Test Output Settings Page";
		}
	])
        .controller('StatisticsController', [
                '$scope',
                function($scope) {
                        $scope.test = "Test Output Statistics Page";
                }
        ]);
}());



