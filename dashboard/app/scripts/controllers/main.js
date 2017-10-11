'use strict';

/**
 * @ngdoc function
 * @name dashboardIotApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the dashboardIotApp
 */
angular.module('dashboardIotApp')
  .controller('MainCtrl', ['$http', function($http) {
    var ctrl = this;

    ctrl.model = {};

    var refreshList = function() {
      // $http.get('http://iab-server.herokuapp.com/api/calls').then(function(response) {
      // TODO REMOVER!!!
      $http.get('http://localhost:8080/api/calls').then(function(response) {
        ctrl.model.calls = response.data;
      });
    };

    refreshList();
    setInterval(function() {
      refreshList();
    }, 5000);
  }]);
