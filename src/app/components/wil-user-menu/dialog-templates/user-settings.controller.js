'use strict'

angular.module('generatedApp')
    .controller('UserSettingsCtrl', ['$scope', '$mdDialog', 'User', 
        '$log', '$http', '$location', 'Auth',
    function UserSettingsCtrl ($scope, $mdDialog, User, 
        $log, $http, $location, Auth) {

    /**
     * @description 
     * Delete the user in firebase, unauthenticate with firebase, end server
     * session.
     */
    $scope.deleteUser = function () {

        // Tell server to delete the user currently in session.
        $http({
            method: 'POST',
            url: '/delete-user', 
        })
        .then(function (response) {
            // if delete user action is successful, log out of firebase and
            // server.
            if(response.data.isDeleted) {
                // Close user settings dialog.
                $mdDialog.hide(); 

                // Unauthenticate with Firebase.
                Auth.logout();

                // End server session.
                $http({
                    method: 'POST',
                    url: '/logout'
                })
                .then(function (response) {
                    // navigate to login screen (or signup). 
                    $location.path('/');
                })
                .catch(function (error) {
                    $log.error('/logout request', error);
                });
            }
        })
        .catch(function (error) {
            console.log('/delete-user request', error);
        });

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
