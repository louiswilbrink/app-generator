#App Generator

This is a full-stack generator to scaffold basic operations of a web app:  User Management, Sessions, Email, Routes, and a database.  For User Management, the client authenticates with the server using PassportJS, which checks a user list saved in Firebase.  At the same time, the client authenticates with Firebase.  A login screen and dashboard are default angular routes.  The server maintains routes for serving index.html and static files, along with email controller routes and authentication endpoints.

The application requires a `configuration.js` file that will contain environment variables and platform credentials.  It should never be checked into the repo (I will upload a dummy configuration file soon to see the necessary inputs).  For example, the firebase endpoint that will be used for the application will be listed in the configuration file, and the application will use that endpoint to save data and manage users.  This generator uses SendGrid for emailing, so your SendGrid credentials will also be part of `configuration.js`.

### Local Development

Install Node and npm, then:

1. Clone the repository: `git clone https://github.com/adam-p/markdown-here.wiki.git`
2. `$ npm install`
3. `$ bower install`
4. `$ gulp serve`
5. Load `localhost:8080`

### Gulp Tasks

- `gulp serve`
  - Runs the application.
  - Checks for valid endpoints.
  - Reloads the server on server file changes.
  - Compiles `sass` files and converts to CSS.
- `gulp sass`
  - Compiles `sass` files.

### Backend:
* Node/Express
* PassportJS
* Firebase
* Sendgrid

### Coming Soon to Backend:
* Twilio
* Plaid

### Frontend:

* Angular, Material Design

