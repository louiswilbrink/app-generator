'use strict'

angular.module('generatedApp')
    .controller('UserSettingsCtrl', ['$scope', '$mdDialog', 'User', 
        '$log', '$http', '$location', 'Auth', '$httpParamSerializer',
    function UserSettingsCtrl ($scope, $mdDialog, User, 
        $log, $http, $location, Auth, $httpParamSerializer) {

    $scope.isLoading = false;
    $scope.hasDeleteError = false;

    /**
     * @description 
     * Delete the user in firebase, unauthenticate with firebase, end server
     * session.
     */
    $scope.deleteUser = function () {
        // Start loading animation and reset error messages (if displayed).
        $scope.isLoading = true;
        $scope.hasDeleteError = false;

        // Tell server to delete the user currently in session.
        $http({
            method: 'POST',
            url: '/delete-user', 
            data: $httpParamSerializer({
                password: $scope.password
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
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
                    // All network operations finished.  Stop loading animation.
                    $scope.isLoading = false;

                    // navigate to login screen (or signup). 
                    $location.path('/');
                })
                .catch(function (error) {
                    // All network operations finished.  Stop loading animation.
                    $scope.isLoading = false;
                    $log.error('/logout request', error);
                });
            }
            // The user was NOT deleted on the server/Firebase.
            else {
                // All network operations finished.  Stop loading animation.
                $scope.isLoading = false;
                
                // Alert user of the error during deleteUser operation.
                $scope.hasDeleteError = true;
            }
        })
        .catch(function (error) {
            // All network operations finished.  Stop loading animation.
            $scope.isLoading = false;

            console.log('/delete-user:', error);
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
