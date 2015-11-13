var express         = require('express');
var morgan          = require('morgan');
var mandrillPackage = require('mandrill-api/mandrill');
var randomString    = require('randomstring');
var router          = express.Router();
var config          = require('../config/configuration').getConfig();
var db              = require('./db');

/******************************************************************************
 * CONFIGURATION
 *****************************************************************************/

router.use(morgan('dev'));

// Attach mandrill api key.
var mandrill = new mandrillPackage.Mandrill(config.mandrillApiKey);

/******************************************************************************
* METHODS
******************************************************************************/

function sendConfirmationEmail (email) {
    var userId = db.getUserIdByEmail(email);
    var confirmationNumber = randomString.generate(10);

    db.updateConfirmationNumber(userId, confirmationNumber);

    var message = {
        'html': '<h1 style="text-align: center">Example HTML content</h1>' +
                '<p>Please confirm your email by clicking ' +
                '<a href="http://' + config.domain + ':' + config.port +
                '/confirm-email/' + confirmationNumber + '/' + email +
                '">confirm.</a></p>',
        'text': 'Confirmation Email',
        'subject': 'App Name - Email Confirmation',
        'from_email': 'generator@wilforge.com',
        'from_name': 'Generator Wilforge',
        'to': [{
            'email': email,
            'name': 'New User',
            'type': 'to'
         }]
    };

    return mandrill.messages.send({ 
        'message': message, 
        'async': false
    }, function(result) {
        console.log('email success:', result);
    }, function(error) {
        // Mandrill returns the error as an object with name and message keys
        console.log('A mandrill error occurred: ' + 
            error.name + ' - ' + 
            error.message);
    });
}

/******************************************************************************
* ROUTES
******************************************************************************/

router.get('/confirm-email', function (req, res) {
    console.log('/confirm-email');
    res.status(200).end();
});

router.post('/send-confirmation-email', function (req ,res) {
    console.log('/send-confirmation-email', req.body);

    sendConfirmationEmail(req.body.email);
    res.status(200).end();
});

/******************************************************************************
* MODULE.EXPORTS
******************************************************************************/

module.exports = router;
