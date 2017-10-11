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
      $http.get('http://iab-server.herokuapp.com/api/calls').then(function(response) {
        ctrl.model.calls = response.data;
        ctrl.model.calls.sort(function(actual, next) {
          var firstDate = new Date(actual.moment);
          var secondDate = new Date(next.moment);
          return firstDate - secondDate;
        });
      });
    };

    refreshList();
    setInterval(function() {
      refreshList();
    }, 5000);
  }]);
