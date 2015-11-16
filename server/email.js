var express         = require('express');
var morgan          = require('morgan');
var mandrillPackage = require('mandrill-api/mandrill');
var router          = express.Router();
var config          = require('../config/configuration').getConfig();
var db              = require('./db');
var q               = require('q');

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

    return db.getConfirmationId(userId).then(function (confirmationId) {

        var message = {
           'html': '<h1 style="text-align: center">Example HTML content</h1>' +
                    '<p>Please confirm your email by clicking ' +
                    '<a href="http://' + config.domain + ':' + config.port +
                    '/confirm-email/' + confirmationId + '/' + email +
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

        var isMessageSent = q.defer();

        mandrill.messages.send({ 
            'message': message, 
            'async': false
        }, function (result) {
            console.log('email success:', result);
            isMessageSent.resolve(true);
        }, function (error) {
            // Mandrill returns the error as an object with name and message keys
            console.log('A mandrill error occurred: ' + 
                error.name + ' - ' + 
                error.message);
            isMessageSent.reject(error);
        });

        return isMessageSent.promise;
    });
}

/******************************************************************************
* ROUTES
******************************************************************************/

router.get('/confirm-email/:confirmationId/:email', function (req, res) {
    console.log('/confirm-email/:confirmationId/:email: ', req.params);

    // Grab route parameters.
    var confirmationId = req.params.confirmationId;
    var email = req.params.email;
    var userId = db.getUserIdByEmail(email);

    // Check for parameter values, abort if missing.
    if (!confirmationId || !email) {
        console.log('Error: cannot confirm email, missing confirmation ' +
            'id or email');

        res.status(401).end();
        return;
    }

    // Check confirmation number
    db.isCorrectConfirmationId(userId, confirmationId)
        .then(function (isCorrectConfirmationId) {

        // Generate server response.  
        if (isCorrectConfirmationId) {
            console.log('confirmation Ids match!');

            // Update confirmed status in db.
            db.updateIsEmailConfirmed(userId, true); 

            res.status(200).end();
        }
        else {
            console.log('confirmation Ids do not match!');
            res.status(401).end(); // The confirmation number didnt match.
        }

        });
});

router.post('/send-confirmation-email', function (req ,res) {
    console.log('/send-confirmation-email', req.body);

    sendConfirmationEmail(req.body.email).then(function (isMessageSent) {
        if (isMessageSent) {
            console.log('sent email successfully');
            res.status(200).end();
        }
        else {
            res.status(401).end(); // TODO: add error message
        }
    });
});

/******************************************************************************
* MODULE.EXPORTS
******************************************************************************/

module.exports = router;
