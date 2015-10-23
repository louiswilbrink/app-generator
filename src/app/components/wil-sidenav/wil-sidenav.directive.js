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

    WilSidenavCtrl.$inject = ['$scope'];

    function WilSidenavCtrl ($scope) {
        var vm = this;

        console.log('WilSidenavCtrl');

        $scope.toggleLeft = buildToggler('left');
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

        $scope.close = function () {
          $mdSidenav('left').close()
            .then(function () {
              $log.debug("close LEFT is done");
            });
        };
    }
})();
