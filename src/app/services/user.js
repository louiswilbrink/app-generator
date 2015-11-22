(function () {
'use strict'

angular.module('app.services.user', ['firebase'])
    .service('User', userService);

    userService.$inject = ['$timeout', '$q'];

    function userService ($timeout, $q) {

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

                    var dbInfo = snapshot.val();
                    
                    info.name = dbInfo.name;
                    info.email = dbInfo.email;
                    info.phone = dbInfo.phone;
                    info.address = dbInfo.address;
                    info.birthday = new Date('December 17, 1995 03:24:00');
                });
            },
            /*
             * notes: this object will be directly assigned to $scope variables
             * inside Controllers whose corresponding Views require interaction
             * with user info (ie: user profile).
             * 
             * Rule for Controllers:
             * The ViewModel is allowed to change this Service data only 
             * through form interactions.
             */
            info: info,
            saveInfo: function () {
                // Convert any null values into empty string.
                _.forIn(info, function (value, key) {
                    if (!value) {
                        info[key] = '';
                    }
                });

                // Return a promise to wait for update resuls.
                var isUserUpdated = $q.defer();

                userRef.update(info, function () {
                    isUserUpdated.resolve(true);
                });

                return isUserUpdated.promise;
            }
        }
    };
})();
