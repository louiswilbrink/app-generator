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

    WilUserMenuCtrl.$inject = ['$scope', '$mdDialog', '$mdUtil', '$mdSidenav', 
        '$log', 'Auth', '$location', '$http'];

    function WilUserMenuCtrl ($scope, $mdDialog, $mdUtil, $mdSidenav, $log, 
        Auth, $location, $http) {
        var vm = this;

        var originatorEv;

        this.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
        
        vm.showMessages = function(ev) {
          // Appending dialog to document.body to cover sidenav in docs app
          // Modal dialogs should fully cover application
          // to prevent interaction outside of dialog
          $mdDialog.show(
            $mdDialog.alert()
              .parent(
                  angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('Messages')
              .content('You have no unread messages.  Good job!')
              .ariaLabel('Alert Dialog Demo')
              .ok('Great!')
              .targetEvent(ev)
          );
        };

        vm.showProfile = function(ev) {
          $mdDialog.show({
            controller:  'UserProfileCtrl',
            templateUrl: 
                'components/wil-user-menu/dialog-templates/user-profile.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
          })
        };

        vm.logout = function () {
            // Unauthenticate with firebase.  This is a synchronous call.
            Auth.logout(); 

            // Unauthenticate with server.
            $http({
                method: 'POST',
                url: '/logout'
            })
            .then(function (response) {
                console.log('server logout:', response.status);
                $location.path('/');
            })
            .catch(function (error) {
                console.log('error!');
            });
        };
    }
})();
