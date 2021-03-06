'use strict';

var donatePoolApp = angular.module('donatePoolApp', [
    'ngRoute',
    'ngDragDrop',
    'donatePoolAppCtrl'
]);

donatePoolApp.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider.
            when('/', {
                templateUrl: '/partials/mypools.html',
                controller: 'MyPoolsCtrl'
            }).
            when('/predict:poolId', {
                templateUrl: '/partials/predict.html',
                controller: 'PredictCtrl'
            }).
            when('/host', {
                templateUrl: '/partials/host.html',
                controller: 'HostCtrl'
            }).
            when('/join', {
                templateUrl: '/partials/join.html',
                controller: 'JoinCtrl'
            }).
            otherwise({
                redirectTo: '/'
    });

}]);
