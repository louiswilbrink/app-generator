'use strict'

angular.module('generatedApp')
    .controller('UserProfileCtrl', ['$scope', '$mdDialog', function DashboardCtrl ($scope, $mdDialog) {

    $scope.close = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
}]);
