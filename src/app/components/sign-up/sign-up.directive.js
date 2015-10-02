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

    SignUpCtrl.$inject = ['$http', '$httpParamSerializer'];

    function SignUpCtrl ($http, $httpParamSerializer) {
        var vm = this;

        vm.email = null;
        vm.password = null;

        vm.onSignUp = function (email, password) {
            console.log('onSignUp');
            $http({
                method: 'POST',
                url: '/register-user', 
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
            }, function (err) {
                console.log('got an error', err);
            });
        }
    }
})();
