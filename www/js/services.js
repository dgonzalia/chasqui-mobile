'use strict';
 
angular.module('chasqui.services', [])

.factory('AuthenticationService',
    ['$http', '$rootScope', 
    function ($http, $rootScope) {
        var authentication = {};
        var URL_BACKEND = "http://localhost:8019/chasqui"
        
        authentication.Login = function (username, password, callbackSucces, callbackError) {
            $http.post(URL_BACKEND+"/rest/client/sso/singIn", { email: username, password: password })
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
    function ($http, $rootScope, AuthenticationService) {
        var publicService = {};
        var URL_BACKEND = "http://localhost:8019/chasqui"

        publicService.registro = function(perfil, callbackSuccess, callbackError){
            $http.post(URL_BACKEND+"/rest/client/sso/singUp", perfil)
                .success(function(data){
                    AuthenticationService.SetCredentials(data.email, data.token, data.id, data.nickname);
                    callbackSuccess(data);
                }).error (function (response) {
                callbackError(response);
            });
        };

        publicService.obtenerVendedores = function(){
            return $http.get(URL_BACKEND+"/rest/client/vendedor/all")
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                         data[i].imagen = URL_BACKEND+data[i].imagen;
                     }
                     return data;
                });
        };


        publicService.obtenerCategoriasDe = function(idVendedor, actividad){
            return $http.get(URL_BACKEND+"/rest/client/categoria/all/"+idVendedor)
                .success(function(data){
                  data.idVendedor = idVendedor;
                  data.actividad = actividad;
                  return data;
                });
        }

        publicService.obtenerProductoresDe = function(idVendedor, actividad){
            return $http.get(URL_BACKEND+"/rest/client/productor/all/"+idVendedor)
                .success(function(data){
                  for (var i = 0; i < data.length; i++) {
                        data[i].idVendedor = idVendedor;
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = URL_BACKEND+data[i].pathImagen;  
                        }
                        if(!(data[i].medalla === undefined || data[i].medalla === null)){
                            data[i].medalla.pathImagen = URL_BACKEND+data[i].medalla.pathImagen;
                        }
                     }
                  data.actividad = actividad;
                  return data;
                });
        }


        publicService.obtenerMedallas = function(){
            return $http.get(URL_BACKEND+"/rest/client/medalla/all")
                .success(function(data){
                    for (var i = 0; i < data.length; i++) {
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = URL_BACKEND+data[i].pathImagen;  
                        }
                    }
                });
          }


        publicService.obtenerProductosDeProductor = function(idProductor,nombreProductor,actividad){
            var postParams = {
                              pagina:0,
                              cantItems:10,
                              precio:'Down',
                              idProductor:idProductor
                             }
            return $http.post(URL_BACKEND+"/rest/client/producto/byProductor",postParams)
                        .success(function(data){
                             for (var i = 0; i < data.productos.length; i++) {
                                if(!(data.productos[i].imagenPrincipal === undefined || data.productos[i].imagenPrincipal === null)){
                                    data.productos[i].imagenPrincipal = URL_BACKEND+data.productos[i].imagenPrincipal;  
                                }
                            }
                            data.actividad = actividad + ' -> ' + nombreProductor;
                        });

        }

        publicService.obtenerProductosDeCategoria = function(idCategoria, nombreCategoria, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 5,
                              precio: 'Down',
                              idCategoria: idCategoria
                             }

            return $http.post(URL_BACKEND+"/rest/client/producto/byCategoria",postParams)
                        .success(function(data){
                             for (var i = 0; i < data.productos.length; i++) {
                                if(!(data.productos[i].imagenPrincipal === undefined || data.productos[i].imagenPrincipal === null)){
                                    data.productos[i].imagenPrincipal = URL_BACKEND+data.productos[i].imagenPrincipal;  
                                }
                            }
                            data.actividad = actividad + ' -> ' + nombreCategoria;
                        });
        }


        publicService.obtenerImagenesDeProducto = function(prod, actividad){
            return $http.get(URL_BACKEND+"/rest/client/producto/images/"+prod.idVariante)
                        .success(function(data){
                        for (var i = 0; i < data.length; i++) {
                            if(!(data[i].path === undefined || data[i].path === null)){
                                data[i].path = URL_BACKEND+data[i].path;
                                data[i].prod = {prod:prod,actividad:actividad}  
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
        var URL_BACKEND = "http://localhost:8019/chasqui"
        
        var header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}}

        privateService.obtenerNotificaciones = function(callback){
           $http.get(URL_BACKEND+"/rest/user/adm/notificacion/1",header).success(function(data){            
                callback(data);
            });
        };

        privateService.obtenerDatosPerfilUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/read", header).success(function (data) {
                return data;
            });
        };


        privateService.obtenerDireccionesDeUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/dir", header)
                        .success(function(data){
                           for (var i = 0; i < data.length; i++) {
                                data[i].alias_p = data[i].alias;
                            }
                        });
        }

        privateService.guardarDireccion = function(direccion){
            var params = {
                            alias:direccion.alias,
                            altura:direccion.altura,
                            calle:direccion.calle,
                            predeterminada:direccion.predeterminada,
                            departamento:direccion.departamento,
                            localidad:direccion.localidad,
                            codigoPostal:direccion.codigoPostal
                        };
            $http.post(URL_BACKEND+"/rest/user/adm/dir", params, header)
                 .success(function(data){
                    direccion.idDireccion = data;
                 });
        }


        privateService.editarDireccion = function(direccion){
             var params = {
                            alias:direccion.alias,
                            altura:direccion.altura,
                            calle:direccion.calle,
                            predeterminada:direccion.predeterminada,
                            departamento:direccion.departamento,
                            localidad:direccion.localidad,
                            codigoPostal:direccion.codigoPostal,
                            idDireccion:direccion.idDireccion
                        };
            $http.put(URL_BACKEND+"/rest/user/adm/dir",params,header)
                 .success(function(data){
                 });
        }


        privateService.eliminarDireccion = function(direccion){
            $http.delete(URL_BACKEND+"/rest/user/adm/dir/"+direccion.idDireccion,header)
                 .success(function(data){

                 }) 
        }


        privateService.editarPerfilUsuario = function(perfil){
            var param = {
                nickName : perfil.nickName,
                nombre: perfil.nombre,
                apellido: perfil.apellido,
                telefonoFijo: perfil.telefonoFijo,
                telefonoMovil: perfil.telefonoMovil,
                password: perfil.password
            };

            $http.put(URL_BACKEND+"/rest/user/adm/edit",param,header)
                .success(function(data){
                    
                })
        }

        return privateService;
}]);