'use strict';

var donatePoolAppCtrl = angular.module('donatePoolAppCtrl', []);

donatePoolAppCtrl.controller('MyPoolsCtrl', function ($scope, $http) {
    removeActiveClasses();
    $('#mypools').addClass("active");

    $scope.pools = [];

    $http.get('api/v1/getmypools')
        .success(function (data, status, headers, config) {
            console.log(data);

            data.data.forEach(function (moredata) {
                $scope.pools.push(moredata);
            });

        });
});

donatePoolAppCtrl.controller('HostCtrl', function ($scope, $http, $location) {
    removeActiveClasses();
    $('#host').addClass("active");

    $scope.poolName = '';
    $scope.members = '';
    $scope.varFixed = 'variable';
    $scope.fixedAmount = '';


    $scope.error = [];
    $scope.users = [];

    $http.get('api/v1/getusers')
        .success(function (data, status, headers, config) {
            console.log(data);

            data.data.forEach(function (moredata) {
                $scope.users.push(moredata);
            });

        });

    $scope.hostPool = function () {

        $scope.error = [];

        if ($scope.poolName.trim() == '') {
            $scope.error.push('You have to name your pool');
        }

        // Make members string into an array
        var re = "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
        var map = Array.prototype.map;
        var members = map.call($scope.members.split(','), function (x) { return x.trim(); }).filter(function (x) { return x != ''; });
        var membersRE = map.call(members, function (x) { return x.match(re); });;
        
        if (membersRE.indexOf(null) != -1) {
            $scope.error.push('Format your emails by delimiting them by commas. Ex: "email@address.com, me@example.com"');
        }

        var parseAmount = parseInt($scope.fixedAmount);
        console.log(parseAmount);
        console.log(!!parseAmount);
        if ($scope.varFixed == 'fixed' && (!!parseAmount == false) || parseAmount <= 0) {
            $scope.error.push('Enter a number greater than zero');
        }

        if ($scope.error.length == 0) {
            $http.post('api/v1/hostpool',
                { poolName: $scope.poolName, members: members, varFixed: $scope.varFixed, fixedAmount: parseAmount })
                .success(function (data, status, headers, config) {
                    console.log(status);

                    $location.path('/');
                });
        }
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

donatePoolAppCtrl.controller('PredictCtrl', function($scope){

});

function removeActiveClasses() {
    $('#mypools').removeClass("active");
    $('#host').removeClass("active"); 
    $('#join').removeClass("active");
}
