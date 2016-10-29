/* global angular, document, window */
'use strict';

angular.module('chasqui.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, privateService) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;


    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
    
    $ionicPopover.fromTemplateUrl('templates/notificaciones.html', {
      scope: $scope
     }).then(function(popover) {
         $scope.popover = popover;
    });

    $scope.onVerNotificaciones = function($event){
        console.log($scope.popover);
        $scope.popover.show($event);
    };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };
   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });




    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };


    $scope.loadNotificaciones = function () {
        privateService.obtenerNotificaciones(function(data){
            $scope.notificaciones = data;
        });
    }

    $scope.loadNotificaciones();
    
})

.controller('SideMenuCtrl', function($scope) {
    var right_menus = [{
        name: "General",
        items: [
            // {
            //     "title": "Activity",
            //     "sref": "menu.activity"
            // }
            {
                "title":'Inicio',
                "sref":"menu.home"
            },
            {
                "title":"Perfil Usuario",
                "sref":"menu.perfil"
            },
            // ,{
            //     "title": "Login",
            //     "sref": "app.login"
            // },{
            //     "title": "Profile",
            //     "sref": "menu.profile"
            // },
            {
                "title":"Medallas",
                "sref":"menu.medallas"
            },
            {
                "title": "Friends",
                "sref": "menu.friends"
            }
            //,{
            //     "title": "Gallery",
            //     "sref": "menu.gallery"
            // },
        ]
    },{
        name: "Components",
        items: [{
                "title": "Header",
                "sref": "menu.components.header"
            },{
                "title": "Content",
                "sref": "menu.components.content"
            },{
                "title": "Footer",
                "sref": "menu.components.footer"
            },{
                "title": "Buttons",
                "sref": "menu.components.buttons"
            },{
                "title": "List",
                "sref": "menu.components.list"
            },{
                "title": "Cards",
                "sref": "menu.components.cards"
            },{
                "title": "Forms",
                "sref": "menu.components.forms"
            },{
                "title": "Toggle",
                "sref": "menu.components.toggle"
            },{
                "title": "Checkbox",
                "sref": "menu.components.checkbox"
            },{
                "title": "Radio Buttons",
                "sref": "menu.components.radio-buttons"
            },{
                "title": "Range",
                "sref": "menu.components.range"
            },{
                "title": "Select",
                "sref": "menu.components.select"
            },{
                "title": "Tabs",
                "sref": "menu.components.tabs"
            },{
                "title": "Grid",
                "sref": "menu.components.grid"
            },{
                "title": "Utility",
                "sref": "menu.components.utility"
            },
        ]
    },];

    $scope.groups = right_menus;
  
    /*
    * if given group is the selected group, deselect it
    * else, select the given group
    */
    $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
        } else {
            $scope.shownGroup = group;
        }
    };
    $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
    };
  
})

.controller('loginCtrl',['$scope', '$location','$state', 'AuthenticationService','$cordovaSQLite', '$timeout', '$stateParams', 'ionicMaterialInk', 'LxNotificationService', loginCtrl])
/*.controller("perfilCtrl",['$scope', '$rootScope', '$location', '$state','AuthenticationService','$timeout', '$stateParams', 'ionicMaterialInk','privateService','$ionicLoading',perfilCtrl])*/


