'use strict'

angular.module('generatedApp', ['ngRoute', 'ngMaterial', 'ngMessages', 
    'app.services.auth', 'app.components.login', 'app.components.signUp', 
    'app.components.wilToolbar', 'app.directives.progress', 
    'app.components.wilSidenav', 'app.components.wilUserMenu',
    'app.services.user'])
    .config(function ($routeProvider) {

    /**************************************************
    * Route Configuration
    **************************************************/
    $routeProvider.when('/', {
        templateUrl: 'pages/login.html'
    })
    .when('/sign-up', {
        templateUrl: 'pages/sign-up.html'
    })
    .when('/dashboard', {
        templateUrl: 'pages/dashboard.html',
        controller: 'DashboardCtrl',
        resolve: {
            serverAuth: function ($http, $location) {
                return $http.get('/is-authenticated')
                    .success(function (payload) {
                        console.log('/is-authenticated (200)');
                    })
                    .error(function (error) {
                        console.log('/is-authenticated (401)');
                        $location.path('/');
                    });
            },
            firebaseAuth: function (Auth, User, $location) {
                return Auth.getAuthAsPromise()
                    .then(function (authState) {
                        console.log('[firebase] - authenticated');
                        // Populate User data: name, email, etc..
                        User.init(authState.uid);
                    })
                    .catch(function (error) {
                        console.log('[firebase] - unauthenticated');
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

 

