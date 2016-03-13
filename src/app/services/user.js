(function () {
'use strict'

angular.module('app.services.user', ['firebase'])
    .service('User', userService);

    userService.$inject = ['$timeout', '$q', 'Config'];

    function userService ($timeout, $q, Config) {
        console.log('userService');

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
            ref: function () {
              console.log('user.ref');
              console.log('Config.firebaseEndpoint()', Config.firebaseEndpoint());

              return Config.firebaseEndpoint();
            },
            init: function (uid) {
                userRef = this.ref().child('users').child(uid);

                // Subscribe to user info updates.
                userRef.on('value', function (snapshot) {

                    var dbInfo = snapshot.val();
                    
                    info.name = dbInfo.name;
                    info.email = dbInfo.email;
                    info.phone = dbInfo.phone;
                    info.address = dbInfo.address;
                    info.birthday = new Date(dbInfo.birthday);
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
