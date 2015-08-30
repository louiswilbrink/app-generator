'use strict'

angular.module('generatedApp')
    .controller('LoginCtrl', ['$scope', '$http', '$httpParamSerializer', '$location', function LoginCtrl ($scope, $http, $httpParamSerializer, $location) {

    $scope.login = function (credentials) {
        $http({
            method: 'POST',
            url: '/login', 
            data: $httpParamSerializer({
                username: credentials.username,
                password: credentials.password
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
    };
}]);
