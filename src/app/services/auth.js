(function () {
'use strict'

angular.module('app.services.auth', ['firebase'])
    .service('Auth', authService);

    authService.$inject = ['$firebaseAuth', '$q'];

    function authService ($firebaseAuth, $q) {

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
                    console.log('$authWithPassword success:', response);
                    result.resolve(response);
                })
                .catch(function (error) {
                    console.log('$authWithPassword error:', error);
                    result.reject(error);
                });

                return result.promise;
            }
        }
    };
})();
