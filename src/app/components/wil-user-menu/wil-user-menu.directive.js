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

    WilUserMenuCtrl.$inject = ['$mdDialog', '$mdUtil', '$mdSidenav', '$log'];

    function WilUserMenuCtrl ($mdDialog, $mdUtil, $mdSidenav, $log) {
        var vm = this;
        
        console.log('WilUserMenuCtrl');

        var originatorEv;

        vm.openMenu = function($mdOpenMenu, ev) {
          originatorEv = ev;
          $mdOpenMenu(ev);
        };

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
