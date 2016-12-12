/* global angular, document, window */
'use strict';

angular.module('chasqui.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopover, privateService) {
    $scope.isExpanded = true;
    $scope.hasHeaderFabLeft = true;

    /* Popover Notificaciones */
    $ionicPopover.fromTemplateUrl('templates/notificaciones.html', {
      scope: $scope 
     }).then(function(popover) {
         $scope.popover = popover;
    });

    $scope.onVerNotificaciones = function($event){
        $scope.loadNotificaciones();
        $scope.popover.show($event);
    };

    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    $scope.loadNotificaciones = function () {
        privateService.obtenerNotificaciones(function(data){
            $scope.notificaciones = data;
        });
    }
})

.controller('sideMenuCtrl', function($scope, $state, AuthenticationService) {
    
    var right_menus = [
            {
                "title":'Inicio',
                "sref":"menu.home"
            },
            {
                "title":"Perfil Usuario",
                "sref":"menu.perfil"
            },
            {
                "title":"Medallas",
                "sref":"menu.medallas"
            },
            {
                "title":"Pedidos",
                "sref":"menu.pedidos"
            }
        ];

    $scope.desconectar = function(){
        AuthenticationService.BorrarCredenciales();
        AuthenticationService.ClearCredentials();
        $state.go('abstrac.login');
    }
    
    $scope.groups = right_menus;
})

.controller('loginCtrl', function($scope, $state, AuthenticationService, LxNotificationService){
    
    $scope.usuario = {};           

    $scope.login = function () {
            AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, 
            function(response) {
                AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);  
                AuthenticationService.GuardarCredenciales(response.token,$scope.usuario.email,response.id,response.nickname);
                $state.go("menu.home");
            }, 
            function (response) {
            LxNotificationService.error(response.error);
        });
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }
})

.controller('loadingCtrl', function($state, $timeout, AuthenticationService) {
   
    function redirect(){
        if(AuthenticationService.estaLogueado()){
            AuthenticationService.esTokenValido(function(respuesta){
                if(respuesta){
                    $state.go('menu.home');
                }else{
                     AuthenticationService.BorrarCredenciales(); 
                     $state.go('abstrac.login');
                }
            })
        }else{
            AuthenticationService.BorrarCredenciales(); 
            $state.go('abstrac.login');
        }
    }

    $timeout(function(){
        redirect();
    },3000);
})

.controller('homeCtrl',function ($scope, $timeout, $state, ionicMaterialInk, ionicMaterialMotion, vendedores) {

    /* String undefined re-defined */
    if (typeof String.prototype.includes === 'undefined') {
        String.prototype.includes = function(it) { 
            return this.indexOf(it) != -1; 
        };
    }
    
    $scope.actividad = 'Inicio ';
    $scope.vss = vendedores.data;

    $scope.verCategorias = function(vendedor){
        $state.go('menu.home.categorias',{idVendedor:vendedor.id, actividad:$scope.actividad});
    }


     $scope.verProductores = function(vendedor){
        $state.go('menu.home.productores',{idVendedor:vendedor.id, actividad:$scope.actividad});
    }
     
    // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
    $scope.$on('ngLastRepeat.catalogos',function(e) {
        $timeout(function(){
            ionicMaterialMotion.fadeSlideInRight();
            ionicMaterialInk.displayEffect();
          },0); // No timeout delay necessary.
    });
})

.controller('medallasCtrl',function ($scope, $sce, $timeout, $state, ionicMaterialInk, ionicMaterialMotion, medallas) {

    $scope.actividad = 'Medallas';
    $scope.mss = medallas.data;
    
    // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
    $scope.$on('ngLastRepeat.medallas',function(e) {
        $timeout(function(){
            ionicMaterialMotion.fadeSlideIn();
            ionicMaterialInk.displayEffect();
          },0); // No timeout delay necessary.
    });
    
    $scope.renderHTML = function(html_code){
        return $sce.trustAsHtml(html_code);
    };

    $scope.verMedalla = function(medallaSeleccionada){
          var params = {
                     actividad: $scope.actividad + ' -> ' + medallaSeleccionada.nombre,
                     medalla: medallaSeleccionada
                    }; 
          $state.go('menu.medallas.info', params);
    }
})

