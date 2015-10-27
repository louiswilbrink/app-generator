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
            controllerAs: 'vm',
            link: function (scope, element, attrs, controllers) {
                console.log(controllers);
            }
        };
    }

    WilToolbarCtrl.$inject = ['$mdDialog', '$mdUtil', '$mdSidenav', '$log'];

    function WilToolbarCtrl ($mdDialog, $mdUtil, $mdSidenav, $log) {
        var vm = this;

    }
})();
