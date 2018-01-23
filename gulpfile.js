var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify')

gulp.task('css', function() {
    gulp.src(['./node_modules/bootstrap/dist/css/bootstrap.css', './src/css/index.css'])
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./src/bundle'))
})

gulp.task('js', function() {
    gulp.src(['./node_modules/vue/dist/vue.js', './node_modules/axios/dist/axios.js', './node_modules/blueimp-md5/js/md5.js', './src/js/index.js'])
        // .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/bundle'))
})

gulp.task('default', ['css', 'js'])
