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
            link: function (scope, element, attrs, controllers) { }
        };
    }

    WilToolbarCtrl.$inject = ['$mdDialog', '$mdUtil', '$mdSidenav', 
        'Config', '$log'];

    function WilToolbarCtrl ($mdDialog, $mdUtil, $mdSidenav, Config, $log) {
        var vm = this;

        vm.appName = Config.val().appName;
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
