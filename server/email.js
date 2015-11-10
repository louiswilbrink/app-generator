var express         = require('express');
var morgan          = require('morgan');
var mandrillPackage = require('mandrill-api/mandrill');
var router          = express.Router();
var config          = require('../config/configuration').getConfig();

/******************************************************************************
 * CONFIGURATION
 *****************************************************************************/

router.use(morgan('dev'));

// Attach mandrill api key.
var mandrill        = new mandrillPackage.Mandrill(config.mandrillApiKey);

/******************************************************************************
* METHODS
******************************************************************************/

function sendConfirmationEmail (email) {
    var message = {
        'html': '<p>Example HTML content</p>',
        'text': 'Example text content',
        'subject': 'example subject',
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

router.post('/send-confirmation-email', function (req ,res) {
    console.log('/send-confirmation-email', req.body);

    sendConfirmationEmail(req.body.email);

    res.status(200);
    res.end();
});

/******************************************************************************
* MODULE.EXPORTS
******************************************************************************/

module.exports = router;