.controller("infoMedallaCtrl",function($scope, $sce, medalla){

    $scope.actividad = medalla.actividad;
    $scope.medalla = medalla.medalla;

    $scope.renderHTML = function(html_code){
        return $sce.trustAsHtml(html_code);
    };
})

.controller('direccionesCtrl',function ($scope, $timeout, ionicMaterialInk, ionicMaterialMotion, privateService, direcciones) {

    $scope.actividad = 'Perfil -> Direcciones';
    if(!$scope.actividad.includes('Direcciones')){
        $scope.actividad = $scope.actividad + ' -> Direcciones';
    }
    $scope.dss = direcciones.data;
    
    function buscarIndexDireccion(alias){
        for (var i = 0; i < $scope.dss.length; i++) {
            if($scope.dss[i].alias_p === alias){
               return i;  
            }
        }
        return null;
    };
    
    $scope.agregarDireccion = function(){
        var index = buscarIndexDireccion('Nueva Direccion');
        var direccion = $scope.dss[index];
        if(direccion === null || direccion === undefined){
            var nuevaDireccion = {alias_p:'Nueva Direccion',
                                  alias:undefined,
                                  altura:undefined,
                                  calle:undefined,
                                  predeterminada:false,
                                  departamento:undefined,
                                  localidad:undefined,
                                  codigoPostal:undefined,
                                  nuevaDireccion:true
                                };
            $scope.dss.push(nuevaDireccion);
        }
    };

    $scope.codigoPostalValido = function(codigoPostal){
        if(codigoPostal== undefined){
            return false;
        }
        if(typeof codigoPostal === 'number'){
            return true;
        }
        return codigoPostal !== '' && (codigoPostal.match(/^[0-9]+$/) != null);
    };

    $scope.altValida = function(altura){
        if(altura == undefined){
            return false;
        }
        if(typeof altura === 'number'){
            return true;
        }
        return altura !== '' && (altura.match(/^[0-9]+$/) != null);
    };
    
    function validarCampo(valor){
        return valor !== undefined || valor !== '';
    }

    $scope.formularioValido = function(d){
        return validarCampo(d.alias_h) && validarCampo(d.altura) 
                && validarCampo(d.calle)
                && validarCampo(d.departamento) && validarCampo(d.localidad)
                && validarCampo(d.codigoPostal);     
    }

    $scope.eliminarDireccion = function(alias_p){
        var index = buscarIndexDireccion(alias_p);
        var direccion = $scope.dss[index];
        privateService.eliminarDireccion(direccion);
        $scope.dss.splice(index,1);
    };

    $scope.algunoIncompleto = function(direccion){
        return !$scope.formularioValido(direccion);
    }

    $scope.editarDireccion = function(alias_p){
        var index = buscarIndexDireccion(alias_p);
        var direccion = $scope.dss[index];
        if(direccion.nuevaDireccion !== undefined && direccion.nuevaDireccion
            && $scope.formularioValido(direccion)){
            privateService.guardarDireccion(direccion);
            direccion.nuevaDireccion = false;
            direccion.alias_p = direccion.alias;
        }else if($scope.formularioValido){
            privateService.editarDireccion(direccion);
            direccion.alias_p = direccion.alias;
        }
        var html = this;
        html.profile.$setPristine();
    }

    $scope.toggleGroup = function(alias) {
        if ($scope.isGroupShown(alias)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = alias;
        }
    };
    
    $scope.isGroupShown = function(alias) {
        return $scope.shownGroup === alias;
    };

    // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
    $scope.$on('ngLastRepeat.direcciones',function(e) {
        $timeout(function(){
            ionicMaterialMotion.fadeSlideIn();
            ionicMaterialInk.displayEffect();
          },0); // No timeout delay necessary.
    });
})

