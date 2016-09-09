'use strict';
 
angular.module('chasqui.services', [])
 
.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope',
    function ($http, $cookieStore, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('http://localhost:8090/chasqui/rest/client/sso/singIn', { email: username, password: password })
                .success(function (response) {
                    callback(response);
            });

        };
 
        service.SetCredentials = function (username, password) {
            console.log("setCredentials");
            var authdata = btoa(username + ':' + password);
 
            console.log(authdata);
            
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
}]);