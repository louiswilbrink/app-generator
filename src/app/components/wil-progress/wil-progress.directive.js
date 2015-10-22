(function () {
'use strict'

angular.module('app.directives.progress', [])
    .directive('wilProgress', wilProgressDirective);

    function wilProgressDirective () {
        return {
            restrict: 'E',
            templateUrl: 'components/wil-progress/wil-progress.html',
            scope: {},
            controller: wilProgressCtrl,
            controllerAs: 'vm'
        };
    }

    wilProgressCtrl.$inject = ['$scope'];

    function wilProgressCtrl ($scope) {
        var vm = this;
        
        // nothing here -- just needed a reusable template.
    }
})();