.controller('categoriasCtrl',function ($scope, $timeout, $state, ionicMaterialInk, ionicMaterialMotion, publicService, categorias) {

    $scope.actividad = categorias.data.actividad;
    if(!$scope.actividad.includes('Catálogo')){
        $scope.actividad = $scope.actividad + '-> Catálogo';
    }
    $scope.ctss = categorias.data;

    // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
    $scope.$on('ngLastRepeat.categorias',function(e) {
        $timeout(function(){
            ionicMaterialMotion.fadeSlideIn();
            ionicMaterialInk.displayEffect();
          },0); // No timeout delay necessary.
    });

    $scope.verProductos = function(categoria){
        var params = {
                       actividad: $scope.actividad,
                       nombreCategoria: categoria.nombre,
                       idCategoria: categoria.idCategoria,
                       pagina: 0    
                     }
        $state.go('menu.home.categorias.productos', params);
    }
})


.controller('productoresCtrl',function ($scope, $timeout, $state, ionicMaterialInk, ionicMaterialMotion, productores) {

    $scope.actividad = productores.data.actividad;
    
    if(!$scope.actividad.includes('Productores')){
        $scope.actividad = $scope.actividad + '-> Productores';
    }
    
    $scope.pss = productores.data;
    
    // Animate list on this event. https://github.com/zachfitz/Ionic-Material/issues/43
    $scope.$on('ngLastRepeat.productores',function(e) {
        $timeout(function(){
            ionicMaterialMotion.fadeSlideIn();
            ionicMaterialInk.displayEffect();
          },0); // No timeout delay necessary.
    });

    $scope.imagenValida = function(productor){
        return productor.pathImagen !== undefined && productor.pathImagen !== null;
    }

    $scope.verInfoProductor = function(productor){
        var params = {
                      productor: productor,
                      actividad: $scope.actividad
                     }
        $state.go('menu.home.productores.info',params);
    }


    $scope.verProductos = function(productor){
        var params = {
                       actividad: $scope.actividad,
                       nombreProductor: productor.nombreProductor,
                       idProductor: productor.idProductor,
                       pagina: 0 
                     }
        $state.go('menu.home.productores.productos',params);
    }
})

.controller('infoProductorCtrl',function ($scope, $sce, productor) {

    $scope.productor = productor.productor;
    $scope.actividad = productor.actividad + ' -> ' + $scope.productor.nombreProductor;
    
    $scope.imagenCaracteristicaValida = ($scope.productor.medalla != undefined && $scope.productor.medalla.pathImagen != undefined);
    $scope.imagenValida = $scope.productor.pathImagen != undefined;
    
    $scope.renderHTML = function(html_code){
        return $sce.trustAsHtml(html_code);
    };
})


