var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', function () {
    return gulp.src('public/index.html')
        .pipe(vulcanize({
            abspath: '',
            excludes: [],
            stripExcludes: false
        }))
        .pipe(gulp.dest('dest'));
});