(function () {
'use strict'

angular.module('app.components.wilToolbar', [])
    .directive('wilToolbar', wilToolbarDirective);

    function wilToolbarDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/wil-toolbar/wil-toolbar.html',
            scope: {},
            controller: WilToolbarCtrl,
            controllerAs: 'vm'
        };
    }

    WilToolbarCtrl.$inject = ['$mdDialog'];

    function WilToolbarCtrl ($mdDialog) {
        var vm = this;

        vm.email = 'lw@lw.com';

        var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };
    }
})();
