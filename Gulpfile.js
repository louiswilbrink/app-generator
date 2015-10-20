'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')(); // See package.json for plugins.
var argv = require('yargs').argv;
var fs = require('fs');
var util = require('util');

// Starts the node application
function start () {
    return gulp.src('')
        .pipe(plugins.shell(['node start.js']));
}

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

gulp.task('start', function () {
    return start();
});

gulp.task('default', function () {
    plugins.util.log('doing a whole lot of nuthin');
});
