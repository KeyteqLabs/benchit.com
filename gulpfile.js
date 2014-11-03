var gulp = require('gulp');
var connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        root: 'www',
        fallback: 'www/index.html',
        port: 8081,
        livereload: true
    });
});
