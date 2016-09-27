function perfilCtrl ($scope, $rootScope, $location,$state, AuthenticationService, $timeout, $stateParams, ionicMaterialInk,usuarioService,$ionicLoading) {
        
    $scope.perfil = usuarioService    
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

}