(function () {
'use strict';

angular.module('app.components.wilSidenav', [])
    .directive('wilSidenav', wilSidenavDirective);

    function wilSidenavDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/wil-sidenav/wil-sidenav.html',
            scope: {},
            controller: WilSidenavCtrl,
            controllerAs: 'vm'
        };
    }

    WilSidenavCtrl.$inject = ['$scope', '$mdSidenav', '$log', '$mdToast'];

    function WilSidenavCtrl ($scope, $mdSidenav, $log, $mdToast) {
        var vm = this;

        vm.close = function () {
          $mdSidenav('left').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
        };

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };

        function sanitizePosition() {
            var current = vm.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }

        vm.toastPosition = angular.extend({},last);

        vm.getToastPosition = function() {
          sanitizePosition();
          return Object.keys(vm.toastPosition)
            .filter(function(pos) { return vm.toastPosition[pos]; })
            .join(' ');
        };

        vm.toast = function(message) {
            $mdToast.show(
                $mdToast.simple()
                    .content(message)
                    .position(vm.getToastPosition())
                    .hideDelay(3000)
            );
        };
    }
})();