.controller('productosCtrl',function ($scope, $rootScope, $state, $stateParams, $ionicActionSheet, LxNotificationService, privateService, publicService, prods) {

    
    $scope.pss = []; //Lista de productos.
    $scope.badge = 0; //Contador de carrito
    $scope.actividad = prods.data.actividad; //Breadcrumb
    $scope.idVendedor = $rootScope.idvendedor;
    
    if(!$scope.actividad.includes('Productos')){
        $scope.actividad = $scope.actividad + ' -> Productos';
    }

    function ejecutar(data){
        if (data.productos.length > 0) {
            $scope.pss = $scope.pss.concat(data.productos);
            $scope.hayItems = true;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        else {
            $scope.hayItems = false;
            $scope.$broadcast('scroll.infiniteScrollComplete');
        }
    }

    $scope.loadMoreData = function() {
        $stateParams.pagina ++;
        if($scope.actividad.includes('Productor')){
            publicService.obtenerProductosDeProductor($stateParams.idProductor, $stateParams.nombreProductor, $stateParams.actividad, $stateParams.pagina)
                .success(function(data){
                    ejecutar(data);
                })
                .error(function(data){
                    LxNotificationService.error('Error al obtener productos');
                })
        }
        else{
            publicService.obtenerProductosDeCategoria($stateParams.idCategoria, $stateParams.nombreCategoria, $stateParams.actividad, $stateParams.pagina)
                .success(function(data){
                    ejecutar(data);
                })
                .error(function(data){
                    LxNotificationService.error('Error al obtener productos');
                })
            }
    }

    $scope.$on('$stateChangeSuccess', function(){
        $scope.loadMoreData();
    });

    $scope.verInfoProducto = function(prod){
        var param = {
                        prod: prod,
                        actividad: $scope.actividad
                     }         
        $state.go('menu.home.infoProducto',param);
    }
    
    function resetBadge (){
        $scope.badge = 0;
    }
    
    function addProductToCart (p){
        privateService.verPedidoActualIndividual($scope.idVendedor, 
            function(response) { //callbackSuccess
                privateService.agregarProductoAPedidoIndividual(response.id, p.idVariante, $scope.badge, resetBadge);
            }, 
            function(response){ //CallbackError
                privateService.crearPedidoIndividual($scope.idVendedor, function(response) {
                    privateService.agregarProductoAPedidoIndividual(response.id, p.idVariante, $scope.badge, resetBadge);
                });
            });
        
    };
    
    //Method to add a product to cart via $ionicActionSheet
    $scope.addProduct = function(p){
        $ionicActionSheet.show({
          titleText: "Comprar "+p.nombreProducto +" "+ p.nombreVariedad,
          buttons: [
            { text: '<i class="icon ion-plus balanced"></i> Agregar'},
            { text: '<i class="icon ion-minus assertive"></i> Quitar' },
            { text: '<i class="icon ion-checkmark balanced"></i> Confirmar' },
          ],
          destructiveText: 'Cancelar',
          cancelText: 'Cancel',
          cancel: function() {
            resetBadge();
          },
          buttonClicked: function(index) {
            switch (index) {
                case 0: //Agregar ítem
                    if ($scope.badge < 99) {
                        $scope.badge++;
                    }
                    else {
                        LxNotificationService.info("No se pueden agregar mas de 99 items del mismo producto");
                    }
                    break;
                case 1: //Quitar ítem
                    if ($scope.badge > 0) {
                        $scope.badge--;
                    }
                    break;
                case 2: //Confirmar
                    if ($scope.badge >= 1) {
                        addProductToCart(p);
                    }
                    return true;
            }  
          },
          destructiveButtonClicked: function() {
            resetBadge();
            return true;
          }
        });
    };
})

.controller('checkoutCtrl',function ($scope, $timeout, $stateParams, $state, privateService, direcciones, $ionicPopup) {

    $scope.direccionSeleccionada = {};
    $scope.idPedido = $stateParams.idPedido;
    $scope.direcciones = direcciones.data;
    
    function setearDireccionPredeterminada () {
        angular.forEach($scope.direcciones, function(direccion) {
            if (direccion.predeterminada) {
                $scope.direccionSeleccionada.id = direccion.idDireccion;
                $scope.direccionSeleccionada.alias = direccion.alias;
            }
        });
    }
    setearDireccionPredeterminada();
    
    $scope.setearAlias = function (alias) {
        $scope.direccionSeleccionada.alias = alias;
    }
    
    $scope.popupConfirmarPedido = function() {
        $scope.data = {}
        $ionicPopup.show({
          title: '¿Desea confirmar el pedido?',
          subTitle: "El mismo será enviado a: "+$scope.direccionSeleccionada.alias,
          scope: $scope,
          buttons: [
            { text: 'No', 
              onTap: function(e) { 
                  return false; 
              } 
            },
            {
              text: '<b>Si</b>',
              type: 'button-positive',
              onTap: function(e) {
                return true;
              }
            },
          ]
          }).then(function(res) {
            if (res) {
                privateService.confirmarPedidoIndividual($stateParams.idPedido, $scope.direccionSeleccionada.id);
                $timeout(function(){
                    $state.go('menu.home')
                },2000);
            }
          }, function(err) {
            console.log('Err:', err);
          }, function(msg) {
            console.log('message:', msg);
          });
    }; 
})

.controller('cartCtrl', function($scope, $stateParams, $ionicListDelegate, $ionicPopup, $timeout, $ionicActionSheet, $state, LxNotificationService, privateService) {
    
    var idVendedor = $stateParams.idVendedor; //ID vendedor
    $scope.badge = -1;
    
    function refreshPedidoActual () {
        privateService.verPedidoActualIndividual(idVendedor, function(response) {
            $scope.cart = response.productosResponse;
            $scope.nombreVendedor = response.nombreVendedor;
            $scope.montoActual = response.montoActual;
            $scope.montoMinimo = response.montoMinimo;
            $scope.idPedido = response.id;
        }, angular.noop);
    }
    
    refreshPedidoActual();
    
    function resetBadge (){
        $scope.badge = -1;
    }
    
    $scope.popupConfirmarEliminarProducto = function(producto, $index) {
        $scope.data = {}
        $ionicPopup.show({
          title: '¿Está seguro de eliminar el producto?',
          subTitle: producto.nombre+" ("+producto.cantidad+" ítem/s)",
          scope: $scope,
          buttons: [
            { text: 'No', 
              onTap: function(e) { 
                  return false; 
              } 
            },
            {
              text: '<b>Si</b>',
              type: 'button-positive',
              onTap: function(e) {
                return true;
              }
            },
          ]
          }).then(function(res) {
            if (res) {
                privateService.quitarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, producto.cantidad, resetBadge);
                $timeout(function(){
                    refreshPedidoActual();
                },2000);
            }
          }, function(err) {
            console.log('Err:', err);
          }, function(msg) {
            console.log('message:', msg);
          });
    };    
    
    $scope.quitarProducto = function(producto, $index){
        $scope.popupConfirmarEliminarProducto(producto, $index);
        $ionicListDelegate.closeOptionButtons();
    }
    
    $scope.confirmarPedido = function () {
        $state.go('menu.pedidos.cart.checkout', {idPedido: $scope.idPedido});
    }
    
    function removeProductToCart (producto, cantidad) {
        privateService.quitarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, cantidad, resetBadge);
        $timeout(function(){
            refreshPedidoActual();
        },2000);
    }
    
    function addProductToCart (producto, cantidad){
        privateService.agregarProductoAPedidoIndividual($scope.idPedido, producto.idVariante, cantidad, resetBadge);
        $timeout(function(){
            refreshPedidoActual();
        },2000);
    };
    
    $scope.editarProducto = function(producto){
        $ionicListDelegate.closeOptionButtons();
        $scope.badge = producto.cantidad;
        $ionicActionSheet.show({
          titleText: "Editar "+producto.nombre,
          buttons: [
            { text: '<i class="icon ion-plus balanced"></i> Agregar'},
            { text: '<i class="icon ion-minus assertive"></i> Quitar' },
            { text: '<i class="icon ion-checkmark balanced"></i> Confirmar' },
          ],
          destructiveText: 'Cancelar',
          cancelText: 'Cancel',
          cancel: function() {
            resetBadge();
          },
          buttonClicked: function(index) {
            switch (index) {
                case 0: //Agregar ítem
                    if ($scope.badge < 99) {
                        $scope.badge++;
                    }
                    else {
                        LxNotificationService.info("No se pueden agregar mas de 99 items del mismo producto");
                    }
                    break;
                case 1: //Quitar ítem
                    if ($scope.badge > 0) {
                        $scope.badge--;
                    }
                    break;
                case 2: //Confirmar
                    if ($scope.badge >= 0) {
                        var cantidad = Math.abs($scope.badge - producto.cantidad);
                        if ($scope.badge > producto.cantidad) {
                            addProductToCart(producto, cantidad);
                        }
                        else {
                            removeProductToCart(producto, cantidad)
                        }
                    }
                    return true;
            }  
          },
          destructiveButtonClicked: function() {
            resetBadge();
            return true;
          }
        });
    };
})

