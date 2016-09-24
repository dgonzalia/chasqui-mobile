// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('chasqui', ['ionic', 'chasqui.controllers', 'chasqui.services', 'ionic-material', 'ionMdInput'])

.run(function($ionicPlatform) {
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
    });
})

/*.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
 
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
}])*/

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
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })


    .state('menu', {
        url: '/menu',
        abstract:true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl',
        // resolve: {
        //     notificaciones : function(usuarioService){
        //         return usuarioService.obtenerNotificaciones();
        //     } 
        // }
    })


    .state('menu.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })
    .state('menu.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-friends').classList.toggle('on');
                    }, 900);
                }
            }
        }
    })
    .state('menu.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })
    .state('app.login', {
        url: '/login',
        // templateUrl: 'templates/login.html',
        // controller: 'LoginCtrl'
        views: {
             'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('singup',{
        url:'/chasqui_profile',
        templateUrl: 'templates/chasqui_profile.html',
        controller: 'singUpCtrl'
    })

    .state('menu.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    /*$timeout(function () {
                        document.getElementById('fab-profile').classList.toggle('on');
                    }, 800);*/
                }
            }
        }
    })

    .state('menu.components', {
        url: '/components',
        abstract: true,
        controller: 'AppCtrl',
        // resolve: {
        //     notificaciones : function(usuarioService){
        //         console.log("LAOEOEOE")
        //         console.log(usuarioService.obtenerNotificaciones());
        //         return usuarioService.obtenerNotificaciones();
        //     } 
        // }

    })
    .state('menu.components.header', {
        url: '/header',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/header.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.content', {
        url: '/content',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/content.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.footer', {
        url: '/footer',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/footer.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.buttons', {
        url: '/buttons',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/buttons.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.list', {
        url: '/list',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/list.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.cards', {
        url: '/cards',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/cards.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.forms', {
        url: '/forms',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/forms.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.toggle', {
        url: '/toggle',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/toggle.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.checkbox', {
        url: '/checkbox',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/checkbox.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.radio-buttons', {
        url: '/radio-buttons',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/radio-buttons.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.range', {
        url: '/range',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/range.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.select', {
        url: '/select',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/select.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.tabs', {
        url: '/tabs',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/tabs.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.grid', {
        url: '/grid',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/grid.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    .state('menu.components.utility', {
        url: '/utility',
        views: {
            'menuContent@app': {
                templateUrl: 'templates/components/utility.html',
                controller: 'ComponentsCtrl'
            },
            'fabContent': {
                template: '',
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
