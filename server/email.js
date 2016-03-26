var express         = require('express');
var morgan          = require('morgan');
var router          = express.Router();
var config          = require('../config/configuration').getConfig();
var db              = require('./db');
var q               = require('q');
var sendgrid        = require('sendgrid')(config.sendgridApiKey);

/******************************************************************************
 * CONFIGURATION
 *****************************************************************************/

router.use(morgan('dev'));

/******************************************************************************
* METHODS
******************************************************************************/

function sendConfirmationEmail (email) {
    var userId = db.getUserIdByEmail(email);

    return db.getConfirmationId(userId).then(function (confirmationId) {

        var isMessageSent = q.defer();

        var sgEmail = new sendgrid.Email();

        var html = '<h1 style="text-align: center">Email Confirmation</h1>' +
                   '<p>Please confirm your email by clicking ' +
                   '<a href="http://' + config.domain + ':' + config.port +
                   '/confirm-email/' + confirmationId + '/' + email +
                   '">confirm.</a></p>';

        sgEmail.addTo(email);
        sgEmail.setFrom(config.infoEmailAddress);
        sgEmail.setSubject(config.appName + ' Email Confirmation');
        sgEmail.setHtml(html);

        sendgrid.send(sgEmail, function (error, json) {
          if (error) {
            console.log('Error sending confirmation email:', error);
            isMessageSent.reject(error);
          }
          else {
            console.log('Confirmation email sent:', json);
            isMessageSent.resolve(true);
          }
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

    // Check if valid, existent userId.
    if (!userId) {
        console.log('No userId found for that email');
        res.status(401).end();
        return;
    }

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
            // Update confirmed status in db.
            return db.updateIsEmailConfirmed(userId, true);
        }
        else {
            console.log('Email address NOT confirmed. (' + email + ')');
            res.status(401).end(); // The confirmation number didnt match.
        }
    })
    .then(function (isUpdated) {
        console.log('[sent] email-confirmed.html');
        // If db update successful, send the confirmation web page.
        res.sendFile('email-confirmed.html', { 
            root: config.rootDir + '/server/views/'
        });
    })
    .catch(function (error) {
        // If error saving confirmation update status, send 500 
        // response.
        console.log('Error updating user.isEmailConfirmed:', email, error);
        res.status(500);
        res.sendFile('email-confirmed-error.html', {
            root: config.rootDir + '/server/views/'
        });
    });

});

router.post('/send-confirmation-email', function (req ,res) {
    console.log('/send-confirmation-email', req.body);

    sendConfirmationEmail(req.body.email).then(function (isMessageSent) {
        if (isMessageSent) {
            console.log('[sent] confirmation email');
            res.status(200).end();
        }
        else {
            res.status(401).end(); 
        }
    });
});

/******************************************************************************
* MODULE.EXPORTS
******************************************************************************/

module.exports = router;
