/*
  Este Factory tiene la intención de ser utilizado
  para realizar llamadas al servidor. Es un reemplazo
  generico a $http de angular, en donde, se provee
  la misma interfaz (get, post, put, delete, insert)
  pero en donde los metodos toman callback opcionales
  para el caso de exito y error.

  Si bien no es un reemplazo general, es utilizable en
  la mayoria de los casos en donde se desea realizar una
  acción en caso de exito y uno en caso de error.

  Por ejemplo, el siguiente llamado $http:

  $http.post('url.url', {payload: 'something'}).success(f1).error(f2)

  se transforma entonces en

  $server.post('url', {}, f1, f2)

  Donde los parámetros, a excepción de la URL son opcionales.
 */
var $server,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

$server = (function(superClass) {
  extend($server, superClass);

  function $server($http, $q) {
    var __call;
    __call = function(type) {
      return function(uri, data, callbackSuccess, callbackError) {
        if (callbackSuccess == null) {
          callbackSuccess = angular.noop;
        }
        if (callbackError == null) {
          callbackError = angular.noop;
        }
        if (isFunction(data)) {
          callbackError = callbackSuccess;
          callbackSuccess = data;
          data = null;
        }
        return $http[type](uri, data).then(function(response) {
          return callbackSuccess(response.data);
        }, function(response) {
          var ref, responseData;
          responseData = (ref = response.data) != null ? ref : {
            message: 'Ha ocurrido un error inesperado en el servidor.'
          };
          return callbackError((responseData.message ? responseData.message : responseData));
        });
      };
    };
    return {
      get: __call('get'),
      post: __call('post'),
      put: __call('put'),
      "delete": __call('delete'),
      head: __call('head'),
      options: __call('options'),
      trace: __call('trace'),
      connect: __call('connect'),
      patch: __call('patch'),
      promise: function(valueSuccess, valueError, callbackSuccess, callbackError, shouldResolve) {
        var promise;
        if (shouldResolve == null) {
          shouldResolve = true;
        }
        if (isFunction(valueError)) {
          shouldResolve = callbackError != null ? callbackError : true;
          callbackError = callbackSuccess;
          callbackSuccess = valueError;
          valueError = null;
        }
        promise = $q(function(resolve, reject) {
          return setTimeout(function() {
            if (shouldResolve) {
              return resolve(valueSuccess);
            } else {
              return reject(valueError);
            }
          }, 1);
        });
        return promise.then(callbackSuccess, callbackError);
      }
    };
  }

  return $server;

})(Factory);
