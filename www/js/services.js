'use strict';
 
angular.module('chasqui.services', [])

.factory('AuthenticationService',
    ['$http', '$rootScope','$cordovaSQLite','privateService', 
    function ($http, $rootScope,$cordovaSQLite,privateService) {
        var authentication = {};
        var URL_BACKEND = "http://www.proyectochasqui.com:8080/chasqui";
        var db = null;

        authentication.GuardarCredenciales = function(token, email, id, nickname){
            var query = "INSERT INTO USUARIO (TOKEN,EMAIL,ID_USUARIO,NICKNAME) VALUES (?,?,?,?)";
            var borrado = "DELETE FROM USUARIO"; 
            $cordovaSQLite.execute(db,borrado);
            $cordovaSQLite.execute(db,query,[token,email,id,nickname])
                .then(function(result){});
        }

        authentication.BorrarCredenciales = function(){
            var borrado = "DELETE FROM USUARIO"; 
            $cordovaSQLite.execute(db,borrado);
        }

        authentication.setDB = function(dataBase){
            db = dataBase;
        }

        authentication.esTokenValido = function(callback){
            var header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}}
            $http.get(URL_BACKEND+"/rest/user/adm/check", header)
                .success(function(data){            
                    callback(true);
                })
                .error(function(data){
                    callback(false);
                });
        }

        authentication.estaLogueado = function(){
            return $rootScope.globals !== undefined && $rootScope.globals.currentUser !== undefined
                    && $rootScope.globals.currentUser.id !== undefined;
        };

        authentication.Login = function (username, password, callbackSucces, callbackError) {
            $http.post(URL_BACKEND+"/rest/client/sso/singIn", { email: username, password: password })
                .success(function (response) {
                    callbackSucces(response);
                })
                .error (function (response) {
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
            privateService.refrescarHeader();
        };
 
        authentication.ClearCredentials = function () {
            $rootScope.globals = {};
        };
 
        return authentication;
}])

