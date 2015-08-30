var express       = require('express');
var morgan        = require('morgan');
var serverConfig  = require('./configuration');
var router        = express.Router();

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

/*******************************************************
 * SERVE INDEX.HTML
 ******************************************************/

router.all('/', function(req, res) {
    res.sendFile('index.html', { 
        root: serverConfig.rootDir + '/src/'
    });
});

module.exports = router;
