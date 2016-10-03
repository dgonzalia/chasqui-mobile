'use strict';
 
angular.module('chasqui.services', [])

.factory('AuthenticationService',
    ['$http', '$rootScope', 
    function ($http, $rootScope) {
        var authentication = {};
        
        authentication.Login = function (username, password, callbackSucces, callbackError) {
            $http.post('http://localhost:8019/chasqui/rest/client/sso/singIn', { email: username, password: password })
                .success(function (response) {
                    callbackSucces(response);
            }).error (function (response) {
                    callbackError(response);
            });
        };
 
        authentication.SetCredentials = function (email, token, id, nickname) {
            var authdata = btoa(email + ':' + token);
            $rootScope.globals = {
                currentUser: {
                    username: email,
                    authdata: 'Basic ' + authdata,
                    id: id,
                    nickname: nickname
                }
            };
        };
 
        authentication.ClearCredentials = function () {
            $rootScope.globals = {};
        };
 
        return authentication;
}])

.factory('publicService',
    ['$http', '$rootScope', 'AuthenticationService',
    function ($http, $rootScope) {
        var publicService = {};

        publicService.registro = function(perfil, callbackSuccess, callbackError){
            $http.post("http://localhost:8019/chasqui/rest/client/sso/singUp", perfil, header)
                .success(function(data){
                    AuthenticationService.SetCredentials(data.email, data.token, data.id, data.nickname);
                    callbackSuccess(data);
                }).error (function (response) {
                callbackError(response);
            });
        };

        publicService.obtenerVendedores = function(){
            return $http.get("http://localhost:8019/chasqui/rest/client/vendedor/all")
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                         data[i].imagen = 'http://localhost:8019/chasqui'+data[i].imagen;
                     }
                     return data;
                });
        };


        publicService.obtenerCategoriasDe = function(idVendedor, actividad){
            return $http.get("http://localhost:8019/chasqui/rest/client/categoria/all/"+idVendedor)
                .success(function(data){
                  data.idVendedor = idVendedor;
                  data.actividad = actividad;
                  return data;
                });
        }

        publicService.obtenerProductoresDe = function(idVendedor, actividad){
            return $http.get("http://localhost:8019/chasqui/rest/client/productor/all/"+idVendedor)
                .success(function(data){
                  for (var i = 0; i < data.length; i++) {
                        data[i].idVendedor = idVendedor;
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = 'http://localhost:8019/chasqui'+data[i].pathImagen;  
                        }
                        if(!(data[i].medalla === undefined || data[i].medalla === null)){
                            data[i].medalla.pathImagen = 'http://localhost:8019/chasqui' + data[i].medalla.pathImagen;
                        }
                     }
                  data.actividad = actividad;
                  return data;
                });
        }


        publicService.obtenerMedallas = function(){
            return $http.get("http://localhost:8019/chasqui/rest/client/medalla/all")
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = 'http://localhost:8019/chasqui'+data[i].pathImagen;  
                        }
                    }
                });
          }

        return publicService;
}])

.factory('privateService',
    ['$http','$rootScope',
    function ($http, $rootScope) {
        var privateService = {};
        
        var header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}}

        privateService.obtenerNotificaciones = function(){
            $http.get("http://localhost:8019/chasqui/rest/user/adm/notificacion/1").success(function(data){            
                return data;
            });
        };

        privateService.obtenerDatosPerfilUsuario = function(){
            $http.get('http://localhost:8019/chasqui/rest/user/adm/read', header).success(function (response) {
                return response;
            });
        };

        return privateService;
}]);