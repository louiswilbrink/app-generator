var express       = require('express');
var session       = require('express-session');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan        = require('morgan');
var q             = require('q');
var Firebase     = require('firebase');

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

var ref = new Firebase(config.firebaseEndpoint);

/*******************************************************
 * AUTHENTICATION / SESSION
 ******************************************************/

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log('employing local strategy:', username, password);

        return db.auth(username, password).then(function (id) {
            return db.getUser(id);
        })
        .then(function (user) {
            console.log('found user:', user);
            return done(null, user);
        })
        .catch(function (error) {
            console.log('catch', error);

            // Check if authentication failed due to invalid credentials.
            // If so, respond with a 401 status code.
            // If authentication failed due to an error in the code or
            // firebase request, then respond with a legit 500 status code.
            if (error.code = 'INVALID_USER') {
                return done(null, false, { message: 'Invalid user' });
            }
            else {
                return done(error);
            }
        });
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

/**
 * @param {String} email 
 * @param {String} password
 * @description
 * This method de-registers the user from firebase authentication.  Call 
 * `db.deleteUser` to update their registration status in the database.
 */
function removeUser (email, password) {

    var isRemoved = q.defer();
    
    // Remove user from Firebase authenticated list.
    ref.removeUser({
      email: email,
      password: password
    }, function(error) {
        // If there is an error, return code with promise.
        // Otherwise return true.
        if (error && error.code === 'INVALID_PASSWORD') {
            console.log('The specified user account password is incorrect.');
            isRemoved.reject(error.code); 
        }
        else {
            console.log('User account deleted successfully!');
            isRemoved.resolve(true);
        }
    });
        
    return isRemoved.promise;
}

function auth (req, res, next) {
  console.log('auth function');

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

router.post('/register-user', function (req, res) {
    console.log('/register-user...');

    console.log('req.body', req.body);

    db.registerUser(req.body.email, req.body.password)
        .then(function (uid) {
            console.log('/register-user success', uid)
            db.addUser(uid, req.body.email);

            // Return uid to client to populate user.
            res.status(200).json({ uid: uid }); 
        })
        .catch(function (error) {
            console.log('/register-user error', error);
            res.status(500).json({ error: error });
        });
});

/**
 * @description 
 * This route handles deleting the user who is currently in the session.
 */
router.post('/delete-user', function (req, res) {

    // Check if this request was made with a user in session.
    if (!req.user || !req.user.email) {
        // Without a user in sesssion, no user delete action will occur.
        res.json({ 
            message: 'No user found in session',
            isDeleted: false
        }).end();
    }
    else {
        // If a user exists in the session, find their uid using the email
        // found in session and set user.status to 'inactive'.
        var uid = db.getUserIdByEmail(req.user.email);

        // Set status to 'inactive'
        db.deleteUser(uid).then(function (isUpdated) {
            if (isUpdated) {
              return removeUser(req.user.email, req.body.password);
            }
            // no else block -- the .catch block will handle any errors during 
            // firebase update.
        })
        .then(function () { // If removeUser() successful, no response needed.

            // Notify the client that 
            res.json({
                message: 'Deleted user successfully',
                deletedUserEmail: req.user.email,
                isDeleted: true
            }).end();
        })
        .catch(function (error) {
            console.log('Error deleting user:', error);
            
            res.json({
                message: error,
                isDeleted: false
            }).end();
        });
    }
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('/login');
    res.end();
});

router.post('/logout', function (req, res) {
    console.log('logging out');

    req.logout();

    res.status(200);
    res.end();
});

/*******************************************************
 * MODULE.EXPORTS
 ******************************************************/

module.exports = router;
