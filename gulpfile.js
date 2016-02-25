var gulp = require('gulp');
var typescript = require('gulp-typescript');
var babel = require('gulp-babel');
var fs = require('fs-extra');




gulp.task('typescript', () => {
    return gulp.src('src/**/*.ts')
        .pipe(typescript({
            module: 'commonjs',
            outDir: 'builds',
            target: 'ES6',
            experimentalDecorators: true,
            emitDecoratorMetadata: true
        }))
        .pipe(gulp.dest('builds'));
});

gulp.task('babel', ['typescript'], () => {
    return gulp.src('builds/**/*.js')
        .pipe(babel({
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['babel']);
gulp.task('install', () => {
    fs.mkdirpSync('../../typings/ts-router');
    fs.copySync('./typings/koa', '../../typings/koa');
    fs.copySync('./typings/node', '../../typings/node');
    fs.copySync('./declaration.d.ts', '../../typings/ts-router/ts-router.d.ts');
});
