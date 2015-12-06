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

// Called whenever a user is added or removed.
function getUsers () {
    var gotUsers = q.defer();

    usersRef.once('value', function (snapshot) {
        users = snapshot.val();
        console.log('updated users (' + Object.keys(users).length + ')');
        gotUsers.resolve();
    })

    return gotUsers.promise;
}

function auth (username, password) {
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

var db = {
    init: function () {
        return auth('server@imaginapp.com', 'louis').then(function (uid) {
            var isUsersLoaded = q.defer();

            // Initializing users object on server for lookups.
            usersRef.once('value', function (snapshot) {
                users = snapshot.val();

                console.log('init users (' + Object.keys(users).length + ')');

                isUsersLoaded.resolve(uid);
            });

            return isUsersLoaded.promise;
        })
        .catch(function (error) {
            console.log('Error: db.init', error);    
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
            birthday: 'January 1, 1970 00:00:00',
            isEmailConfirmed: false,
            status: 'active' // or 'delete'
        }, function (error) {
            if (!error) {
                getUsers();
            }
            else {
                console.log('Error adding new user');
            }
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
            console.log('Error retrieving user confirmation id:', error);
            confirmationId.reject(error);
        });

        return confirmationId.promise;
    },
    /**
     * @param {String} uid User id
     * @description
     * This method sets user.status to 'inactive'.  Call 
     * `authentication.removeUser` method to de-register user from firebase.
     */ 
    deleteUser: function (uid) {
        console.log('db.deleteUser');
        var isUpdated = q.defer();

        // Set user.stats to 'inactive' (don't actually delete the user info).
        usersRef.child(uid).update({
            status: 'inactive'
        }, function (error) {
            if (error) {
                isUpdated.reject(error);
            }
            else {
                getUsers().then(function () {
                    isUpdated.resolve(true);
                });
            }
        });

        return isUpdated.promise;
    },
    updateIsEmailConfirmed: function (uid, isEmailConfirmed) {
        var isUpdated = q.defer();

        usersRef.child(uid).update({
            isEmailConfirmed: isEmailConfirmed
        }, function (error) {
            if (error) {
                isUpdated.reject(error);
            }
            else {
                isUpdated.resolve(true);
            }
        });

        return isUpdated.promise;
    },
    isCorrectConfirmationId: function (uid, confirmationIdComp) {
        var isCorrect = q.defer();

        this.getConfirmationId(uid).then(function (confirmationId) {
            if (confirmationId === confirmationIdComp) {
                isCorrect.resolve(true);
            }
            else {
                isCorrect.reject();
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
    // Returns user id if successful.
    auth: auth
};

module.exports = db;
