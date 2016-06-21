"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var browserSync = require("browser-sync");
var pngquant = require('imagemin-pngquant');
var cleanss = require('gulp-cleancss');
var mqpacker = require('css-mqpacker');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var del = require('del');
var newer = require('gulp-newer');

// gulp.task("style", function() {
//   gulp.src("less/style.less")
//     .pipe(plumber())
//     .pipe(less())
//     .pipe(postcss([
//       autoprefixer({browsers: [
//         "last 1 version",
//         "last 2 Chrome versions",
//         "last 2 Firefox versions",
//         "last 2 Opera versions",
//         "last 2 Edge versions"
//       ]})
//     ]))
//     .pipe(gulp.dest("css"))
//     .pipe(server.reload({stream: true}));
// });

// gulp.task("serve", ["style"], function() {
//   server.init({
//     server: ".",
//     notify: false,
//     open: true,
//     ui: false
//   });

//   gulp.watch("less/**/*.less", ["style"]);
//   gulp.watch("*.html").on("change", server.reload);
// });

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build'))
    .pipe(browserSync.stream());
});

gulp.task('less', function () {
  return gulp.src('src/less/style.less')
    .pipe(less())
    .pipe(postcss([
        autoprefixer({browsers: ['last 2 version']})
        // mqpacker
    ]))
    .pipe(cleanss())
    .pipe(rename('style.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('img', function () {
  return gulp.src('src/img/*.*', {since: gulp.lastRun('img')})
    .pipe(newer('build/img'))
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.stream({once: true}));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('build/fonts'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('less', 'img', 'js', 'fonts'),
  'html'
));

gulp.task('serve', gulp.series('build', function() {
  browserSync.init({
    server: 'build'
  });
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/less/**/*.less', gulp.series('less'));
  gulp.watch('src/img/*.*', gulp.series('img'));
  gulp.watch('src/js/*.js', gulp.series('js'));
}));

gulp.task('default',
  gulp.task('serve')
);