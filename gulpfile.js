var gulp         = require('gulp'),
    browserSync  = require('browser-sync'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    gulpIf       = require('gulp-if'),
    useref       = require('gulp-useref'),
    plumber      = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    ftp          = require( 'vinyl-ftp' ),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    cache        = require('gulp-cache'),
    pngquant     = require('imagemin-pngquant'),
    spritesmith  = require('gulp.spritesmith'),
    stylus       = require('gulp-stylus'),
    pug         = require('gulp-pug');


// build

gulp.task('clean', function(){
    return del.sync('dist');
});

gulp.task('optimazeimg', function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('clearCache', function(){
    return cache.clearAll();
});

gulp.task('useref', function(){
  return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copyfonts', function(){
    return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('copyCss', function(){
    return gulp.src('app/css/**/*')
    .pipe(gulp.dest('dist/css'))
});

// usefull 

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.scss'
  }));
  return spriteData.pipe(gulp.dest('app/img/sprite'));
});

gulp.task('userefone', function(){
  return gulp.src('app/index.html')
        .pipe(useref())
        .pipe(
            gulpIf('*.js', uglify())
        )
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'));
});

// general

gulp.task('pug', function(){
    return gulp.src(['app/pug/**/*.pug','!app/pug/**/_*.pug'])
    .pipe(plumber())
    .pipe(pug({
        pretty: true
    }))
    .pipe(gulp.dest('app'))
})

gulp.task('stylus', function(){
    gulp.src(['app/stylus/**/*.styl','!app/stylus/**/_*.styl'])
    .pipe(plumber())
    .pipe(stylus({
        'include css': true
    }))
    .pipe(autoprefixer(['last 2 versions', '> 5%', 'Firefox ESR' , 'ie 9']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

// sync

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app',
            proxy: 'welbit.dev'
        },
        logLevel: 'debug'
    });
});

// watch

gulp.task('build', ['pug', 'stylus', 'clean', 'userefone', 'copyfonts', 'copyCss', 'optimazeimg'], function(){
});

gulp.task('default', ['browser-sync', 'stylus', 'pug'], function(){
    gulp.watch('app/pug/**/*.pug', ['pug']);
    gulp.watch('app/stylus/**/*.styl', ['stylus']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('deploy', function(){

    var conn = ftp.create( {
        host:     '',
        user:     '',
        password: '',
        parallel: 10
    } );

    var globs = [
        'dist/src/**',
        'dist/css/**',
        'dist/js/**',
        'dist/fonts/**',
        'dist/index.html'
    ];

    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '.', buffer: false } )
        .pipe( conn.newer( '/deploy' ) ) // only upload newer files
        .pipe( conn.dest( '/deploy' ) );
});