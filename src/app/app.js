'use strict'

angular.module('generatedApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'app.components.login'])
    .config(function ($routeProvider) {

    /**************************************************
    * Route Configuration
    **************************************************/
    $routeProvider.when('/', {
        templateUrl: 'views/login.html'
    })
    $routeProvider.when('/dashboard', {
        template: '<h1>Dashboard</h1>',
        controller: 'DashboardCtrl'
    })
    $routeProvider.when('/example-angular-route', {
        template: '<h1>Example Angular Route</h1>'
    })
});

 
