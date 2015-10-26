'use strict';

/******************************************************************************
 *  DEPENDENCIES
 *****************************************************************************/

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(); // See package.json for plugins.

var argv = require('yargs').argv;
var fs = require('fs');
var util = require('util');

/******************************************************************************
 *  METHODS
 *****************************************************************************/

/******************************************************************************
 *  GULP TASKS
 *****************************************************************************/

/* 
 * This task will compile the application .scss files into .css files and 
 * save them in the `src/app/styles/` folder.  Note that each component 
 * contains its own .scss file.  
 */
gulp.task('sass', function () {
    return gulp.src([
        'src/app/styles/scss/*.scss',
        'src/app/components/**/*.scss'
    ])
    .pipe(plugins.sass())
    .pipe(gulp.dest('src/app/styles/css'));
});

gulp.task('serve', ['sass'], function () {
    var server = plugins.liveServer.new('start.js');

    // Recompile to CSS when Sass files change.
    gulp.watch(['src/app/styles/scss/*.scss', 
        'src/app/components/**/*.scss'], ['sass']);

    // Restart webserver when server code changes.                                
    gulp.watch(['start.js', 'server/*.js', 'server/controllers/*.js'], 
        function () {
        server.stop();
        server.start();
    });

    return server.start();
});

/*
 * This task will inform new developers which tasks are available to them
 */
gulp.task('default', function () {
    plugins.util.log('use `gulp serve` to start application, or `gulp build`' +
        ' to build production files.  `gulp sass` will compile your scss' + 
        'and add them to /src/app/styles/css.');
});