.controller('pedidosCtrl',function ($scope, $ionicPopup, $ionicListDelegate, $state, privateService, pedidos) {

    $scope.pedidos = pedidos.data;
    
    function refreshPantallaPedidos($index) {
        $scope.pedidos.splice($index, 1);
    }
    
    $scope.showPopup = function(pedido, $index) {
        $scope.data = {}
        $ionicPopup.show({
          title: '¿Está seguro de eliminar el pedido?',
          scope: $scope,
          buttons: [
            { text: 'No', 
              onTap: function(e) { 
                  return false; 
              } 
            },
            {
              text: '<b>Si</b>',
              type: 'button-positive',
              onTap: function(e) {
                return true;
              }
            },
          ]
          }).then(function(res) {
            if (res) {
                privateService.eliminarPedidoIndividual(pedido.id, $index, refreshPantallaPedidos);
            }
          }, function(err) {
            console.log('Err:', err);
          }, function(msg) {
            console.log('message:', msg);
          });
    };
    
    $scope.cancelarPedido = function(pedido, $index){
        $scope.showPopup(pedido, $index);
        $ionicListDelegate.closeOptionButtons();
    }
    
    $scope.verCarrito = function (idVendedor){
        $state.go('menu.pedidos.cart',{idVendedor:idVendedor});
        $ionicListDelegate.closeOptionButtons();
    }
})


