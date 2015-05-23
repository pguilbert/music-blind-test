'use strict';

/**
 * @ngdoc function
 * @name blindTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the blindTestApp
 */
angular.module('blindTestApp')
  .controller('MainCtrl', function ($scope , $routeParams, $localstorage) {
    
    $scope.testAvailable = false;
    if($routeParams.musicIds != undefined) {
      $scope.testAvailable = true;
      $localstorage.set('musicIds', $routeParams.musicIds);
    } else if($localstorage.get('musicIds', false)) {
      $scope.testAvailable = true;
    }
    
  });
