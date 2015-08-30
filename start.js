var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var argv          = require('yargs').argv;
var morgan        = require('morgan');

var app           = express();
var serverConfig  = require('./server/configuration').set('rootDir', __dirname);
var authRoutes    = require('./server/authentication');
var emailRoutes   = require('./server/email');
var appRoutes     = require('./server/routes');

/*******************************************************
 * CONFIGURATION
 ******************************************************/

app.use(express.static(serverConfig.rootDir + '/src/app'));

app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(authRoutes);
app.use(emailRoutes);
app.use(appRoutes);

/*******************************************************
 * START WEBSERVER
 ******************************************************/

app.listen(8080);
console.log('Listening on 8080');
