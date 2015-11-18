(function () {
'use strict'

angular.module('app.services.user', ['firebase'])
    .service('User', userService);

    userService.$inject = [];

    var name = 'louis', 
        email = 'lw@lw.com',
        phone = '555-1234', 
        address = '123 Fake Street', 
        birthday = new Date();

    function userService () {
        return {
            getName: function () {
                return name;
            },
            getEmail: function () {
                return email;
            },
            getPhone: function () {
                return phone;
            },
            getAddress: function () {
                return address;
            },
            getBirthday: function () {
                return birthday;
            }
        }
    };
})();
