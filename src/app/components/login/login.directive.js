(function() {
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

    LoginCtrl.$inject = ['$http', '$httpParamSerializer', '$location'];

    function LoginCtrl ($http, $httpParamSerializer, $location) {
        var vm = this;

        vm.email = null;
        vm.password = null;

        vm.onLogin = function (email, password) {
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
            .then(function (response) {
                console.log('got a response!', response);
                $location.path('/dashboard');
            }, function (err) {
                console.log('got an error', err);
            });
        }
    }
})();
