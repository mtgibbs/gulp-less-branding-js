var gulp = require('gulp');
var brandingToJS = require('../');

gulp.task('brandingToJS', function(){
  gulp.src('./_branding.less')
  .pipe(brandingToJS())
  .pipe(gulp.dest('build'));
});

gulp.task('default', ['brandingToJS']);
