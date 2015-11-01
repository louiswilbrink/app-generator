(function () {
'use strict'

angular.module('app.components.wilUserMenu', [])
    .directive('wilUserMenu', wilUserMenuDirective);

    function wilUserMenuDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/wil-user-menu/wil-user-menu.html',
            scope: {},
            controller: WilUserMenuCtrl,
            controllerAs: 'vm',
            link: function (scope, element, attrs) {
            }
        };
    }

    WilUserMenuCtrl.$inject = ['$scope', '$mdDialog', '$mdUtil', '$mdSidenav', '$log', 'Auth'];

    function WilUserMenuCtrl ($scope, $mdDialog, $mdUtil, $mdSidenav, $log, Auth) {
        var vm = this;

        var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
        
        $scope.showMessages = function(ev) {
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application
          // to prevent interaction outside of dialog
          $mdDialog.show(
            $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Messages')
              .content('You have no unread messages.  Good job!')
              .ariaLabel('Alert Dialog Demo')
              .ok('Great!')
              .targetEvent(ev)
          );
        };

        $scope.showAdvanced = function(ev) {
          $mdDialog.show({
            controller:  function ($scope, $mdDialog) {
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
                    $mdDialog.hide(answer);
                };
            },
            templateUrl: 'components/wil-user-menu/dialog-templates/user-profile.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          })
          .then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function() {
            $scope.status = 'You cancelled the dialog.';
          });
        };

        $scope.logout = function () {
            Auth.logout();
        };
    }
})();
