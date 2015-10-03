'use strict'

angular.module('generatedApp', ['ngRoute', 'ngMaterial', 'ngMessages', 
    'app.components.login', 'app.components.signUp', 
    'app.components.wilToolbar'])
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
                        console.log('success', payload);
                    })
                    .error(function (error) {
                        console.log(error);
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

 

