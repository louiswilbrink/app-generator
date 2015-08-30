var express       = require('express');
var cookieParser  = require('cookie-parser');
var bodyParser    = require('body-parser');
var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
app.use(authRoutes);
app.use(emailRoutes);
app.use(appRoutes);

/*******************************************************
 * START WEBSERVER
 ******************************************************/

app.listen(8080);
console.log('Listening on 8080');
