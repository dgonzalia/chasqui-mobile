function loginCtrl ($scope, $location, $state, AuthenticationService,$cordovaSQLite, $timeout, $stateParams, ionicMaterialInk, LxNotificationService) {
        
    $scope.usuario= {};           


    $scope.login = function () {
            AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
            AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);  
            AuthenticationService.GuardarCredenciales(response.token,$scope.usuario.email,response.id,response.nickname);
            $state.go("menu.home");
        }, function (response) {
            console.log(response);
            LxNotificationService.error('No es posible conectarse al servidor');
        });
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}