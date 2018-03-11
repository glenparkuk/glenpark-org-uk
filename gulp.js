var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),

    basepaths = {
        src: 'source'
    },

    paths = {
        js: {
            src: basepaths.src + '/js',
            dest: 'js',
            node: 'node_modules'
            // bower: 'bower_components'
        },
        css: {
            src: basepaths.src + '/sass',
            dest: ''
        }
    };

/*
 Styles - Clean
 */
gulp.task('clean-styles', function() {
    return gulp.src('style.css', {read: false})
        .pipe(clean());
});

/*
 Styles Task
 */
gulp.task('styles', ['clean-styles'], function() {
    gulp.src(paths.css.src + '/**/*.scss')
        .pipe(plumber({
            errorHandler: function(error) {
                console.log('Styles Error: ' + error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css.dest));
});

/*
 Scripts - Clean
 */
gulp.task('clean-scripts', function() {
    return gulp.src(paths.js.dest + '/all.min.js', {read: false})
        .pipe(clean());
});

/*
 Scripts - Hint
 */
gulp.task('hint', function() {
    return gulp.src(paths.js.src + '/**/*.js')

        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});


/*
 Scripts - Concat and Uglify
 */
gulp.task('scripts', ['clean-scripts', 'hint'], function() {
    gulp.src([
        paths.js.node + '/svg4everybody/dist/svg4everybody.min.js',
        paths.js.node + '/picturefill/dist/picturefill.min.js',
        paths.js.src + '/**/*.js'
    ])
        .pipe(plumber({
            errorHandler: function(error) {
                console.log('Scripts Error: ' + error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('./all.min.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.js.dest));
});

/*
 Default and Watch Task
 */
gulp.task('default', ['styles', 'scripts'], function() {
    gulp.watch(paths.css.src + '/**/*.scss', ['styles']);
    gulp.watch(paths.js.src + '/**/*.js', ['scripts']);
});
