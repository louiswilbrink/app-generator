(function () {
'use strict'

angular.module('app.services.auth', ['firebase'])
    .service('Auth', authService);

    authService.$inject = ['$firebaseAuth', '$q', '$timeout', 'Config'];

    function authService ($firebaseAuth, $q, $timeout, Config) {

        return {
            ref: function () {

              return new Firebase(Config.firebaseEndpoint());
            },
            authRef: function () {
                return $firebaseAuth(this.ref());
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
                return this.ref().getAuth();
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
                var authState = this.ref().getAuth();

                if (authState) {
                    deferred.resolve(authState);
                }
                else {
                    deferred.reject();
                }

                return deferred.promise;
            },
            logout: function () {
                return this.ref().unauth();
            }
        }
    };
})();