.factory('publicService',
    ['$http', '$rootScope', 'AuthenticationService', 'LxNotificationService',
    function ($http, $rootScope, AuthenticationService, LxNotificationService) {
        var publicService = {};
        var URL_BACKEND = "http://www.proyectochasqui.com:8080/chasqui";

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
                        if (!(data[i].imagen === undefined || data[i].imagen === null)){
                            data[i].imagen = URL_BACKEND+data[i].imagen;
                        }
                     }
                     return data;
                });
        };


        publicService.obtenerCategoriasDe = function(idVendedor, actividad){
            $rootScope.idvendedor = idVendedor;
            return $http.get(URL_BACKEND+"/rest/client/categoria/all/"+idVendedor)
                .success(function(data) {
                    data.idVendedor = idVendedor;
                    data.actividad = actividad;
                    return data;
                })
                .error(function(data) { // Feedback de errores
                    return LxNotificationService.error(data.error);
            });
        }

        publicService.obtenerProductoresDe = function(idVendedor, actividad){
            $rootScope.idvendedor = idVendedor;
            return $http.get(URL_BACKEND+"/rest/client/productor/all/"+idVendedor)
                .success(function(data) {
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
                })
                .error(function(data) { //Feedback de errores
                    return LxNotificationService.error(data.error);
            });
        }

        publicService.obtenerMedallas = function(){
            return $http.get(URL_BACKEND+"/rest/client/medalla/all")
                .success(function(data) {
                    for (var i = 0; i < data.length; i++) {
                        if(!(data[i].pathImagen === undefined || data[i].pathImagen === null)){
                          data[i].pathImagen = URL_BACKEND+data[i].pathImagen;  
                        }
                    }
                });
        }
        
        var completarURLsImagenes = function (data){
            for (var i = 0; i < data.productos.length; i++) {
                if(!(data.productos[i].imagenPrincipal === undefined || data.productos[i].imagenPrincipal === null)){
                    data.productos[i].imagenPrincipal = URL_BACKEND+data.productos[i].imagenPrincipal;  
                }
                if(!(data.productos[i].medallasProducto === undefined || data.productos[i].medallasProducto === null)){
                    for(var x =0; x < data.productos[i].medallasProducto.length; x++){
                        var prd = data.productos[i];
                        prd.medallasProducto[x].pathImagen = URL_BACKEND+prd.medallasProducto[x].pathImagen;
                    }
                }
                if(!(data.productos[i].medallasProductor === undefined || data.productos[i].medallasProductor === null)){
                    for(var x =0; x < data.productos[i].medallasProductor.length; x++){
                        var prd = data.productos[i];
                        prd.medallasProductor[x].pathImagen = URL_BACKEND+prd.medallasProductor[x].pathImagen;
                    }
                }
            }
        }
        
        publicService.obtenerProductosDeProductor = function(idProductor, nombreProductor, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idProductor: idProductor
                             }

            return $http.post(URL_BACKEND+"/rest/client/producto/byProductor", postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = actividad + ' -> ' + nombreProductor;
                });

        }

        publicService.obtenerProductosDeCategoria = function(idCategoria, nombreCategoria, actividad, pagina){
            var postParams = {
                              pagina: pagina,
                              cantItems: 10,
                              precio: 'Down',
                              idCategoria: idCategoria
                             }

            return $http.post(URL_BACKEND+"/rest/client/producto/byCategoria", postParams)
                .success(function(data) {
                    completarURLsImagenes(data);
                    data.actividad = actividad + ' -> ' + nombreCategoria;
                });
        }

        publicService.obtenerImagenesDeProducto = function(prod, actividad){
            return $http.get(URL_BACKEND+"/rest/client/producto/images/"+prod.idVariante)
                .success(function(data) {
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
    ['$http','$rootScope', 'LxNotificationService',
    function ($http, $rootScope, LxNotificationService) {
        var privateService = {};
        var URL_BACKEND = "http://www.proyectochasqui.com:8080/chasqui";
        var header = {};

        privateService.refrescarHeader = function(){
            header = {headers: {'Authorization': $rootScope.globals.currentUser.authdata}};
        }

        privateService.obtenerNotificaciones = function(callback){
           $http.get(URL_BACKEND+"/rest/user/adm/notificacion/1",header)
               .success(function(data){            
                    callback(data);
            });
        };

        privateService.obtenerDatosPerfilUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/read", header)
                .success(function (data) {
                    return data;
            });
        };

        privateService.obtenerDireccionesDeUsuario = function(){
            return $http.get(URL_BACKEND+"/rest/user/adm/dir", header)
                .success(function(data) {
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
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("La dirección: "+direccion.alias+" se ha creado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
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
            $http.put(URL_BACKEND+"/rest/user/adm/dir",params, header)
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("La dirección: "+direccion.alias+" se ha actualizado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 404 || status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        }

        privateService.eliminarDireccion = function(direccion){
            $http.delete(URL_BACKEND+"/rest/user/adm/dir/"+direccion.idDireccion,header)
                .success(function(data) { //Feedback de éxito
                    LxNotificationService.success("La dirección: "+direccion.alias+" se ha eliminado correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 404) {
                        LxNotificationService.error(data.error);
                    }
                });
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
                .success(function(data) { //Feedback de éxito
                        LxNotificationService.success("Los datos de perfil se actualizaron correctamente");
                 })
                .error(function(data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        }
        
        privateService.obtenerPedidosVigentesIndividual = function(){
            return $http.get(URL_BACKEND+"/rest/user/pedido/individual/vigentes/", header)
                .success(function (data) { 
                    return data;
                })
                .error(function (data, status) {
                    //Si no hay resultados, simplemente no habrán pedidos para visualizar.
                });
        };
        
        privateService.crearPedidoIndividual = function (idVendedor, callbackSuccess) {
            var body = {
                idVendedor: idVendedor
            }
            $http.post(URL_BACKEND+"/rest/user/pedido/individual/", body, header)
                .success(function (data, status) { //Feedback de éxito
                    if (status == 201) { //Pedido creado correctamente.
                        LxNotificationService.info("Pedido creado correctamente");
                        privateService.verPedidoActualIndividual(idVendedor, callbackSuccess);
                    }
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        }
        
        function completarURLsImagenesPedidoActual (data) {
            for (var i = 0; i < data.productosResponse.length; i++) {
                if(!(data.productosResponse[i].imagen === undefined || data.productosResponse[i].imagen === null)){
                    data.productosResponse[i].imagen = URL_BACKEND+data.productosResponse[i].imagen;  
                }
            }
        }
        
        privateService.verPedidoActualIndividual = function (idVendedor, callbackSuccess, callbackError){
            $http.get(URL_BACKEND+"/rest/user/pedido/individual/"+idVendedor, header)
                .success(function (data) { //Feedback de éxito
                    completarURLsImagenesPedidoActual(data);
                    callbackSuccess (data);
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 404) { //Si no existe pedido vigente para el vendedor, se crea.
                        callbackError(data);
                    }
                });
        }
        
        privateService.agregarProductoAPedidoIndividual = function (idPedido, idVariante, cantidad, resetBadge){
            var body = {
                idPedido: idPedido,
                idVariante: idVariante,
                cantidad: cantidad
            }
            $http.put(URL_BACKEND+"/rest/user/pedido/individual/agregar-producto/", body, header)
                .success(function (data) { //Feedback de éxito
                    LxNotificationService.success(cantidad+" ítem/s agregado/s")
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 404 || status == 406) { //Feedback de errores
                        LxNotificationService.error(data.error);
                    }
            });
            resetBadge();           
        }
        
        privateService.quitarProductoAPedidoIndividual = function (idPedido, idVariante, cantidad, resetBadge){
            var body = {
                idPedido: idPedido,
                idVariante: idVariante,
                cantidad: cantidad
            }
            $http.put(URL_BACKEND+"/rest/user/pedido/individual/eliminar-producto/", body, header)
                .success(function (data) { //Feddback de éxito
                    LxNotificationService.success(cantidad+" ítem/s eliminado/s")
                })
                .error(function (data, status) {
                    if (status == 406) { //Feedback de errores
                        LxNotificationService.error(data.error);
                    }
            });
            resetBadge();       
        }
        
        privateService.confirmarPedidoIndividual = function (idPedido, idDireccion) {
            var body = {
                idPedido: idPedido,
                idDireccion: idDireccion
            }
            $http.post(URL_BACKEND+"/rest/user/pedido/individual/confirmar", body, header)
                .success(function (data, status) { //Feedback de éxito
                     LxNotificationService.success("El pedido ha sido confirmado");
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
                });
        }
        
        privateService.eliminarPedidoIndividual = function (idPedido, $index, refreshPantallaPedidos){
            $http.delete(URL_BACKEND+"/rest/user/pedido/individual/"+idPedido, header)
                .success(function (data, status) { //Feedback de éxito
                    LxNotificationService.success("El pedido ha sido cancelado");
                    refreshPantallaPedidos($index);
                })
                .error(function (data, status) { //Feedback de errores
                    if (status == 406) {
                        LxNotificationService.error(data.error);
                    }
            });
        }

        return privateService;
}]);