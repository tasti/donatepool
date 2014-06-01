'use strict';

var donatePoolAppCtrl = angular.module('donatePoolAppCtrl', []);

donatePoolAppCtrl.controller('MyPoolsCtrl', function ($scope, $http) {
    removeActiveClasses();
    $('#mypools').addClass("active");

<<<<<<< HEAD
    $scope.pools = [
    { name: 'SampleData', hostEmail: 'e@mail.com', members: ['a', 'b', 'c'], fixed: 5 }
    ];
=======
    $scope.pools = [];
>>>>>>> e9ca5aa4221d697efe8fd4cb17e62757bda18c27

    $http.get('api/v1/getmypools')
    .success(function (data, status, headers, config) {
        console.log(data);

        data.data.forEach(function (moredata) {
            $scope.pools.push(moredata);
        });

<<<<<<< HEAD
    })
    .error(function (data, status, headers, config) {

    });
=======
        });
>>>>>>> e9ca5aa4221d697efe8fd4cb17e62757bda18c27
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

donatePoolAppCtrl.controller('PredictCtrl', function($scope, $http){
  $scope.event_name = [
    "Group Stage",
    "Round of 16",
    "Quarter Finals",
    "Semi Finals",
    "Finals"
  ];
  $scope.views = [
  "group_stage",
  "round_of_16",
  "quarter_finals",
  "semi_finals",
  "finals"
  ];
  $scope.current = 0;

  $scope.next = function() {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    ++$scope.current;
    if ($scope.views[$scope.current] === 'round_of_16') { //We have to set up the matches for the first time
        $scope.next_round = [];
        var index = 1;
        for(var i = 0; i < $scope.group_stage.length; i+=2 ) {
           var current_group = $scope.group_stage[i];
           var next_group = $scope.group_stage[i+1];
           current_group.first_place = current_group.first_place.team ? current_group.first_place : current_group.teams.splice(parseInt(Math.random() * current_group.teams.length), 1)[0];
           current_group.second_place = current_group.second_place.team ? current_group.second_place : current_group.teams.splice(parseInt(Math.random() * current_group.teams.length), 1)[0];
           next_group.first_place = next_group.first_place.team ? next_group.first_place : next_group.teams.splice(parseInt(Math.random() * next_group.teams.length), 1)[0];
           next_group.second_place = next_group.second_place.team ? next_group.second_place : next_group.teams.splice(parseInt(Math.random() * next_group.teams.length), 1)[0];

           $scope.next_round.push({
                winner: {},
                section: "Match " + index++,
                teams: [current_group.first_place, next_group.second_place]
           });
           $scope.next_round.push({
                winner: {},
                section: "Match " + index++,
                teams: [current_group.second_place, next_group.first_place]
           });
       }
   } else {
      var index = 1;
      var new_next_round = [];
      for(var i = 0; i < $scope.next_round.length; i+=2 ) {
        var current_match = $scope.next_round[i];
        var next_match = $scope.next_round[i+1];
        current_match.winner = current_match.winner.team ? current_match.winner : current_match.teams.splice(parseInt(Math.random() * current_match.teams.length), 1)[0];
        next_match.winner = next_match.winner.team ? next_match.winner : next_match.teams.splice(parseInt(Math.random() * next_match.teams.length), 1)[0];
        new_next_round.push({
                winner: {},
                section: "Match " + index++,
                teams: [current_match.winner, next_match.winner]
        });
      }
      $scope.next_round = new_next_round;
   }
}

$http.get('/js/teams.json')
.success(function(data){
  $scope.group_stage = data.groups;
      //Set up:
      for(var i = 0; i < $scope.group_stage.length; i++) {
        $scope.group_stage[i].first_place = {};
        $scope.group_stage[i].second_place = {};
    }
});
});

function removeActiveClasses() {
    $('#mypools').removeClass("active");
    $('#host').removeClass("active");
    $('#join').removeClass("active");
}
