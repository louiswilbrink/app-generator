(function () {
'use strict'

angular.module('app.services.user', ['firebase'])
    .service('User', userService);

    userService.$inject = ['$timeout'];

    function userService ($timeout) {

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
            init: function (uid) {
                userRef = ref.child('users').child(uid);

                userRef.once('value', function (snapshot) {
                    var dbInfo = snapshot.val();
                    
                    info.name = dbInfo.name;
                    info.email = dbInfo.email;
                    info.phone = dbInfo.phone;
                    info.address = dbInfo.address;
                    info.birthday = dbInfo.birthday;
                });
            },
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