.controller('infoProductoCtrl',function ($scope, $sce, $timeout, $ionicModal, $ionicSlideBoxDelegate, infoProducto) {

    $scope.producto = infoProducto.data[0].prod.prod;
    $scope.actividad = infoProducto.data[0].prod.actividad;
    $scope.imagenes = infoProducto.data;
    
    if(!$scope.actividad.includes('Info Producto')){
        $scope.actividad = $scope.actividad + ' -> ' + $scope.producto.nombreProducto +' -> Info Producto';
    };

    $scope.renderHTML = function(html_code){
        return $sce.trustAsHtml(html_code);
    };

    $ionicModal.fromTemplateUrl('image-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
      $ionicSlideBoxDelegate.slide(0);
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
        // Execute action
    });
    
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });
    
    $scope.$on('modal.shown', function() {
        // Modal is shown
    });

    // Call this functions if you need to manually control the slides
    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };
  
    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };
  
  	$scope.goToSlide = function(index) {
        $scope.modal.show();
        $ionicSlideBoxDelegate.slide(index);
    }
  
    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };
})

.controller('singUpCtrl',function ($scope, publicService, $state, LxNotificationService) {
    
    $scope.esEdicionPerfil=false;
    $scope.perfil={};
    $scope.perfil_r={}
    $scope.perfil.nombre='';
    $scope.perfil.apellido='';
    $scope.perfil.email='';
    $scope.perfil.nickName='';
    $scope.perfil.telefonoFijo='';
    $scope.perfil.telefonoMovil='';
    $scope.perfil.password='';
    $scope.perfil_r.password='';

    $scope.nombreValido = function(){
        if($scope.perfil.nombre == undefined){
            return false;
        }
        return $scope.perfil.password !== '';
    };

    $scope.apellidoValido = function(){
        if($scope.perfil.apellido == undefined){
            return false;
        }
        return $scope.perfil.apellido !== '';
    };

    $scope.emailValido = function(){
        if($scope.perfil.email == undefined){
            return false;
        }
        return $scope.perfil.email !== '';
    };

    $scope.telefonoValido = function(){
        if($scope.perfil.telefonoFijo == undefined){
            return false;
        }
        return $scope.perfil.telefonoFijo !== '' && ($scope.perfil.telefonoFijo.match(/^[0-9]+$/) != null);
    };

    $scope.celularValido = function(){
        if($scope.perfil.telefonoMovil == undefined){
            return false;
        }
        return $scope.perfil.telefonoMovil !== '' && ($scope.perfil.telefonoMovil.match(/^[0-9]+$/) != null);
    };

    $scope.passwordValida = function(){
        if($scope.perfil.password == undefined){
            return false;
        }
        return $scope.perfil.password.length >= 8;
    };

    $scope.coincidenContrasenias = function(){
        return  $scope.perfil.password === $scope.perfil_r.password;
    };

    $scope.validarFormulario = function(){
        return  $scope.nombreValido() && $scope.apellidoValido
                    && $scope.emailValido() && $scope.telefonoValido
                    && $scope.celularValido && $scope.passwordValida() 
                    && $scope.coincidenContrasenias();
    };

    $scope.guardar= function(){
        if($scope.validarFormulario()){
            publicService.registro($scope.perfil, function(data){
                LxNotificationService.success("Su registro ha sido exitoso");
                $state.go("menu.home");
            }, function (response) {
                LxNotificationService.error(response.error)
            });
        }
    };
})


