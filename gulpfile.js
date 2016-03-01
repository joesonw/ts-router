var gulp = require('gulp');
var typescript = require('gulp-typescript');
var babel = require('gulp-babel');
var fs = require('fs-extra');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var merge = require('merge2');




gulp.task('typescript', () => {
    var result = gulp.src('src/**/*.ts')
        .pipe(typescript({
            module: 'commonjs',
            outDir: 'builds',
            target: 'ES6',
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
            noEmitOnError: true
        }))
        .pipe(gulp.dest('builds'))
});

gulp.task('babel', ['typescript'], () => {
    return gulp.src('builds/**/*.js')
        .pipe(babel({
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel']);
gulp.task('install', () => {
    fs.copySync('./typings/koa', '../../typings/koa');
    fs.copySync('./typings/node', '../../typings/node');
    fs.copySync('./typings/ts-router', '../../typings/ts-router');
});

gulp.task('test:typescript', () => {
    return gulp.src(['test/**/*.ts','src/**/*.ts'])
        .pipe(typescript({
            module: 'commonjs',
            outDir: 'builds',
            target: 'ES6',
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }))
        .pipe(gulp.dest('builds/test'));
});

gulp.task('test:babel', ['test:typescript'], () => {
    return gulp.src('builds/test/**/*.js')
        .pipe(babel({
            //presets: ['es2015']
        }))
        .pipe(gulp.dest('dist/test'));
});

gulp.task('test:istanbul', ['test:babel'], () => {
    return gulp.src(['dist/test/src/**/*.js'])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire())
        .pipe(gulp.dest('coverage'))
});

gulp.task('test', ['test:istanbul'], () => {
    return gulp.src(['dist/test/**/*.js'])
        .pipe(mocha({
        }))
        .pipe(istanbul.writeReports())
        .once('end', () => {
            process.exit();
        })
});
