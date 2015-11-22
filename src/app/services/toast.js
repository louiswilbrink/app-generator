(function () {
'use strict'

angular.module('app.services.toast', ['ngMaterial'])
    .service('Toast', toastService);

    toastService.$inject = ['$mdToast'];

    function toastService ($mdToast) {

        var vm = {};

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

        return {
            simple: function (message) {

                var toastContent = $mdToast.simple()
                    .content(message)
                    .position(vm.getToastPosition())
                    .hideDelay(3000)

                $mdToast.show(toastContent);
            }
        }
    };
})();
