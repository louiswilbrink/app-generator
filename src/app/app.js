'use strict'

angular.module('generatedApp', ['ngRoute', 'ngMaterial', 'ngMessages', 
    'app.services.auth', 'app.components.login', 'app.components.signUp', 
    'app.components.wilToolbar', 'app.directives.progress', 
    'app.components.wilSidenav', 'app.components.wilUserMenu',
    'app.services.user', 'app.services.toast', 'app.services.config'])
    .config(function ($routeProvider) {

    /**************************************************
    * Route Configuration
    **************************************************/
    $routeProvider.when('/', {
        templateUrl: 'pages/login.html',
        resolve: {
            isAuthenticated: function ($http, $location, Auth, $q, User) {

                var isAuthenticated = $q.defer();
                
                // If the client is authenticated with the server AND firebase,
                // go directly to the dashboard.  If not, resolve the promise 
                // to display the page (login).
                //
                // First checking server authentication..
                $http.get('/is-authenticated').then(function () {
                  console.log('/is-authenticated (200)');
                  return Auth.getAuthAsPromise();
                })
                // .. then getting the authentication state of the client..
                .then(function (authState) {

                  // If a user id exists, then the client is currently
                  // authenticated with Firebase.
                  if (authState.uid) {
                    // Populate User data: name, email, etc..
                    User.init(authState.uid);

                    console.log('[firebase] - authenticated');

                    // /dashboard is an auth page.
                    $location.path('/dashboard');
                  }
                  else {
                    console.log('Client NOT authenticated with Firebase');

                    // Since the client isn't authenticated with Firebase,
                    // resolve the promise and load the login page.
                    isAuthenticated.resolve();
                  }
                })
                .catch(function (error) {
                    console.log('Client not authenticated with server and/or' +
                        ' firebase');

                    // Only resolve if the client is unauthenticated.
                    // This will load the login page.
                    isAuthenticated.resolve(); 
                });

                return isAuthenticated.promise;
            }
        },
    })
    .when('/sign-up', {
        templateUrl: 'pages/sign-up.html',
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

 

