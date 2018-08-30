"use strict";
//Requiring all the necessary modules of gulp in order to ultimately construct the webpage.
const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const del = require('del');
const minifyCSS = require('gulp-csso');
const image = require('gulp-image');
const connect = require('gulp-connect');

//Starting off by concatenating the scripts into global.js.
gulp.task('concatScripts', function () {
  return gulp.src(['js/circle/autogrow.js', 'js/circle/circle.js'])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write())
    .pipe(gulp.dest('js'));
});

//Task set up to concatScripts and then minify them into the dist folder.
gulp.task('scripts', ['concatScripts'], function () {
  return gulp.src('js/global.js')
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

//Task set up to delete the css folder when the SASS compile starts.
gulp.task('cleanCSS', function () {
  del.sync('css');
})

//Task set up to delete the Dist/Styles folder for when I minify the CSS file.
gulp.task('cleanStyles', function () {
  del.sync('dist/styles');
})

//Task set up to compile the SASS into CSS.
gulp.task('compileSass', ['cleanCSS'], function () {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write())
    .pipe(gulp.dest('css'));
});

//Task set up to minify the CSS that results from the compiling.
gulp.task('styles', ['compileSass', 'cleanStyles'], function () {
  return gulp.src('css/global.css')
    .pipe(minifyCSS())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(connect.reload());
});

//Task set up to optimize images and pipe them into Dist/Images.
gulp.task('images', function () {
  return gulp.src(['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/f-spore.png', 'images/m-spore.png'])
    .pipe(image())
    .pipe(gulp.dest('dist/content'))
});

//Task set up to delete the entire Dist folder.
gulp.task('clean', function () {
  del.sync('dist');
});

//Task set up to connect to server at port: 3000, enabling live-reload for SCSS changes that are made.
gulp.task('connect', function () {
  connect.server({
    port: 3000,
    livereload: true
  });
});

//Task set up to watch the SASS and SCSS files for any changes and then run the styles task when there are changes.
gulp.task('watch', function () {
  gulp.watch('sass/**/**/*.s*ss', ['styles']);
});

//Task set up to build all other tasks after having deleted the Dist folder.
gulp.task('build', ['clean', 'scripts', 'styles', 'images'], function () {
  return gulp.src(['icons/**'], {base: './'})
    .pipe(gulp.dest('dist'));
});

//Default task set up to connect to server, build the webpage, and watch for any changes.
gulp.task('default', ['build', 'connect', 'watch']);
