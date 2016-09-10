var usuariosService,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

usuariosService = (function(superClass) {
  extend(usuariosService, superClass);

  function usuariosService($server) {
    var Usuario;
    Usuario = (function() {
      function Usuario(data) {
        if (data == null) {
          data = {};
        }
        this._serialized = 'Usuarios';
        angular.extend(this, data);
      }

      return Usuario;

    })();
    return {
      Usuario: Usuario,
      actual: null,
      iniciarSesion: function(credenciales, callbackSuccess, callbackError) {
        if (callbackSuccess == null) {
          callbackSuccess = angular.noop;
        }
        if (callbackError == null) {
          callbackError = angular.noop;
        }
        //base_url  
        return $server.post('/chasqui/rest/client/sso/singUp', credenciales, (function(_this) {
          return function(usuario) {
            _this.actual = usuario;
            return callbackSuccess(usuario);
          };
        })(this), callbackError);
      },
      estaLogueado: function() {
        return this.actual !== null;
      },
      noEstaLogueado: function() {
        return this.actual === null;
      },
      usuarioActual: function() {
        return this.actual;
      }
    };
  }

  return usuariosService;

})(Factory);