.controller('loadingCtrl', function($scope, $rootScope,$stateParams, $state,$timeout, AuthenticationService) {
   
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


.controller('FriendsCtrl', function($scope, $rootScope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    
    console.log($rootScope.globals);
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('ComponentsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    // ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('homeCtrl',function ($scope, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk,ionicMaterialMotion, publicService, $state, vendedores) {


    if (typeof String.prototype.includes === 'undefined') {
        String.prototype.includes = function(it) { 
            return this.indexOf(it) != -1; 
        };
    }
    $scope.actividad = 'Inicio ';
    $scope.vss = vendedores.data;


    $scope.verCategorias = function(nombre){
        var selectedItem = null;
         for (var i = 0; i < $scope.vss.length; i++) {
            if($scope.vss[i].nombre === nombre){
                selectedItem = $scope.vss[i];
            }
        }
        $state.go('menu.home.categorias',{idVendedor:selectedItem.id,actividad:$scope.actividad});
    }


     $scope.verProductores = function(nombre){
        var selectedItem = null;
         for (var i = 0; i < $scope.vss.length; i++) {
            if($scope.vss[i].nombre === nombre){
                selectedItem = $scope.vss[i];
            }
        }
        $state.go('menu.home.productores',{idVendedor:selectedItem.id,actividad:$scope.actividad});
    }

})

.controller('medallasCtrl',function ($scope, $sce, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, publicService, $state, medallas) {


    $scope.actividad = 'Medallas';
    $scope.mss = medallas.data;

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();


    $scope.renderHTML = function(html_code)
    {
        return $sce.trustAsHtml(html_code);
    };

})

.controller('direccionesCtrl',function ($scope,$sce, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, privateService, $state, direcciones) {


    $scope.actividad = 'Perfil -> Direcciones';
    if(!$scope.actividad.includes('Direcciones')){
        $scope.actividad = $scope.actividad + ' -> Direcciones';
    }
    $scope.dss = direcciones.data;



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

    function buscarIndexDireccion(alias){
        for (var i = 0; i < $scope.dss.length; i++) {
            if($scope.dss[i].alias_p === alias){
               return i;  
            }
        }
        return null;
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

    $scope.formularioValido = function(d){
        return validarCampo(d.alias_h) && validarCampo(d.altura) 
                && validarCampo(d.calle)
                && validarCampo(d.departamento) && validarCampo(d.localidad)
                && validarCampo(d.codigoPostal);     
    }

    function validarCampo(valor){
        return valor !== undefined || valor !== '';
    }


    $scope.eliminarDireccion = function(alias_p){
        var index = buscarIndexDireccion(alias_p);
        var direccion = $scope.dss[index];
        privateService.eliminarDireccion(direccion);
        $scope.dss.splice(index,1);
       // var direccionABorrar = $scope.dss.splice(index,1)[0];
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
        //nombre del formulario
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


       $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 100);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

})

.controller('categoriasCtrl',function ($scope, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, publicService, $state, categorias) {


    $scope.actividad = categorias.data.actividad;
    if(!$scope.actividad.includes('Catálogo')){
        $scope.actividad = $scope.actividad + '-> Catálogo';
    }
    $scope.ctss = categorias.data;


    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    function encontrarCategoria(nombreCategoria){
         for (var i = 0; i < $scope.ctss.length; i++) {
            if($scope.ctss[i].nombre === nombreCategoria){
                return $scope.ctss[i];
            }
        }
        return null;
    }

    $scope.verProductos = function(nombreCategoria){
        var params = {
                       actividad: $scope.actividad,
                       nombreCategoria: nombreCategoria,
                       idCategoria: encontrarCategoria(nombreCategoria).idCategoria,
                       pagina: 0    
                     }
        $state.go('menu.home.categorias.productos', params);
    }

})


.controller('productoresCtrl',function ($scope, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, publicService, $state, productores) {

    $scope.actividad = productores.data.actividad;
    if(!$scope.actividad.includes('Productores')){
        $scope.actividad = $scope.actividad + '-> Productores';
    }
    $scope.pss = productores.data;

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    function encontrarProductor(nombreProductor){
        var selectedItem = null;
         for (var i = 0; i < $scope.pss.length; i++) {
            if($scope.pss[i].nombreProductor === nombreProductor){
                selectedItem = $scope.pss[i];
            }
        }
        return selectedItem;
    }

    $scope.imagenValida = function(nombreProductor){
        var prd = encontrarProductor(nombreProductor);
        return prd.pathImagen !== undefined && prd.pathImagen !== null;
    }

    $scope.verInfoProductor = function(nombreProductor){
        var params = {
                      productor:encontrarProductor(nombreProductor),
                      actividad:$scope.actividad
                     }
        $state.go('menu.home.productores.info',params);
    }


    $scope.verProductos = function(nombreProductor){
        var params = {
                       actividad:$scope.actividad,
                       nombreProductor:nombreProductor,
                       idProductor:encontrarProductor(nombreProductor).idProductor
                     }
        $state.go('menu.home.productores.productos',params);
    }

})

.controller('infoProductorCtrl',function ($scope, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, publicService, $state, productor) {

    $scope.productor = productor.productor;
    $scope.actividad = productor.actividad + ' -> ' + $scope.productor.nombreProductor;
    
    $scope.imagenCaracteristicaValida = ($scope.productor.medalla != undefined && $scope.productor.medalla.pathImagen != undefined);
    $scope.imagenValida = $scope.productor.pathImagen != undefined;


    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})


.controller('productosCtrl',function ($scope, $stateParams, publicService, $state, prods, LxNotificationService) {

    //Lista de productos.
    $scope.pss = [];
    
    $scope.actividad = prods.data.actividad;
    if(!$scope.actividad.includes('Productos')){
        $scope.actividad = $scope.actividad + ' -> Productos';
    }

    $scope.loadMoreData = function() {
        $stateParams.pagina ++;
        publicService.obtenerProductosDeCategoria($stateParams.idCategoria, $stateParams.nombreCategoria, $stateParams.actividad, $stateParams.pagina).success(function(data){
            if (data.productos.length > 0) {
                $scope.pss = $scope.pss.concat(data.productos);
                $scope.hayItems = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
                
            }
            else {
                $scope.hayItems = false;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            
        }).error(function(data){
            LxNotificationService.error('Error al obtener productos');
        }); 
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMoreData();
    });

    $scope.verInfoProducto = function(prod){
        var param = {
                        prod: prod,
                        actividad: $scope.actividad
                     }         
        $state.go('menu.home.infoProducto',param);
    }

})

.controller('infoProductoCtrl',function ($scope,$sce, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, publicService, $state, infoProducto, $ionicModal, $ionicSlideBoxDelegate) {


    $scope.producto = infoProducto.data[0].prod.prod;
    $scope.actividad = infoProducto.data[0].prod.actividad;
    $scope.imagenes = infoProducto.data;

    if(!$scope.actividad.includes('Info Producto')){
        $scope.actividad = $scope.actividad + ' -> ' + $scope.producto.nombreProducto +' -> Info Producto';
    }

     $scope.renderHTML = function(html_code)
    {
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
      console.log('Modal is shown!');
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

.controller('SingUpCtrl',function ($scope, $rootScope, $location, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, publicService, $state) {
    
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
               $state.go("menu.home");
            }, function (response) {
                console.log("onError");
            });
        }
    };

})

.controller('perfilCtrl',function ($scope, $rootScope, $location,$state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, privateService, $ionicLoading, datosPerfil) {
    
    $scope.perfil = datosPerfil.data;
    
    console.log ("Perfil del usuario: ",$scope.perfil);
    
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
