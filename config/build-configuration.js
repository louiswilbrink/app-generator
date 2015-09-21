// TODO: replace multple forEach loops with _.extend()
/******************************************************************************
 *
 * Author: Louis Wilbrink
 * Date: September 21, 2015
 *
 * return: config (Object)
 * 
 * Notes: This script will import app/server configuration values from 
 * configure.js.  It is expected that the configuration.js file will be in the
 * same folder as this script (rootDir/config/).
 *
 * This script will return a 'config' object that contains all of the
 * application/server configuration values necessary for operation.  This
 * script will combine both application and server configuration values into
 * a single object, making sure that there are no duplicates found in both
 * application and server objects.
 *
 * There are 'base' configuration values that can be overridden by environment-
 * specific configuration values.  For example, if there is a 'base' configur-
 * ation property named 'INFO_EMAIL_ADDRESS' and the same property is defined
 * in the 'staging' object, then the value for staging['INFO_EMAIL_ADDRESS'] 
 * will be used when the staging environment is specified.  Ultimately, the 
 * final configuration object is used throughout the application, but populat-
 * ing this object will be based on environment.
 *
 * The environment is detected by checking environment variables of the server.
 * The default is 'dev'.
 *
 *****************************************************************************/
 
var _             = require('lodash');
var configuration = require('./configuration');

var config = {};

function getConfigTypes () {
    
    var configTypes = [];

    // Configuration object keys are types.  Collect them for iteration at 
    // a later time.
    _.forEach(configuration, function (value, key) {
        configTypes.push(key);
    });

    return configTypes;
}

function getEnvironments (type) {
    var environments = [];

    _.forEach(configuration[type], function (value, key) {
        environments.push(key);
    });

    return environments;
}

/******************************************************************************
 *
 * param: configuration (Object)
 * return: hasDuplicates (Boolean)
 *
 * Notes: Check to see if there are duplicate values across configuration 
 * types (app, server).  See 'Rules' in configuration.js.
 *
 *****************************************************************************/
function checkForDuplicates () {

    console.log('Checking configuration..');

    var configChecker = {};
    
    // Iterate over each configuration type and environments and create an 
    // object that stores ({ 'key': 'type' }).  If a key is found with 
    // two different types, warn the developer and exit the program.
    _.forEach(getConfigTypes(), function (type) {

        var environments = getEnvironments(type);

        _.forEach(environments, function (environment) {
            
            _.forEach(configuration[type][environment], 
                function (value, key) {

                if (configChecker[key] && configChecker[key] !== type) {
                    console.error('ERR: duplicate configuration values found',
                        key);

                    process.exit();
                }
                else {
                    configChecker[key] = type;
                }
            });
        });
    });

    console.log('Configuration looks good!  Loading...');

    // If the program hasn't exited (due to duplicates), return true.
    return true;
}

/******************************************************************************
 *
 * param: none
 * return: finalConfig (Object)
 *
 * Notes: this function will first combine all 'base' configuration values for
 * both the application and server.  Then environment-specific configuration 
 * values will be added.  Environment-specific values will override 'base'
 * configuration values.
 *
 *****************************************************************************/
function build () {
    
    checkForDuplicates();

    var environment = process.env.ENV || 'dev';

    console.log('Operating environment:', environment);

    var configTypes = getConfigTypes();
    var finalConfig = {};

    // Iterate over each configuration type object, combining all 'base' 
    // configuration values.
    _.forEach(configTypes, function (type) {

        // Add base application/server configuration.
        _.forEach(configuration[type].base, function (value, key) {

            // Convert key to camelCase.
            var camelKey = _.camelCase(key);

            // Add the configuration property to the final configuration
            // object.
            finalConfig[camelKey] = value;
        });
    });

    // Iterate over configuration types, this time adding enviroment-specific
    // configuration values.  Override 'base' configuration values.
    _.forEach(configTypes, function (type) {

        // Add environment-specific configuration values.
        _.forEach(configuration[type][environment], 
            function (value, key) {

            // Convert key to camelCase.
            var camelKey = _.camelCase(key);

            // Add the configuration property to the final configuration
            // object.
            finalConfig[camelKey] = value;
        });
    });

    return finalConfig;
}

module.exports = build();
