(function () {
'use strict'

angular.module('app.directives.progress', [])
    .directive('wilProgress', wilProgressDirective);

    function wilProgressDirective () {
        return {
            restrict: 'E',
            templateUrl: '<md-progress-circular md-mode="indeterminate"></md-progress-circular>',
            scope: {},
            controller: wilProgressCtrl,
            controllerAs: 'vm'
        };
    }

    wilProgressCtrl.$inject = ['$scope'];

    function wilProgressCtrl ($scope) {
        var vm = this;

        console.log('wilProgressCtrl');

    }
})();
