(function () {
'use strict'

angular.module('app.services.auth', ['firebase'])
    .service('Auth', authService);

    authService.$inject = ['$firebaseAuth', '$q', '$timeout'];

    function authService ($firebaseAuth, $q, $timeout) {

        // Create firebase reference to endpoint, then create authentication
        // reference.
        var ref = new Firebase('https://wilforge-generator.firebaseio.com/');
        var authRef = $firebaseAuth(ref);

        return {
            withEmail: function (email, password) {
                var result = $q.defer();

                authRef.$authWithPassword({
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
