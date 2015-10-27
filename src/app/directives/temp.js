angular.module('myApp')
  .directive('myDirective', function () {
  var directiveDefinitionObject = {
    priority: 0,
    template: '<div></div>', 
    transclude: false,
    restrict: 'E',
    scope: {
        name: '='
    }
    controller: function($scope, $element, $attrs) {
        $scope.city = 'Denver';
    },
    controllerAs: 'vm',
     link: function (scope, element, ) { ... }
  };
  return directiveDefinitionObject;
});

