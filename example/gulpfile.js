var gulp = require('gulp');
var brandingToJS = require('../');

gulp.task('brandingToJS', function () {
    gulp.src('./_branding.less')
        .pipe(brandingToJS())
        .pipe(gulp.dest('build'));
});

gulp.task('brandingToTS', function () {
    gulp.src('./_branding.less')
        .pipe(brandingToJS({format: 'ts'}))
        .pipe(gulp.dest('build'));
});

gulp.task('brandingToCoffee', function() {
    gulp.src('./_branding.less')
        .pipe(brandingToJS({format: 'coffee'}))
        .pipe(gulp.dest('build'));
});

gulp.task('default', ['brandingToJS', 'brandingToTS', 'brandingToCoffee']);
