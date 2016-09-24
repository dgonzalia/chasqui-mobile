function LoginCtrl ($scope, $rootScope, $location,$state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk) {
        
    $scope.usuario= {};           
   
    ionicMaterialInk.displayEffect();


    $scope.login = function () {
        console.log("login function");
        AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
                console.log ("onSuccess");
                console.log (response);
                AuthenticationService.SetCredentials($scope.usuario.email, response.token);
                $state.go("menu.activity");
        }, function (response) {
            console.log("onError");
        }
        );
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}