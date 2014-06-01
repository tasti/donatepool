var phonecatApp = angular.module('donatePoolApp', []);

phonecatApp.controller('donatePoolCtrl', function ($scope) {
  $scope.begin = true;
  $( ".main" ).fadeIn( 1000 );
});
