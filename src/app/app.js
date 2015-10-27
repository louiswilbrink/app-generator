'use strict'

angular.module('generatedApp', ['ngRoute', 'ngMaterial', 'ngMessages', 
    'app.services.auth', 'app.components.login', 'app.components.signUp', 
    'app.components.wilToolbar', 'app.directives.progress', 
    'app.components.wilSidenav', 'app.components.wilUserMenu'])
    .config(function ($routeProvider) {

    /**************************************************
    * Route Configuration
    **************************************************/
    $routeProvider.when('/', {
        templateUrl: 'views/login.html'
    })
    .when('/sign-up', {
        templateUrl: 'views/sign-up.html'
    })
    .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
            auth: function ($http, $location) {
                return $http.get('/is-authenticated')
                    .success(function (payload) {
                        console.log('/is-authenticated (200)');
                    })
                    .error(function (error) {
                        console.log('/is-authenticated (500)');
                        $location.path('/');
                    });
            }
        }
    })
    .when('/example-angular-route', {
        template: '<h1>Example Angular Route</h1>'
    })
    .otherwise({
        redirectTo: '/'
    });
});

 

