function LoginCtrl ($scope, $rootScope, $location,$state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk) {
        
    $scope.usuario= {};           
   
    ionicMaterialInk.displayEffect();


    $scope.login = function () {
        console.log("login function");
        AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
                AuthenticationService.SetCredentials($scope.usuario.email, response.token);
                $state.go("menu.perfil");
        }, function (response) {
            console.log("onError");
        }
        );
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}