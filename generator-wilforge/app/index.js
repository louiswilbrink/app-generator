var generators = require('yeoman-generator');


module.exports = generators.Base.extend({
    paths: function () {
        console.log('the destination folder is:', this.destinationRoot());
    },
    writing: {
        projectFiles: function () {
            this.spawnCommand('git', ['clone', 'git@github.com:louiswilbrink/app-generator.git', 'louis']);
            this.fs.copyTpl(
                this.templatePath('louis.js'),
                this.destinationPath('louis/config/louis.js')
            );
        },
        serverFiles: function () {
        },
        appFiles: function () {
        },
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
            message: 'What\'s your Firebase endpoint? (ie: ' +
                'wilforge-generator.firebaseio.com)',
            default: 'wilforge-generator.firebaseio.com'
        }];

        this.prompt(prompts, function (answers) {
            this.appName = answers.name;
            this.firebaseEndpoint = answers.firebaseEndpoint;

            done();
        }.bind(this));
    },
    install: function () {
    }
});
