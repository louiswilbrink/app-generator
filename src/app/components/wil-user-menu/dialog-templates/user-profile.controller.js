'use strict'

angular.module('generatedApp')
    .controller('UserProfileCtrl', ['$scope', '$mdDialog', 'User', '$timeout',
    function DashboardCtrl ($scope, $mdDialog, User, $timeout) {

    // Populate with existing info.  

    $scope.user = {};

    $scope.$watch('user', function (newValue, oldValue) {
        console.log(oldValue, newValue);
    });

    // Watch for initialization/changes in user info.
    $scope.$watch(function watchUser () {
        return User.info;
    }, function () {
        console.log('User.info changed');

        $scope.user = {
            name: User.getName(),
            phone: User.getPhone(),
            email: User.getEmail(),
            address: User.getAddress(),
            birthday: User.getBirthday()
        };
    }, true);

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
