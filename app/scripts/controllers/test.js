'use strict';

/**
 * @ngdoc function
 * @name blindTestApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the blindTestApp
 */
angular.module('blindTestApp')
  .controller('TestCtrl', function ($scope , $routeParams, $http, $sce, $location, $localstorage) 
  {
    var that = this;
    
    var musicIds = $localstorage.get('musicIds', null); 
    if(musicIds === null || $routeParams.current === undefined) {
      $location.path("/");
      return;
    }
    
    $scope.loadPerCent = 0;
    $scope.musicIds = musicIds.split(',');
    var tmpCurrent = parseInt($routeParams.current);
    $scope.currentMusicIndex =  tmpCurrent >= $scope.musicIds.length ? $scope.musicIds.length - 1 : tmpCurrent;
    $scope.remaningTime = 10;
    $scope.showAnswer = false;
    $scope.canGoBack = $scope.currentMusicIndex !== 0;
    $scope.canGoForward = $scope.currentMusicIndex < ($scope.musicIds.length - 1);
    $scope.errorMessage = null;
    
    this.loadNewMusic = function(musicId)
    {
      $http.get('https://api.spotify.com/v1/tracks/' + musicId).
        success(function(data, status, headers, config) {
          console.log(data);
          that.dataSuccessfullyLoaded(data);
          $scope.loadPerCent = 25;
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          $scope.isBusy = false;
          if($scope.musicIds.length == 1) {
            $localstorage.clear();
            $location.path("/");            
          }
          $scope.errorMessage = "Unable to get this song...";
          $scope.timeUp();
        });
    }
    
    this.updateTimer = function() 
    {
      var rt = parseInt($scope.audio.duration - $scope.audio.currentTime);
      if(rt === $scope.remaningTime) 
        return;
      
      if(rt === 0)
        $scope.timeUp();
      $scope.remaningTime = rt;
      $scope.$apply();
    }
    
    this.dataSuccessfullyLoaded = function(data) 
    {
        $scope.currentMusicData = data;
        if($scope.currentMusicData.preview_url == null) 
        {
          $scope.errorMessage = "Unable to play this song...";
          $scope.timeUp();
          return;
        }
        $scope.audio = new Audio($scope.currentMusicData.preview_url);
        $scope.audio.ontimeupdate = function() {
          that.updateTimer();
        }
        $scope.audio.oncanplaythrough = function() {
          $scope.loadPerCent = 100;
          $scope.audio.play();
        }
    }
    
    $scope.timeUp = function() 
    {
      $scope.showAnswer = true;
    }
    
    $scope.$on('$destroy', function iVeBeenDismissed() {
      if($scope.audio != undefined) $scope.audio.pause();
    });
    
    this.loadNewMusic($scope.musicIds[$scope.currentMusicIndex]);
  });
