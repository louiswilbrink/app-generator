// Dependencies.
var Firebase = require('firebase');
var q        = require('q');

// Initialize private variables.
var users = {};

var dbRef = new Firebase('https://wilforge-generator.firebaseio.com');

// Configure Firebase references.
var usersRef = new Firebase('https://wilforge-generator.firebaseio.com/users');

usersRef.on('value', function (snapshot) {
    users = snapshot.val();
});

var db = {
    registerUser: function (email, password) {

    },
    getUser: function (id) {
        var user = q.defer();

        usersRef.child(id).once('value', function (snapshot) {
            user.resolve(snapshot.val());
        }, function (error) {
            user.reject(new Error(error));
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
                id.reject(new Error(error));
            }
        });

        return id.promise;
    }
};

module.exports = db;
