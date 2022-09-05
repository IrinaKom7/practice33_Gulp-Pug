const gulp = require('gulp');
const pug = require('gulp-pug');

const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
//const imagemin = require('gulp-imagemin');

const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');


const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'build/assets'
    },
    styles: {
        src: 'src/styles/**/*.scss',
        dest: 'build/assets/styles/'
    },
    images: {
        src: 'src/images/*.*',
        dest: 'build/assets/images'
    },
    scripts: {
        src: 'src/scripts/**/*.js',
        dest: 'build/assets/scripts/' 
    }

};

// pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.root));
}

// scss
function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest))
}

// images
function images() {
    return gulp.src(paths.images.src)
        //.pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest)) //И бросим в build
}


// scripts
function scripts() {
    return gulp.src('src/scripts/app.js')
    //return gulp.src(paths.scripts.src)
        //.pipe(jshint())
        //.pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(uglify()) // Сжимаем JavaScript
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(paths.scripts.dest));
}

// галповский вотчер
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

// локальный сервер + livereload (встроенный)
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**//**.*', browserSync.reload);
}


exports.templates = templates;
exports.styles = styles;
exports.images = images;
exports.scripts = scripts;


gulp.task('default', gulp.series(
    gulp.parallel(styles, templates, images, scripts),
    gulp.parallel(watch, server)
));




