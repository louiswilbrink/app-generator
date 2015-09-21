var express       = require('express');
var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan        = require('morgan');

var db            = require('./db');
var serverConfig  = require('./configuration');
var router        = express.Router();
var config        = require('../config/build-configuration');

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

router.use(session({ 
    secret: 'autonomous moon explore vehicle',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

/*******************************************************
 * AUTHENTICATION / SESSION
 * ****************************************************/

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('employing local strategy:', username, password);
    return done(null, { username: username, password: password });
    //User.findOne({ username: username }, function (err, user) {
        //console.log('User.findOne results:', err, user);
        //if (err) {
            //return done(err);
        //}

        //if (!user) {
            //return done(null, false, { message: 'Incorrect username' });
        //}

        //if (user.password !== password) {
            //return done(null, false, { message: 'Incorrect password' });
        //}

        //return done(null, user);
    //});
  }
));

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser', user);
  //User.findById(_id, function(err, user) {
    //done(err, user);
  //});
});

function auth (req, res, next) {
    // Passport automatically generates a user object on every request if the cookie is valid.
    if (req.user) {
        console.log(req.user.username, 'is logged in');
        next();
    }
    else {
        console.log('user not logged in');
        res.sendStatus(401);
    }
}

/*******************************************************
 * ROUTES
 ******************************************************/

router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('/login', 'req.body', req.body);
    res.send('/login received');
});

/*******************************************************
 * MODULE.EXPORTS
 ******************************************************/

module.exports = router;
