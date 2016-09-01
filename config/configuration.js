var path = require('path');
var _ = require('lodash');
module.exports = {
  getConfig: function () {
    var environment = process.env.ENV || 'dev';
    var configuration = this[environment];
    var configuration = _.mapKeys(configuration, function (value, key) {
        return _.camelCase(key);
    });
    return configuration;
  },
  dev: {
    'ROOT_DIR': path.normalize(__dirname + '/../'),
    'APP_NAME': 'APP_NAME',
    'FIREBASE_ENDPOINT': 'https://app-name.firebaseio.com',
    'SENDGRID_API_KEY': 'SENDGRID_API_KEY',
    'SERVER_EMAIL': 'info@appname.com',
    'SERVER_PASSWORD': 'serverPassword',
    'INFO_EMAIL_ADDRESS': 'info@appname.com',
    'ENV': 'development',
    'DOMAIN': 'appname',
    'PORT': '8080',
    'SESSION_SECRET': 'sessionSecret'
  },
  staging: {
    'ROOT_DIR': path.normalize(__dirname + '/../'),
    'APP_NAME': 'APP_NAME',
    'FIREBASE_ENDPOINT': 'https://app-name.firebaseio.com',
    'SENDGRID_API_KEY': 'SENDGRID_API_KEY',
    'SERVER_EMAIL': 'info@appname.com',
    'SERVER_PASSWORD': 'serverPassword',
    'INFO_EMAIL_ADDRESS': 'info@appname.com',
    'ENV': 'staging',
    'DOMAIN': 'appname',
    'PORT': '80',
    'SESSION_SECRET': 'sessionSecret'
  },
  production: {
    'ROOT_DIR': path.normalize(__dirname + '/../'),
    'APP_NAME': 'APP_NAME',
    'FIREBASE_ENDPOINT': 'https://app-name.firebaseio.com',
    'SENDGRID_API_KEY': 'SENDGRID_API_KEY',
    'SERVER_EMAIL': 'info@appname.com',
    'SERVER_PASSWORD': 'serverPassword',
    'INFO_EMAIL_ADDRESS': 'info@appname.com',
    'ENV': 'production',
    'DOMAIN': 'appname',
    'PORT': '443',
    'SESSION_SECRET': 'sessionSecret'
  }
};
