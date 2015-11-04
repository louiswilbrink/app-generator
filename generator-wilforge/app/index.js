var generators = require('yeoman-generator');


module.exports = generators.Base.extend({
    paths: function () {
        console.log('the destination folder is:', this.destinationRoot());
    },
    writing: function () {
        this.fs.copyTpl(
            this.templatePath('test.html'),
            this.destinationPath('public/test.html');
        );
    },
    prompting: function () {
        var done = this.async();

        var prompts = [{
            type: 'input',
            name: 'name',
            message: 'What\'s the name of your project? ',
            default: 'myApp'
        }, {
            type: 'input',
            name: 'firebaseEndpoint',
            message: 'This generator uses Firebase.  Once you\'ve created a ' +
                'Firebase account, create a new app and enter the endpoint '  +
                'here: (ie: wilforge-generator.firebaseio.com)',
            default: 'wilforge-generator.firebaseio.com'
        }];
        
        this.prompt(prompts, function (answers) {
            this.appName = answers.name;
            this.firebaseEndpoint = answers.firebaseEndpoint;

            done();
        }.bind(this));
    }
});