.controller('perfilCtrl',function ($scope, $state, $ionicLoading, privateService, datosPerfil) {
    
    $scope.perfil = datosPerfil.data;
    
    $scope.esEdicionPerfil=true;         
    $scope.perfil_r = {}
    $scope.perfil_r.password = '';
    $scope.perfil.password = '';

    $scope.show = function() {
        $ionicLoading.show({
            template: 'Cargando...'
        })
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.editar = function(){
        $scope.esEdicionPerfil = false;
    };

     $scope.nombreValido = function(){
        if($scope.perfil.nombre == undefined){
            return false;
        }
        return $scope.perfil.nombre !== '';
    };

    $scope.apellidoValido = function(){
        if($scope.perfil.apellido == undefined){
            return false;
        }
        return $scope.perfil.apellido !== '';
    };

    $scope.emailValido = function(){
        if($scope.perfil.email == undefined){
            return false;
        }
        return $scope.perfil.email !== '';
    };

    $scope.telefonoValido = function(){
        if($scope.perfil.telefonoFijo == undefined){
            return false;
        }
        return $scope.perfil.telefonoFijo !== '' && ($scope.perfil.telefonoFijo.match(/^[0-9]+$/) != null);
    };

    $scope.celularValido = function(){
        if($scope.perfil.telefonoMovil == undefined){
            return false;
        }
        return $scope.perfil.telefonoMovil !== '' && ($scope.perfil.telefonoMovil.match(/^[0-9]+$/) != null);
    };

    $scope.passwordValida = function(){
        return $scope.perfil.password !== undefined
                 && $scope.perfil.password === ''
                 || $scope.perfil.password.length >= 8;
    };

    $scope.coincidenContrasenias = function(){
        return  $scope.perfil.password === $scope.perfil_r.password;
    };

    $scope.contraseniasNoEditadas = function(){
        return ($scope.perfil.password == undefined && $scope.perfil_r.password == undefined)
                 || ($scope.perfil.password == '' && $scope.perfil_r.password == '');
    }

    $scope.validarFormulario = function(){
        return  $scope.nombreValido() && $scope.apellidoValido
                    && $scope.emailValido() && $scope.telefonoValido
                    && $scope.celularValido && $scope.passwordValida()
                    && ($scope.contraseniasNoEditadas() || $scope.coincidenContrasenias());
    };

    $scope.guardar = function(){
        if($scope.validarFormulario()){
            $scope.show();
            privateService.editarPerfilUsuario($scope.perfil);
            //llamar al servicio de edicion;
            $scope.hide();
            var html = this;
            //nombre del formulario
            html.profile.$setPristine();
            $scope.esEdicionPerfil = true;
        }
    }

    $scope.verDirecciones = function(){
        $state.go('menu.direcciones');
    }
});
