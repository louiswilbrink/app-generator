var express       = require('express');
var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan        = require('morgan');

var db            = require('./db');
var router        = express.Router();

var config        = require('../config/configuration').getConfig();

/*******************************************************
 * CONFIGURATION
 ******************************************************/

router.use(morgan('dev'));

router.use(session({ 
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

/*******************************************************
 * AUTHENTICATION / SESSION
 ******************************************************/

db.getUser('_id')
    .then(function (user) {
        console.log(user);
    });

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('employing local strategy:', username, password);

    db.auth(username, password)
        .then(function (id) {
            db.getUser(id)
                .then(function (user) {
                    console.log('user', user);
                    return done(null, user);
                });
        })
        .catch(function (error) {
            console.log('db.auth error:', error);
            return done(error);
        });

    //return done(null, { username: username, password: password });

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
  done(null, user);
});

function auth (req, res, next) {
    // Passport automatically generates a user object on every request if the 
    // cookie is valid.
    if (req.user) {
        console.log(req.user.email, 'is logged in');
        res.sendStatus(200);
    }
    else {
        console.log('user not logged in');
        res.sendStatus(401);
    }
    next();
}

/*******************************************************
 * ROUTES
 ******************************************************/

router.get('/is-authenticated', auth, function (req, res) {
    console.log('/is-authenticated');
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('/login', 'req.body', req.body);
    res.send('/login received');
});

/*******************************************************
 * MODULE.EXPORTS
 ******************************************************/

module.exports = router;
