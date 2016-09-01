(function () {
'use strict'

angular.module('app.services.auth', ['firebase'])
  .service('Auth', authService);

  authService.$inject = ['$firebaseAuth', '$q', '$timeout'];

  function authService ($firebaseAuth, $q, $timeout) {

    var ref;

    return {
      setEndpoint: function (endpoint) {
        ref = new Firebase(endpoint);
      },
      authRef: function () {
        return $firebaseAuth(ref);
      },
      withEmail: function (email, password) {
        var result = $q.defer();

        this.authRef().$authWithPassword({
            email: email,
            password: password
        })
        .then(function (response) {
            result.resolve(response);
        })
        .catch(function (error) {
            result.reject(error);
        });

        return result.promise;
      },
      getAuth: function () {
        return ref.getAuth();
      },
      /*
       * params: none
       * return: promise
       * notes:  In this function, we are wrapping a syncronous firebase
       *         method in a promise.  This is method is called by 
       *         resolve functions in the routeProvider.
       */
      getAuthAsPromise: function () {
        var deferred = $q.defer();
        var authState = ref.getAuth();

        if (authState) {
            deferred.resolve(authState);
        }
        else {
            deferred.reject();
        }

        return deferred.promise;
      },
      logout: function () {
        return ref.unauth();
      }
    }
  };
})();
