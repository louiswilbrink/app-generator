var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var argv          = require('yargs').argv;
var morgan        = require('morgan');
var async         = require('async');

var app           = express();
var authRoutes    = require('./server/authentication');
var emailRoutes   = require('./server/email');
var appRoutes     = require('./server/routes');
var db            = require('./server/db');

var config        = require('./config/configuration').getConfig();

/******************************************************************************
 * CONFIGURATION
 *****************************************************************************/

app.use(express.static(config.rootDir + '/src/app'));

app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(authRoutes);
app.use(emailRoutes);
app.use(appRoutes);

// Initialize server scripts.
//async.parallel([db.init], function (error, result) {
    //console.log('async.parallel');

    //if (error) {
        //return console.log('async error:', error);
    //}

    //console.log('async result', result);
//});

// Script initializations
db.init().then(function (response) {
    console.log('db initialized', response);
});

/******************************************************************************
 * START WEBSERVER
 *****************************************************************************/

app.listen(config.port);
console.log('Listening on ' + config.port);
