angular.module('application.controllers', [])
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
	])
;

