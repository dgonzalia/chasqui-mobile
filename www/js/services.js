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
        var userService = {};

        userService.Login = function (username, password, callback) {
            $http.post('http://localhost:8019/chasqui/rest/client/sso/singIn', { email: username, password: password })
                .success(function (response) {
                    callback(response);
            });

        };
 
        userService.SetCredentials = function (username, password,id,nickname) {
            var authdata = btoa(username + ':' + password);
            
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
                    id:id,
                    nickname: nickname
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            // $cookieStore.put('globals', $rootScope.globals);
        };
 
        userService.ClearCredentials = function () {
            $rootScope.globals = {};
            // $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        userService.registro = function(perfil,callback){
            $http.post("http://localhost:8019/chasqui/rest/client/sso/singUp",perfil)
                    .success(function(data){
                        userService.SetCredentials(data.email,data.token,data.id,data.nickname);
                        callback(data);
                    });

        };

        userService.obtenerNotificaciones = function(){
            $http.get("http://localhost:8019/chasqui/rest/user/adm/notificacion/1").success(function(data){            
                return data;
            });
        };

        userService.obtenerDatosPerfilUsuario = function(idUsuario,callback){
            $http.post('http://localhost:8019/chasqui/rest/user/adm/');

        }
 
        return userService;
}]);