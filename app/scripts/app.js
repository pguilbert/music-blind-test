'use strict';

/**
 * @ngdoc overview
 * @name blindTestApp
 * @description
 * # blindTestApp
 *
 * Main module of the application.
 */
angular
  .module('blindTestApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:musicIds?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/test/:current', {
        templateUrl: 'views/test.html',
        controller: 'TestCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
