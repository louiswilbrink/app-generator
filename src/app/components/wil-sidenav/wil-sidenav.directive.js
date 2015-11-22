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

    WilSidenavCtrl.$inject = ['$scope', '$mdSidenav', '$log', 
        '$mdToast', 'Toast'];

    function WilSidenavCtrl ($scope, $mdSidenav, $log, $mdToast, Toast) {
        var vm = this;

        vm.close = function () {
          $mdSidenav('left').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
        };

        vm.toast = function(message) {
            Toast.simple(message);
        };
    }
})();
