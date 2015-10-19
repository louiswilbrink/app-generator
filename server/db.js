// Dependencies.
var Firebase = require('firebase');
var q        = require('q');
var config   = require('../config/configuration').getConfig();

// Initialize private variables.
var users = {};

var dbRef = new Firebase(config.firebaseEndpoint);

// Configure Firebase references.
var usersRef = new Firebase(config.firebaseEndpoint + '/users');

usersRef.on('value', function (snapshot) {
    users = snapshot.val();
});

var db = {
    addUser: function (uid, email) {
        console.log('db.addUser', uid, email);

        // Add a user.
        // user key is equivalent to uid from user registration.
        usersRef.child(uid).set({
            email: email
        });
    },
    registerUser: function (email, password) {
        console.log('db.registerUser', email, password);

        var uid = q.defer();
        
        // Create user in Firebase.
        dbRef.createUser({
            email: email,
            password: password
        }, function (error, userData) {
            if (error) {
                console.log('dbRef.createUser', 'error', error);
                uid.reject(error);
            }
            else {
                console.log('dbRef.createUser', 'userData', userData);
                uid.resolve(userData.uid);
            }
        });

        return uid.promise;
    },
    getUser: function (id) {
        var user = q.defer();

        usersRef.child(id).once('value', function (snapshot) {
            user.resolve(snapshot.val());
        }, function (error) {
            user.reject(error);
        });

        return user.promise;
    },
    doesUserExist: function (id) {
        // Check if user is in local users object..
        if (users[id]) {
            return true;
        }
        else {
            return false;
        }
    },
    // Returns user Id if successful.
    auth: function (username, password) {
        var id = q.defer();

        dbRef.authWithPassword({
            email: username,
            password: password
        }, function (error, authData) {
            if (!error) {
                id.resolve(authData.uid);
            }
            else {
                id.reject(error); 
            }
        });

        return id.promise;
    }
};

module.exports = db;
