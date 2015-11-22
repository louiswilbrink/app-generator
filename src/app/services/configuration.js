/*
 * Notes:
 * Application configuration values can be stored and accessed here.
 * Some configuration values will be retreived from the server on 
 * initialization.  These values are sources from `server/configuration.js`, 
 * only a subset of client-side configuration values will be provided at the
 * route `/app-configuration`.
 */
(function () {
'use strict'

angular.module('app.services.config', [])
    .service('Config', configService);

    configService.$inject = ['$http'];

    function configService ($http) {

        var config = {};

        return {
            init: function () {
                return $http({
                    method: 'GET',
                    url: '/app-configuration'
                })
                .success(function (response) {
                    // Assign configuration values to service variables.
                    config = response;
                    console.log('Application configured');
                })
                .error(function (response) {
                    console.log('Error: loading config:', response);
                });
            },
            val: function () {
                return config;
            }
        }
    };
})();
