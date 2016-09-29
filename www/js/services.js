'use strict';
 
angular.module('chasqui.services', [])
 
.factory('AuthenticationService',
    ['$http', '$rootScope',
    function ($http, $rootScope) {
        var service = {};

        service.Login = function (username, password, callback) {
            $http.post('http://192.168.0.15:8019/chasqui/rest/client/sso/singIn', { email: username, password: password })
                .success(function (response) {
                    callback(response);
            });

        };
 
        service.SetCredentials = function (username, password) {
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

        userService.registro = function(perfil,callback){
            $http.post("http://192.168.0.15:8019/chasqui/rest/client/sso/singUp",perfil)
                    .success(function(data){
                        userService.SetCredentials(data.email,data.token,data.id,data.nickname);
                        callback(data);
                    });

        };

        userService.SetCredentials = function (username, password,id,nickname) {
            var authdata = btoa(username + ':' + password);
 
            console.log(authdata);
            
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata,
                    id:id,
                    nickname:nickname
                }
            };
 
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            // $cookieStore.put('globals', $rootScope.globals);
        };

        userService.obtenerNotificaciones = function(){
            $http.get("http://192.168.0.15:8019/chasqui/rest/user/adm/notificacion/1").success(function(data){            
                return data;
            });
        };

        userService.obtenerDatosPerfilUsuario = function(){
            return {"fafafa": "lalala" };
/*            $http.get('http://localhost:8019/chasqui/rest/user/adm/read').success(function (response) {
                return response;
            });*/
        };


        userService.obtenerVendedores = function(){
            return $http.get("http://192.168.0.15:8019/chasqui/rest/client/vendedor/all")
                        .success(function(data){
                            for (var i = 0; i < data.length; i++) {
                                 data[i].imagen = 'http://192.168.0.15:8019/chasqui'+data[i].imagen;
                             }
                             return data;
                        });
        };


        userService.obtenerCategoriasDe = function(idVendedor,actividad){
            return $http.get("http://192.168.0.15:8019/chasqui/rest/client/categoria/all/"+idVendedor)
                        .success(function(data){
                          data.idVendedor = idVendedor;
                          data.actividad = actividad;
                          return data;
                        });
        }

          userService.obtenerProductoresDe = function(idVendedor,actividad){
            return $http.get("http://192.168.0.15:8019/chasqui/rest/client/productor/all/"+idVendedor)
                        .success(function(data){
                          for (var i = 0; i < data.length; i++) {
                                data[i].idVendedor = idVendedor;
                                if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                                  data[i].pathImagen = 'http://192.168.0.15:8019/chasqui'+data[i].pathImagen;  
                                }
                                if(!(data[i].medalla === undefined || data[i].medalla === null)){
                                    data[i].medalla.pathImagen = 'http://192.168.0.15:8019/chasqui' + data[i].medalla.pathImagen;
                                }
                             }
                          data.actividad = actividad;
                          return data;
                        });
        }

        return userService;
}]);