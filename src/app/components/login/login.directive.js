(function () {
'use strict';

angular.module('app.components.login', [])
    .directive('login', loginDirective);

    function loginDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/login/login.html',
            scope: {},
            controller: LoginCtrl,
            controllerAs: 'vm'
        };
    }

    LoginCtrl.$inject = ['$http', '$httpParamSerializer', '$location', 'Auth'];

    function LoginCtrl ($http, $httpParamSerializer, $location, Auth) {
        var vm = this;

        vm.email = null;
        vm.password = null;
        vm.isUnauthorized = false;
        vm.isLoading = false;

        // Authenticate with server.
        vm.onLogin = function (email, password) {
            vm.isLoading = true;
            $http({
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
            // ..then authenticate with Firebase from the browser.
            .then(function (response) {
                vm.isUnauthorized = false;
                console.log('server authentication success:', response);
                return Auth.withEmail(email, password);
            })
            .then(function (response) {
                // TODO: Set user service
                console.log('Auth.withEmail success:', response);
                $location.path('/dashboard');
            })
            .catch(function (error) {
                vm.isUnauthorized = true;
                vm.isLoading = false;
                console.log('ERR:', error);
            });
        }
    }
})();
