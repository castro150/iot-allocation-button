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

    var refreshLists = function() {
      $http.get('http://iab-server.herokuapp.com/api/calls/unattended').then(function(response) {
        ctrl.model.unattendedCalls = response.data;
      });

      $http.get('http://iab-server.herokuapp.com/api/calls/attended').then(function(response) {
        ctrl.model.attendedCalls = response.data;
      });
    };

    refreshLists();
    setInterval(function() {
      refreshLists();
    }, 5000);

    ctrl.formatDate = function(date) {
      date = new Date(date);

      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();

      var result = day + '/' + month + '/' + year;
      result = result + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
      return result;
    };
  }]);
