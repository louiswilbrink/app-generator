'use strict'

angular.module('generatedApp')
    .controller('UserProfileCtrl', ['$scope', '$mdDialog', 'User', 
        '$timeout', '$mdToast', 'Toast', '$log',
    function UserProfileCtrl ($scope, $mdDialog, User, 
        $timeout, $mdToast, Toast, $log) {

    // Populate with existing info.  
    $scope.user = {};
    $scope.buttonText = 'Close';
    $scope.user = User.info;
    $scope.isEdited = false;

    $scope.setSaveButton = function () {
        $scope.buttonText = 'Save';
        $scope.isEdited = true;

    };

    $scope.openUserSettings = function (ev) {

        $mdDialog.show({
          controller:  'UserSettingsCtrl',
          templateUrl: 
              'components/wil-user-menu/dialog-templates/user-settings.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true
        })
    };

    $scope.saveClose = function () {
        if ($scope.isEdited) {
            User.saveInfo().then(function (isUserUpdated) {
                if (isUserUpdated) {
                    $scope.isEdited = false;
                    $scope.buttonText = 'Close';

                    Toast.simple('User profile updated!');
                }
            });
        }
        else {
            $mdDialog.hide();
        }
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
