// Dependencies.
var Firebase     = require('firebase');
var q            = require('q');
var _            = require('lodash');
var randomString = require('randomstring');
var config       = require('../config/configuration').getConfig();

// Initialize private variables.
var users = {};

var dbRef = new Firebase(config.firebaseEndpoint);

// Configure Firebase references.
var usersRef = new Firebase(config.firebaseEndpoint + '/users');

// Get updates on usersRef.

var db = {
    init: function () {
        return usersRef.on('value', function (snapshot) {
            users = snapshot.val();
        });
    },
    // Adding user information to db.
    addUser: function (uid, email) {
        console.log('db.addUser', uid, email);

        // Add a user.
        // user key is equivalent to uid from user registration.
        usersRef.child(uid).set({
            email: email,
            confirmationId: randomString.generate(10),
            isEmailConfirmed: false
        });
    },
    // Registering user with firebase authentication system.
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
    getUser: function (uid) {
        var user = q.defer();

        usersRef.child(uid).once('value', function (snapshot) {
            user.resolve(snapshot.val());
        }, function (error) {
            user.reject(error);
        });

        return user.promise;
    },
    getConfirmationId: function (uid) {
        var confirmationId = q.defer();

        usersRef.child(uid).once('value', function (snapshot) {
            confirmationId.resolve(snapshot.val().confirmationId);
        }, function (error) {
            confirmationId.reject(error);
        });

        return confirmationId.promise;
    },
    updateIsEmailConfirmed: function (uid, isEmailConfirmed) {
        usersRef.child(uid).update({
            isEmailConfirmed: isEmailConfirmed
        }, function (error) {
            if (!error) {
                console.log('update successful (user.isEmailConfirmed)');
            }
            else {
                console.log('Error updating isEmailConfirmed:', error);
            }
        });
    },
    isCorrectConfirmationId: function (uid, confirmationIdComp) {
        var isCorrect = q.defer();

        this.getConfirmationId(uid).then(function (confirmationId) {
            if (confirmationId ===  confirmationIdComp) {
                isCorrect.resolve(true);
            }
            else {
                isCorrect.resolve(false);
            }
        });

        return isCorrect.promise;
    },
    confirmUserEmail: function (id) {
        usersRef.child(id).update({
            isEmailConfirmed: true
        });
    },
    getUserIdByEmail: function (email) {
        var id;

        // Search users list and check each email.
        _.forEach(users, function (user, key) {
            if (user.email === email) {
                id = key; // Save key as id.
                return;   // Break out of loop.
            }
        });

        return id;
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
