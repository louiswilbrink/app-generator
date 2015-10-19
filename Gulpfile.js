'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var argv = require('yargs').argv;
var fs = require('fs');

function start () {
    return gulp.src('')
        .pipe(plugins.shell(['node start.js']));
}

gulp.task('start', function () {
    return start();
});

gulp.task('default', function () {
    plugins.util.log('doing a whole lot of nuthin');
});
