// confirmed working on node v4.2.6 & npm v3.7.2
// if you are still having issues, you may need to install browserify gloablly.

var fs = require('fs');

var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var fileinclude = require('gulp-file-include');
var babel = require("gulp-babel");


var output_android =  './cordova_dist/';
var output_exchange_office =  './cordova_exchange_dist/';

// Compile and Minify Less / CSS Files
var lessWatchFolder = './app/styles/less/**/*.less';
var lessFile = './app/styles/less/etherwallet-master.less';
var lessOutputFolder = 'www/css';

var lessOutputFile = 'etherwallet-master.css';
var lessOutputFileMin = 'etherwallet-master.min.css';

gulp.task('less', function (cb) {
  return gulp
    .src(lessFile)
      .pipe(less({ compress: false })).on('error', notify.onError(function (error) {
        return "ERROR! Problem file : " + error.message;
      }))
      .pipe(autoprefixer('last 2 version', 'ios 6', 'android 4'))
      .pipe(rename(lessOutputFile))
      .pipe(cssnano()).on('error', notify.onError(function (error) {
        return "ERROR! minify CSS Problem file : " + error.message;
      }))
      .pipe(rename(lessOutputFileMin))
      .pipe(gulp.dest("./dist/css"))
      .pipe(notify('Cordova Styles Complete'));
});


// Compile and Minify JS Files
var jsFiles = "./app/scripts/*.js";
var AllJsFiles = "./app/scripts/**/*.js";
var mainjs = "./build/main.js";
var staticjsFiles = "./app/scripts/staticJS/*.js";
var copiedjsFiles = "./app/scripts/copied/*.js";
var staticjsOutputFile = 'etherwallet-static.min.js';
var jsOutputFolder='www/js';

gulp.task('copiedJS', function () {
  return gulp
    .src(copiedjsFiles)
      .pipe(gulp.dest(output_android+jsOutputFolder))
      .pipe(gulp.dest(output_exchange_office+jsOutputFolder))
      .pipe(notify('Cordova Copied JS Complete'));
});

gulp.task('staticJS', function () {
  return gulp
    .src(staticjsFiles)
      .pipe(concat(staticjsOutputFile))
      .pipe(uglify())
      .pipe(gulp.dest(output_android+jsOutputFolder))
      .pipe(gulp.dest(output_exchange_office+jsOutputFolder))
      .pipe(notify('Cordova StaticJS Complete'));
});

gulp.task('minJS',['browserify'],function () {
  return gulp
    .src('./dist/js/etherwallet-master.js')
      .pipe(babel())
      .pipe(concat('etherwallet-master-min.js'))
      .pipe(gulp.dest(output_android+jsOutputFolder))
      .pipe(gulp.dest(output_exchange_office+jsOutputFolder))
      .pipe(notify('Cordova MinJS Complete'));
});

gulp.task('babelify', () => {
  return gulp.src(AllJsFiles)
	.pipe(babel({
	  presets: ['@babel/preset-env'],
      "plugins": [
        ["@babel/plugin-transform-runtime", {
          "regenerator": true
        }]
      ]
	}))
	.pipe(gulp.dest('build'))
});


// Browserify
gulp.task('browserify', ['babelify'], shell.task([
  'mkdir -p dist/js',
  'browserify '+mainjs+' -o dist/js/etherwallet-master.js'
]));


// Copy Images
var imagesFolder = "./app/images/**/*";
var imagesOutputFolder='www/images';

gulp.task('copy-images', function() {
   gulp.src(imagesFolder)
       .pipe(gulp.dest("./dist/images"))

       .pipe(gulp.dest(output_android+imagesOutputFolder))
      .pipe(gulp.dest(output_exchange_office+imagesOutputFolder))
   .pipe(notify({message:'Cordova Images Complete', onLast:true}));
});


// Copy Fonts
var fontsFolder = "./app/fonts/*.*";
var fontsOutputFolder='www/fonts';

gulp.task('copy-fonts', function() {
   gulp.src(fontsFolder)
          .pipe(gulp.dest("./dist/fonts"))
   .pipe(gulp.dest(output_android+fontsOutputFolder))
   .pipe(gulp.dest(output_exchange_office+fontsOutputFolder))
   .pipe(notify({message:'Cordova Fonts Complete', onLast:true}));
});

// Copy Local Config
var confFolder = "./app/configs/*";
var confOutputFolder='www/configs';

gulp.task('copy-conf', function() {
          gulp.src(confFolder) 
          .pipe(gulp.dest("./dist/configs"))
          .pipe(gulp.dest(output_android+confOutputFolder))
          .pipe(gulp.dest(output_exchange_office+confOutputFolder))
          .pipe(notify({message:'Cordova Conf Complete', onLast:true}));
          });


gulp.task('css',['less','copy-images'], function () {
          return gulp.src('./dist/css/*.css')
         // .pipe(base64())
          .pipe(gulp.dest(output_android+lessOutputFolder))
          .pipe(gulp.dest(output_exchange_office+lessOutputFolder))

          });


//html Pages
var htmlPages = "./app/layouts/*.html";
var tplFiles = "./app/includes/*.tpl";

gulp.task('buildHTML', function () {
    gulp.src(htmlPages)
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
    .pipe(gulp.dest('./dist/html/'));
    
    gulp.src('./dist/html/index.html')
    .pipe(gulp.dest(output_android +'www/')) 
    .pipe(notify({message:'Cordova HTML Pages Complete', onLast:true}));;
    
    gulp.src('./dist/html/exchangeOffice.html')
    .pipe(concat('index.html'))
    .pipe(gulp.dest(output_exchange_office+'www/')) 
    .pipe(notify({message:'Cordova Exchange Office HTML Pages Complete', onLast:true}));
    
   
   
});



// Watch Tasks
gulp.task('watchJS', function() {
  gulp.watch([jsFiles, AllJsFiles],[
    'browserify',
    'minJS',
  ]);
});
gulp.task('watchLess', function() {
    gulp.watch(lessWatchFolder, ['css']);
});
gulp.task('watchPAGES', function() {
    gulp.watch(htmlPages, ['buildHTML']);
});
gulp.task('watchTPL', function() {
    gulp.watch(tplFiles, ['buildHTML']);
});



gulp.task('build', ['buildHTML','css', 'staticJS', 'copiedJS', 'browserify',  'minJS','copy-fonts','copy-conf']);

gulp.task('watch', ['watchJS' , 'watchLess', 'watchPAGES', 'watchTPL']);

gulp.task('default', ['build', 'watch']);
