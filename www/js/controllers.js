/* global angular, document, window */
'use strict';

angular.module('chasqui.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout,usuarioService) {
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
    
    $ionicPopover.fromTemplateUrl('/templates/notificaciones.html', {
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

    $scope.loadNotificaciones = function () {
        $scope.notificaciones = usuarioService.obtenerNotificaciones();
        console.log ($scope.notificaciones);
    }

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
})

.controller('SideMenuCtrl', function($scope) {
    var right_menus = [{
        name: "General",
        items: [
            // {
            //     "title": "Activity",
            //     "sref": "menu.activity"
            // },
            {
                "title":"Perfil Usuario",
                "sref":"menu.perfil"
            }
            // ,{
            //     "title": "Login",
            //     "sref": "app.login"
            // },{
            //     "title": "Profile",
            //     "sref": "menu.profile"
            // },{
            //     "title": "Friends",
            //     "sref": "menu.friends"
            // },{
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

.controller('LoginCtrl',['$scope', '$rootScope', '$location','$state', 'AuthenticationService', '$timeout', '$stateParams', 'ionicMaterialInk','usuarioService',LoginCtrl])
/*.controller("perfilCtrl",['$scope', '$rootScope', '$location', '$state','AuthenticationService','$timeout', '$stateParams', 'ionicMaterialInk','usuarioService','$ionicLoading',perfilCtrl])*/

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


.controller('SingUpCtrl',function ($scope, $rootScope, $location, AuthenticationService,$timeout, $stateParams, ionicMaterialInk,usuarioService,$state, datosPerfil) {
    
    debugger;
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
            usuarioService.registro($scope.perfil,function(data){
               $state.go("menu.perfil");
            });
        }
    };

})

.controller('perfilCtrl',function ($scope, $rootScope, $location,$state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk, usuarioService, $ionicLoading, datosPerfil) {
    
   
    //datosPerfil se inyecta ya que es el nombre de la variable del resolve que retorna los datos del perfil
    
    $scope.perfil = datosPerfil;
    
    console.log ("Perfil del usuario: ",$scope.perfil);
    
    $scope.esEdicionPerfil=true;         
    $scope.perfil = {};
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
        $scope.show();
        //llamar al servicio de edicion;
        //$scope.hide();
        $scope.esEdicionPerfil = true;
    }


});
