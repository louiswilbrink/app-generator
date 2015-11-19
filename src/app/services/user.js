(function () {
'use strict'

angular.module('app.services.user', ['firebase'])
    .service('User', userService);

    userService.$inject = ['$timeout'];

    function userService ($timeout) {

        // Create top-level and users level firebase references.
        var ref = new Firebase('https://wilforge-generator.firebaseio.com/');
        var userRef;
  

        var info = {
            name: null,
            email : null,
            phone : null,
            address : null,
            birthday : null
        };

        return {
            /*
             * param: string
             * return: none
             *
             * notes: this function will query initial values for user info
             * and subscribe to updates/changes in firebase.  During any
             * changes, this service will sync its own user info to the data
             * in firebase.  
             */
            init: function (uid) {
                userRef = ref.child('users').child(uid);

                // Subscribe to user info updates.
                userRef.on('value', function (snapshot) {
                    console.log('user info changed!', snapshot.val());

                    var dbInfo = snapshot.val();
                    
                    info.name = dbInfo.name;
                    info.email = dbInfo.email;
                    info.phone = dbInfo.phone;
                    info.address = dbInfo.address;
                    info.birthday = dbInfo.birthday;
                });
            },
            /*
             * notes: this object will be watched by controllers that display
             * or update user information.  It is a private variable of the
             * service, and will be updated using setter methods, or by 
             * changes made in firebase (by use of subscriptions).
             */
            info: info,
            getName: function () {
                return info.name;
            },
            getEmail: function () {
                return info.email;
            },
            getPhone: function () {
                return info.phone;
            },
            getAddress: function () {
                return info.address;
            },
            getBirthday: function () {
                return info.birthday;
            }
        }
    };
})();
