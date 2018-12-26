import gulp from 'gulp';

import del from 'del';
import browserify from 'browserify';
import tsify from 'tsify';
import watchify from 'watchify';
import babelify from 'babelify';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import connect from 'gulp-connect';

import sass from 'gulp-sass';

export const clean = () => del(['./build/']);

export const SASS = () => gulp.src('./src/style/**/*.scss')
  .pipe(sass()).on('error', sass.logError)
  .pipe(gulp.dest('./build/'))
  .pipe(connect.reload());

export const watch = () => {
  gulp.watch('./src/style/**/*.scss', SASS);
}

export function build() {

  const bundler = browserify({
    debug: true,
    entries: './src/index.tsx',
    cache: {},
    packageCache: {},
  })
  .plugin(watchify, {ignoreWatch: ['**/node_modules/**']})
  .plugin(tsify)
  .transform(babelify, {"extensions": [".ts", ".tsx"]} );

  const taskFn = () => {
    let stream = bundler.bundle()
    return stream
      .on('error', err => {
        console.log(err.message);
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(connect.reload());
  }
  bundler.on('update', taskFn);
  bundler.on('log', console.log);
  taskFn();
}

function server() {
  connect.server({
    name: 'Test app',
    root: ['public', 'build'],
    port: 3000,
    livereload: true,
    fallback: 'public/index.html'
  });
}

export default gulp.series(
  SASS,
  gulp.parallel(server, build, watch),
  );
