var express       = require('express');
var morgan        = require('morgan');
var serverConfig  = require('./configuration');
var router        = express.Router();

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

/*******************************************************
 * MODULE.EXPORTS
 ******************************************************/

module.exports = router;
