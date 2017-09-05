'use strict';

/* ******************************************************************************
0. DEPENDENCIES
*******************************************************************************/

const gulp = require('gulp');                    // gulp core
const gulpIf = require('gulp-if');               // gulp if else, если дев версия то 1, если продакшн, то другое
const plumber = require('gulp-plumber');         // не дает прервать работу gulp из-за ошибок
const notify = require('gulp-notify');           // send notifications to osx
const sourcemaps = require('gulp-sourcemaps');   // sourcemap
const concat = require('gulp-concat');           // объединение файлов
const sass = require('gulp-sass');               // sass compiler
const postcss = require('gulp-postcss');         // postcss
const autoprefixer = require('autoprefixer');    // autoprefixer
const csso = require('gulp-csso');               // minify the css files
const filter = require('gulp-filter');           // для объединения styl и css файлов
const pug = require('gulp-pug');                 // pug compiler
const svgSprite = require('gulp-svg-sprite');    // svg sprites
const webpack = require('webpack-stream');       // webpack
const browserSync = require('browser-sync');     // server & livereload

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development'; // NODE_ENV=prodaction gulp сборка на продакшн

/*******************************************************************************
1. STYLUS TASK
*******************************************************************************/

gulp.task('styles', function () {
  const f = filter(['src/sass/**/*.sass'], {restore: true});
  return gulp.src([require.resolve('normalize.css'), 'node_modules/swiper/dist/css/swiper.min.css', 'src/sass/common.sass'])
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sourcemaps.init())
    .pipe(f)
    .pipe(sass())
    .pipe(f.restore)
    .pipe(concat('common.css'))
    .pipe(postcss([
      autoprefixer({browsers: ['last 2 versions']})
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulpIf(!isDev, csso()))
    .pipe(gulp.dest('dist/css'))
});

/*******************************************************************************
2. TEMPLATES TASK
*******************************************************************************/

gulp.task('templates', function() {
  gulp.src('src/templates/*.pug')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dist/html'))
});

/*******************************************************************************
3. COPY ASSETS
*******************************************************************************/

gulp.task('copy', function() {
  gulp.src(['src/index.html', 'src/{fonts,i,uploads,lib,data}/**/*', '!src/i/sprites/**/*', '!src/i/sprites/'])
    .pipe(gulp.dest('dist'));
});

/*******************************************************************************
4. SVG
*******************************************************************************/

const config = {
    transform: [],
    mode: {
        symbol: {
            dest: '.',
            bust: false,
            sprite: "common.svg",
            example: true
        }
    },
    svg: {
        xmlDeclaration: false
    }
};
gulp.task('svg', function() {
    gulp.src('src/i/sprites/common/*.svg')
        .pipe(svgSprite(config))
        .pipe(gulp.dest('dist/i'));
});

/*******************************************************************************
5. SCRIPTS
*******************************************************************************/

gulp.task('scripts-watch', function() {
  gulp.src('src/js/*.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'));
});
gulp.task('scripts-nowatch', function() {
  gulp.src('src/js/*.js')
    .pipe(webpack(require('./webpack-nowatch.config.js')))
    .pipe(gulp.dest('dist/js'));
});

/*******************************************************************************
6. BROWSER SYNC
*******************************************************************************/

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./dist/",
        index: "html/index.html"
    },
    open: false,
    codeSync: false
  });
});

/*******************************************************************************
7. START & WATCH
*******************************************************************************/

gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.sass', ['styles']);
  gulp.watch('i/sprites/**/*.svg', ['svg']);
  gulp.watch('src/templates/**/*.pug', ['templates']);
  gulp.watch(['src/i/**', 'src/uploads/**', 'src/fonts/**', 'src/data/**'], ['copy']);
  gulp.watch('src/js/**/*.js', ['scripts-watch']);
  gulp.watch(['src/sass/**/*.sass', 'src/js/**/*.js', 'src/templates/**/*.pug'], browserSync.reload);
});
gulp.task('default', ['templates', 'styles', 'copy', 'svg', 'scripts-watch', 'browser-sync', 'watch']);
// gulp.task('build', ['templates', 'styles', 'copy', 'svg', 'scripts-nowatch']);
