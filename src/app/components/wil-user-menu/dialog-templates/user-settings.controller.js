'use strict'

angular.module('generatedApp')
    .controller('UserSettingsCtrl', ['$scope', '$mdDialog', 'User', 
        '$log', '$http',
    function UserSettingsCtrl ($scope, $mdDialog, User, 
        $log, $http) {

    $scope.deleteUser = function () {
        console.log('deleteUser');
        // Tell server to delete the sessioned user.

        $http({
            method: 'POST',
            url: '/delete-user', 
        })
        .then(function (response) {
            console.log('response', response);
        })
        .catch(function (error) {
            console.log('error deleting user', error);
        });

        // unauthenticate with Firebase
       
        // navigate to login screen (or signup). 
    };

    $scope.openUserProfile = function (ev) {

        $mdDialog.show({
          controller:  'UserProfileCtrl',
          templateUrl: 
              'components/wil-user-menu/dialog-templates/user-profile.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
    };

    $scope.close = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
