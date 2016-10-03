function LoginCtrl ($scope, $rootScope, $location, $state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk) {
        
    $scope.usuario= {};           
   
    ionicMaterialInk.displayEffect();


    $scope.login = function () {
        AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
            AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);
            console.log("paso set credentials");    
            $state.go("menu.home");
        }, function (response) {
            console.log("onError");
        });
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}