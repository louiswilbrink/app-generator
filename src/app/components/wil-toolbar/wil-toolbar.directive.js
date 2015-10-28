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

        vm.toggleLeft = buildToggler('left');

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
          var debounceFn =  $mdUtil.debounce(function(){
                $mdSidenav(navID)
                  .toggle()
                  .then(function () {
                    $log.debug("toggle " + navID + " is done");
                  });
              },200);
          return debounceFn;
        }
    }
})();
