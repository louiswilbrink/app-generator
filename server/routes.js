var express       = require('express');
var morgan        = require('morgan');
var router        = express.Router();
var config        = require('../config/configuration').getConfig();

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

/*******************************************************
 * SERVE INDEX.HTML
 ******************************************************/

router.all('/', function(req, res) {
    console.log('sending index.html');
    res.sendFile('index.html', { 
        root: config.rootDir + '/src/'
    });
});

module.exports = router;
