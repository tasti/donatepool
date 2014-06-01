'use strict';

var donatePoolApp = angular.module('donatePoolApp', [
    'ngRoute',
    'donatePoolAppCtrl'
]);

donatePoolApp.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider.
            when('/predict', {
                templateUrl: '/partials/predict.html',
                controller: 'PredictCtrl'
            }).
            when('/part1', {
                templateUrl: '/partials/partial1.html',
                controller: 'MyCtrl1'
            }).
            when('/part2', {
                templateUrl: '/partials/partial2.html',
                controller: 'MyCtrl2'
            }).
            otherwise({
                redirectTo: '/'
    });

}]);
