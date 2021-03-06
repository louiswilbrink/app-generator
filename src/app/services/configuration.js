/*
 * Notes:
 * Application configuration values can be stored and accessed here.
 * Some configuration values will be retreived from the server on 
 * initialization.  These values are sourced from `server/configuration.js`, 
 * only a subset of client-side configuration values will be provided at the
 * route `/app-configuration`.
 */
(function () {
'use strict'

angular.module('app.services.config', [])
  .service('Config', configService);

  configService.$inject = ['$http', '$q', 'Auth', 'User'];

  function configService ($http, $q, Auth, User) {

    var config = null;

    return {
      init: function () {
        return $http({
          method: 'GET',
          url: '/app-configuration'
        })
        .then(function (response) {
          // Assign configuration values to service variables.
          config = response.data;
          console.log('Application configured', config);

          // Seed configuration values to services.
          Auth.setEndpoint(config.firebaseEndpoint);
          User.setEndpoint(config.firebaseEndpoint);
        });
      },
      appName: function () {
        return config.appName;
      },
      firebaseEndpoint: function () {
        var endpoint = $q.defer();

        if (config) {
          console.log('config already initialized from server');
          endpoint.resolve(config.firebaseEndpoint);
        }
        else {
          console.log('config not yet intialized.  Initializing from server');
          this.init().then(function () {
            // the init() function will have assigned the config variable.
            console.log('config loaded from server!', config);
            endpoint.resolve(config.firebaseEndpoint);
          })
          .catch(function (error) {
            endpoint.reject(error);
          });
        }

        return endpoint.promise;
      },
      val: function () {
        return config;
      }
    }
  };
})();
