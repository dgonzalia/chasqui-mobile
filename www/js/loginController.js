function loginCtrl ($scope, $rootScope, $location, $state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk) {
        
    $scope.usuario= {};           
   
    ionicMaterialInk.displayEffect();


    $scope.login = function () {
        AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
            AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);  
            $state.go("menu.home");
        }, function (response) {
            console.log("TODO: definir onError en login");
        });
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}