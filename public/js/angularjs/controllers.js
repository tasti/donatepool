'use strict';

var donatePoolAppCtrl = angular.module('donatePoolAppCtrl', []);

donatePoolAppCtrl.controller('MyPoolsCtrl', function ($scope) {
    removeActiveClasses();
    $('#mypools').addClass("active");
});

donatePoolAppCtrl.controller('HostCtrl', function ($scope, $http, $location) {
    removeActiveClasses();
    $('#host').addClass("active");

    $scope.poolName = '';
    $scope.members = '';
    $scope.varFixed = 'variable';
    $scope.fixedAmount = '';

    $scope.hostPool = function () {

        $http.post('api/v1/hostpool',
            { poolName: $scope.poolName, members: $scope.members, varFixed: $scope.varFixed, fixedAmount: $scope.fixedAmount })
            .success(function (data, status, headers, config) {
                console.log(status);

                $location.path('/');
            })
            .error(function (data, status, headers, config) {
                console.log(status);
            });
    };
});

donatePoolAppCtrl.controller('JoinCtrl', function ($scope, $http) {
    removeActiveClasses();
    $('#join').addClass("active");

    $scope.pools = [
        { name: 'Pool1', hostEmail: 'e@mail.com', members: ['a', 'b', 'c'], fixed: 10 },
        { name: 'Pool2', hostEmail: 'another@mail.com', members: ['a', 'b', 'c', 'd', 'e'], fixed: -1 },
        { name: 'Pool3', hostEmail: 'my@mail.com', members: ['a'], fixed: 5 }
    ];

    $http.get('api/v1/getpools')
        .success(function (data, status, headers, config) {
            console.log(data.data);

            data.data.forEach(function (moredata) {
                $scope.pools.push(moredata);
            });

        })
        .error(function (data, status, headers, config) {

        });
});

function removeActiveClasses() {
    $('#mypools').removeClass("active");
    $('#host').removeClass("active"); 
    $('#join').removeClass("active");
}