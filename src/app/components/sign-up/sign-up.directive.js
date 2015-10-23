(function() {
'use strict';

angular.module('app.components.signUp', [])
    .directive('signUp', signUpDirective);

    function signUpDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/sign-up/sign-up.html',
            scope: {},
            controller: SignUpCtrl,
            controllerAs: 'vm'
        };
    }

    SignUpCtrl.$inject = ['$http', 
        '$httpParamSerializer', 
        '$location', 
        'Auth'];

    function SignUpCtrl ($http, $httpParamSerializer, $location, Auth) {
        var vm = this;

        vm.email = null;
        vm.password = null;
        vm.isUnauthorized = false;
        vm.isLoading = false;

        vm.onSignUp = function (email, password) {
            vm.isLoading = true;

            // Request server to register user with Firebase.
            $http({
                method: 'POST',
                url: '/register-user', 
                data: $httpParamSerializer({
                    email: email,
                    password: password 
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            // ..then confirm successful registration or handle errors.
            .then(function (response) { 
                // TODO: Set user service
                console.log('/register user (200):', response.data.uid);
                vm.isLoading = false;
            }, function (error) {
                console.log('/register user (500):', error);
                vm.isLoading = false;
                vm.isUnauthorized = true;
            })
            // .. then authenticate with the server.
            .then(function () {

                // TODO: refactor this (in login.directive.js too)
                return $http({
                    method: 'POST',
                    url: '/login', 
                    data: $httpParamSerializer({
                        username: email,
                        password: password 
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            })
            // .. then authenticate with Firebase.
            .then(function (response) {
                vm.isUnauthorized = false;
                return Auth.withEmail(email, password);
            })
            // .. then finally redirect to /dashboard -- you're fully
            // authenticated at this point.
            .then(function (response) {
                $location.path('/dashboard');
            })
            .catch(function (error) {
                vm.isUnauthorized = true;
                vm.isLoading = false;
                console.log('sign up error:', error);
            });
        }
    }
})();
