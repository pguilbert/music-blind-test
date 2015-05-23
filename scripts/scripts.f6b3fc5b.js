"use strict";angular.module("blindTestApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/:musicIds?",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/test/:current",{templateUrl:"views/test.html",controller:"TestCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("blindTestApp").factory("$localstorage",["$window",function(a){return{set:function(b,c){a.localStorage[b]=c},get:function(b,c){return a.localStorage[b]||c},setObject:function(b,c){a.localStorage[b]=JSON.stringify(c)},getObject:function(b){return JSON.parse(a.localStorage[b]||"{}")},clear:function(){a.localStorage.clear()}}}]),angular.module("blindTestApp").controller("MainCtrl",["$scope","$routeParams","$localstorage",function(a,b,c){a.testAvailable=!1,void 0!==b.musicIds?(a.testAvailable=!0,c.set("musicIds",b.musicIds)):c.get("musicIds",!1)&&(a.testAvailable=!0)}]),angular.module("blindTestApp").controller("TestCtrl",["$scope","$routeParams","$http","$sce","$location","$localstorage",function(a,b,c,d,e,f){var g=this,h=f.get("musicIds",null);if(null===h||void 0===b.current)return void e.path("/");a.loadPerCent=0,a.musicIds=h.split(",");var i=parseInt(b.current);a.currentMusicIndex=i>=a.musicIds.length?a.musicIds.length-1:i,a.remaningTime=10,a.showAnswer=!1,a.canGoBack=0!==a.currentMusicIndex,a.canGoForward=a.currentMusicIndex<a.musicIds.length-1,a.errorMessage=null,this.loadNewMusic=function(b){c.get("https://api.spotify.com/v1/tracks/"+b).success(function(b,c,d,e){g.dataSuccessfullyLoaded(b),a.loadPerCent=25}).error(function(b,c,d,g){console.log(b),a.isBusy=!1,1===a.musicIds.length&&(f.clear(),e.path("/")),a.errorMessage="Unable to get this song...",a.timeUp()})},this.updateTimer=function(){var b=parseInt(a.audio.duration-a.audio.currentTime);b!==a.remaningTime&&(0===b&&a.timeUp(),a.remaningTime=b,a.$apply())},this.dataSuccessfullyLoaded=function(b){return a.currentMusicData=b,null===a.currentMusicData.preview_url?(a.errorMessage="Unable to play this song...",void a.timeUp()):(a.audio=new Audio(a.currentMusicData.preview_url),a.audio.ontimeupdate=function(){g.updateTimer()},void(a.audio.oncanplaythrough=function(){a.loadPerCent=100,a.audio.play()}))},a.timeUp=function(){a.showAnswer=!0},a.$on("$destroy",function(){void 0!==a.audio&&a.audio.pause()}),this.loadNewMusic(a.musicIds[a.currentMusicIndex])}]);