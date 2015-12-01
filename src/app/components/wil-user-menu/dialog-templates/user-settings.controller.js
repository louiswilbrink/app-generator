'use strict'

angular.module('generatedApp')
    .controller('UserSettingsCtrl', ['$scope', '$mdDialog', 'User', 
        '$timeout', '$mdToast', 'Toast', '$log',
    function UserSettingsCtrl ($scope, $mdDialog, User, 
        $timeout, $mdToast, Toast, $log) {


    $scope.deleteUser = function () {
        console.log('deleteUser');
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
