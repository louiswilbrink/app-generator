'use strict'

angular.module('generatedApp')
    .controller('UserProfileCtrl', ['$scope', '$mdDialog', 'User', '$timeout',
    function DashboardCtrl ($scope, $mdDialog, User, $timeout) {

    // Populate with existing info.  
    $scope.user = {};

    /*
     * params: string
     * return: none
     *
     * notes: sends new user info to the user service.
     */
    $scope.updateUser = function ($event) {
        var field = $event.target.name;
        console.log('updating user', $event, field);

        // During update, toggle progress bar ON.
        $scope.user['is' + _.startCase(field) + 'Edited'] = true;
        console.log($scope.user);

        if ($event.keyCode === 13) {
            console.log('enter pressed!');
            // put focus on 'close' button afterwards
        }
        else if ($event.type === 'blur') {
            console.log('blur');
        }
    };

    // Watch for initialization/changes in user info.
    $scope.$watch(function watchUser () {
        return User.info;
    }, function () {
        console.log('User.info changed');

        $scope.user = {
            name: User.getName(),
            isNameEdited: false,
            phone: User.getPhone(),
            isPhoneEdited: false,
            email: User.getEmail(),
            isEmailEdited: false,
            address: User.getAddress(),
            isAddressEdited: false,
            birthday: User.getBirthday(),
            isBirthdayEdited: false  
        };
    }, true);

    $scope.close = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
