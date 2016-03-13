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

    LoginCtrl.$inject = ['$http', '$httpParamSerializer', '$location', 
        'Auth', 'Config', '$log', '$q'];

    function LoginCtrl ($http, $httpParamSerializer, $location, 
        Auth, Config, $log, $q) {
        var vm = this;

        vm.email = null;
        vm.password = null;
        vm.isUnauthorized = false;
        vm.isLoading = false;

        Config.appName().then(function (appName) {
          vm.appName = appName;
          console.log('vm.appName', vm.appName);
        });

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
                return Auth.withEmail(email, password);
            })
            .then(function (response) {
                $location.path('/dashboard');
            })
            .catch(function (error) {
                vm.isUnauthorized = true;
                vm.isLoading = false;
                $log.error('login error:', error);
            });
        }
    }
})();
