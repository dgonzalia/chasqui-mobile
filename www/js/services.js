'use strict';
 
angular.module('chasqui.services', [])
 
.factory('AuthenticationService',
    ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('http://localhost:8019/chasqui/rest/client/sso/singIn', { email: username, password: password })
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
            // $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            // $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
 
        return service;
}])

.factory('usuarioService',
    ['$http','$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('http://localhost:8019/chasqui/rest/client/sso/singIn', { email: username, password: password })
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
            // $cookieStore.put('globals', $rootScope.globals);
        };
 
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            // $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };


        service.obtenerNotificaciones = function(){
            console.log("LAMADA HTTP");
            $http.get("http://localhost:8019/chasqui/rest/user/adm/notificacion/1").success(function(data){
                console.log("EJECUTO LLAMADA");               
                return data;
            });
        };
 
        return service;
}]);