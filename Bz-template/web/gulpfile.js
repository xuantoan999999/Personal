var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    browserSync = require('browser-sync');
var RunSequence = require('run-sequence');

gulp.task('start', function () {
    nodemon({
        script: 'app.js',
        ext: 'js html json css',
        delay: 5,
        ignore: [
            'public/',
            'var/',
            'node_modules/',
            'app/templates/*/html/core/client/**'
        ],
        stdout: true,
        readable: false,
        env: {'NODE_ENV': process.env.NODE_ENV || 'development'}
    });
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        proxy: "http://localhost:9006",
        files: ["public/**/*.*", "app/**/*.*"],
        browser: "chrome",
        port: 3090
    });
});


gulp.task('default', function (cb) {
    return RunSequence(['start', 'browser-sync']);
});