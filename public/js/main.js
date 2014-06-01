var phonecatApp = angular.module('donatePoolApp', []);

phonecatApp.controller('donatePoolCtrl', function ($scope) {
  $scope.instructions = [
    "Create or Join a Pool.",
    "Add money to the donation pool, and choose your preferred local charity.",
    "Predict the world cup to the best of your abilities.",
    "Add friends to your pool, then wait for the cup to start!"
  ];
  $scope.begin = true;
  $( ".main" ).fadeIn( 1000 );
});
