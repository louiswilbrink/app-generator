var express       = require('express');
var morgan        = require('morgan');
var router        = express.Router();
var config        = require('../config/configuration').getConfig();

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

/*******************************************************
 * ROUTES
 ******************************************************/

/*
 * Notes:
 * Once the client is loaded, the application will require configuration values
 * found in `server/configuration.js`.  The client will request these values
 * using the `/app-configuration` route, receiving a JSON object containing
 * the configuration values.
 * Important: only client-specific values will be sent; not all configuration
 * values should be sent to the client, especially platform keys or session
 * secret value.
 *
 * If more configuration values need to be sent to the client, add them to the
 * response object and add some null-checking.
 */
router.get('/app-configuration', function (req, res) {
    console.log('/app-configuration');

    if (!config.appName) {
        res.status(500).json({
            message: 'No application name specified'
        });
    }
    else {
        // Add more configuration values to this object to access them on the
        // client.
        res.status(200).json({
            appName: config.appName,
            firebaseEndpoint: config.firebaseEndpoint
        });
    }

    res.end();
});

/*******************************************************
 * SERVE INDEX.HTML
 ******************************************************/

router.all('/', function(req, res) {
    console.log('[send] index.html');
    res.sendFile('index.html', { 
        root: config.rootDir + '/src/'
    });
});

module.exports = router;
