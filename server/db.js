// Dependencies.
var Firebase = require('firebase');
var q        = require('q');

// Initialize private variables.
var users = {};

// Configure Firebase references.
var usersRef = new Firebase('https://wilforge-generator.firebaseio.com/users');

usersRef.on('value', function (snapshot) {
    users = snapshot.val();
});

var db = {
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
    }
};

module.exports = db;
