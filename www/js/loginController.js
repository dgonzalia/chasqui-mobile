function loginCtrl ($scope, $location, $state, AuthenticationService,$cordovaSQLite, $timeout, $stateParams, ionicMaterialInk, LxNotificationService) {
        
    $scope.usuario= {};           
   
    ionicMaterialInk.displayEffect();


    $scope.login = function () {
        AuthenticationService.Login($scope.usuario.email, $scope.usuario.password, function(response) {
            AuthenticationService.SetCredentials($scope.usuario.email, response.token, response.id, response.nickname);  
            var query = "INSERT INTO USUARIO (TOKEN,EMAIL,ID_USUARIO,NICKNAME) VALUES (?,?,?,?)";
            var borrado = "DELETE FROM USUARIO"; 
            if (window.cordova) {
                db = $cordovaSQLite.openDB({ name: "chasqui.db" ,iosDatabaseLocation:'default'}); //device
            }else{
                db = window.openDatabase("chasqui.db", '1', 'my', 1024 * 1024 * 100); // browser
            }

            $cordovaSQLite.execute(db,borrado);
            $cordovaSQLite.execute(db,query,[response.token,$scope.usuario.email,response.id,response.nickname])
                          .then(function(result){
                            console.log(result);

                          });
            $state.go("menu.home");
        }, function (response) {
            LxNotificationService.error('No es posible conectarse al servidor');
        });
    };

    $scope.singUp = function(){
        $state.go("app.singup");
    }


}