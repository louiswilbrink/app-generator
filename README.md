#App Generator

This is an ongoing project and not yet ready for primetime.

This is a full-stack generator to scaffold basic operations of a web app:  User Management, Sessions, Email, Routes, and a database.  For User Management, the client authenticates with the server using PassportJS, which checks a user list saved in Firebase.  At the same time, the client authenticates with Firebase.  A login screen and dashboard are default angular routes.  The server maintains routes for serving index.html and static files, along with email controller routes and authentication endpoints.

The application requires a `configuration.js` file that will contain environment variables and platform credentials.  It should never be checked into the repo (I will upload a dummy configuration file soon to see the necessary inputs).  For example, the firebase endpoint that will be used for the application will be listed in the configuration file, and the application will use that endpoint to save data and manage users.  This generator uses SendGrid for emailing, so your SendGrid credentials will also be part of `configuration.js`.

##Architecture:

###Backend:
* Node/Express
* PassportJS
* Firebase

###Frontend:

* Angular, Material Design

