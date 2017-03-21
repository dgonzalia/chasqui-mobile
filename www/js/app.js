angular.module('chasqui', ['ionic', 'chasqui.controllers', 'ngCordova','chasqui.services', 'ionic-material', 'ionMdInput', 'lumx'])

.run(function($ionicPlatform, $cordovaSQLite, $state, $ionicHistory, $ionicPopup, AuthenticationService) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)

        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // api key = AIzaSyAxfdNf4NOgVIaozY3TaEV0341rVQYUUCM
        // gcm = 320708593934
        if (window.cordova) {
          db = $cordovaSQLite.openDB({ name: "chasqui.db",iosDatabaseLocation:'default'}); //device
        }else{
          db = window.openDatabase("chasqui.db", '1', 'my', 1024 * 1024 * 100); // browser
        }
        AuthenticationService.setDB(db);
        $cordovaSQLite.execute(db,
        "CREATE TABLE IF NOT EXISTS USUARIO (TOKEN TEXT PRIMARY KEY, EMAIL TEXT, ID_USUARIO INTEGER, NICKNAME TEXT)");

        var query = "SELECT * FROM USUARIO";
        $cordovaSQLite.execute(db,query).then(function(result){
            if(result.rows.length > 0){
                var token = result.rows.item(0).TOKEN;
                var email = result.rows.item(0).EMAIL;
                var id = result.rows.item(0).ID_USUARIO;
                var nickname = result.rows.item(0).NICKNAME;
                AuthenticationService.SetCredentials(email, token,id, nickname); 
            }
        });
        

    });
    $ionicPlatform.registerBackButtonAction(function (e) {
      if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
      } else {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Confirmar',
            template: "¿Salir de Chasqui?",
            cancelText: 'No',
            okText: 'Si'
        });
        confirmPopup.then(function (close) {
          if (close) {
            // there is no back view, so close the app instead
            ionic.Platform.exitApp();
          } // otherwise do nothing
        });
      }
      e.preventDefault();
      return false;
    }, 101);
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract:true,
        templateUrl: 'templates/loading.html',
        controller: 'loadingCtrl'
    })


    .state('menu', {
        url: '/menu',
        abstract:true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        resolve: {
            datosPerfil : function(privateService){
                return privateService.obtenerDatosPerfilUsuario();
            } 
        }
    })

    .state('app.loading', {
        url: '/loading',
        views: {
             'menuContent': {
              templateUrl: 'templates/loading.html'
            }
        },
    })

     .state('abstrac', {
        url: '/abstrac',
        abstract:true,
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('abstrac.login', {
        url: '/login',
        views: {
             'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            }
        },
    })

    .state('singup',{
        url:'/singup',
        templateUrl: 'templates/perfil.html',
        controller: 'singUpCtrl'
    })

    .state('menu.perfil',{
        url:'/perfil',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/perfil.html',
                controller: 'perfilCtrl'
            }
        },
         resolve: {
             datosPerfil : function(privateService){
                return privateService.obtenerDatosPerfilUsuario();
             } 
         }
    })

    .state('menu.direcciones',{
        url:'/direcciones',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/direcciones.html',
                controller:'direccionesCtrl'
            }
        },
        resolve:{
            direcciones : function(privateService){
                return privateService.obtenerDireccionesDeUsuario();
            }
        }        
    })
    
    .state('menu.pedidos.cart.checkout', {
        url: '/checkout',
        views: {
          'menuContent@menu': {
            templateUrl: 'templates/checkout.html',
            controller : 'checkoutCtrl'
          }
        },
        params:{
            idPedido: null,
        },
        resolve:{
            direcciones : function(privateService){
                return privateService.obtenerDireccionesDeUsuario();
            }
        } 
    })
    
    .state('menu.pedidos.cart', {
        url: '/cart',
        views: {
          'menuContent@menu': {
            templateUrl: 'templates/cart.html',
            controller : 'cartCtrl'
          }
        },
        params:{
            idVendedor: null,
        }
    })
    
    .state('menu.pedidos',{
        url:'/pedidos',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/pedidos.html',
                controller:'pedidosCtrl'
            }
        },
        resolve:{
            pedidos: function(privateService){
                return privateService.obtenerPedidosVigentesIndividual();
            }
        }
    })

    .state('menu.home',{
        url:'/home',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/home.html',
                controller:'homeCtrl'
            }
        },
        resolve:{
            vendedores : function(publicService){
                return publicService.obtenerVendedores();
            }
        }
    })

    .state('menu.medallas',{
        url:'/medallas',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/medallas.html',
                controller:'medallasCtrl'
            }
        },
        resolve:{
            medallas: function(publicService){
                return publicService.obtenerMedallas();
            }
        }
    })

    .state('menu.medallas.info',{
        url:'/infoMedalla',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/infoMedalla.html',
                controller:'infoMedallaCtrl'
            }
        },
        params:{
            actividad: null,
            medalla: null
        },
        resolve:{
            medalla : function($stateParams){
                return {actividad:$stateParams.actividad,medalla:$stateParams.medalla};
            }
        }
    })

    .state('menu.home.categorias',{
        url:'/categorias',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/categorias.html',
                controller:'categoriasCtrl'
            }
        },
        params:{
            idVendedor:null,
            actividad:null
        },
        resolve:{
            categorias: function(publicService, $stateParams){
                return publicService.obtenerCategoriasDe($stateParams.idVendedor,$stateParams.actividad);
            }
        }
    })

    .state('menu.home.productores',{
        url:'/productores',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/productores.html',
                controller:'productoresCtrl'
            }
        },
        params:{
            idVendedor:null,
            actividad:null
        },
        resolve:{
            productores: function(publicService, $stateParams){
                return publicService.obtenerProductoresDe($stateParams.idVendedor,$stateParams.actividad);
            }
        }
    })

    .state('menu.home.productores.productos',{
        url:'/productosByProductor',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/productos.html',
                controller:'productosCtrl'
            }
        },
        params:{
            actividad:null,
            idProductor:null,
            nombreProductor:null,
            pagina: null
        },
        resolve:{
            prods : function(publicService,$stateParams){
                return publicService.obtenerProductosDeProductor($stateParams.idProductor,$stateParams.nombreProductor,$stateParams.actividad,$stateParams.pagina);
            }
        }
    })

    .state('menu.home.infoProducto',{
        url:'/infoProducto',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/infoProducto.html',
                controller:'infoProductoCtrl'
            }
        },
        params:{
           prod : null,
           actividad: null
        },
        resolve:{
            infoProducto : function(publicService,$stateParams){
                return publicService.obtenerImagenesDeProducto($stateParams.prod,$stateParams.actividad);
            }
        }
    })

    .state('menu.home.categorias.productos',{
        url:'/productosByCategoria',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/productos.html',
                controller:'productosCtrl'
            }
        },
        params:{
            actividad: null,
            idCategoria: null,
            nombreCategoria: null,
            pagina: null
        },
        resolve:{
            prods : function(publicService, $stateParams){
                return publicService.obtenerProductosDeCategoria($stateParams.idCategoria,$stateParams.nombreCategoria,$stateParams.actividad, $stateParams.pagina);
            }
        }
    })

    .state('menu.home.productores.info',{
        url:'/infoProductor',
        views:{
            'menuContent@menu':{
                templateUrl:'templates/infoProductor.html',
                controller:'infoProductorCtrl'
            }
        },
        params:{
            productor:null,
            actividad:null
        },
        resolve:{
            productor: function(publicService, $stateParams){
                return {productor:$stateParams.productor,actividad:$stateParams.actividad};
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/loading');
})

//https://github.com/zachfitz/Ionic-Material/issues/43
.directive('ngLastRepeat', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngLastRepeat'+ (attr.ngLastRepeat ? '.'+attr.ngLastRepeat : ''));
                });
            }
        }
    };
})
;
