'use strict'

angular.module('generatedApp')
    .controller('UserProfileCtrl', ['$scope', '$mdDialog', 'User',
    function DashboardCtrl ($scope, $mdDialog, User) {

    // Populate with existing info.  

    $scope.user = {
        name: User.getName(),
        phone: User.getPhone(),
        email: User.getEmail(),
        address: User.getAddress(),
        birthday: User.getBirthday()
    };

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
