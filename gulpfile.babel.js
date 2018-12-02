import gulp from 'gulp';

import del from 'del';
import browserify from 'browserify';
import tsify from 'tsify';
import watchify from 'watchify';
import babelify from 'babelify';

import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

import connect from 'gulp-connect';

export const clean = () => del(['./build/']);

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
    return bundler.bundle()
      .on('error', console.log)
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(connect.reload());
  }
  bundler.on('update', taskFn);
  bundler.on('log', console.log)
  taskFn();
}

function server() {
  connect.server({
    name: 'Test app',
    root: ['public', 'build'],
    port: 3000,
    livereload: true
  });
}

export default gulp.parallel(server, build);
