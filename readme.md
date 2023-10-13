
# Tempaw Build
Simple Gulp add-on for easy project building.

## Usage
Simple step-by-step guide:
- Create the _gulpfile.js_ file in the project’s root directory.
- Import the _tempaw-build_ module.
- Export the result of calling the `task` function with necessary parameters.
- Run the file via the console (`gulp`)

For example:
```js
const { action, task } = require( 'tempaw-build' );

module.exports.build = task([
	action.clean({ src: 'dist' }),
	action.copy({ src: [ 'dev/**/*.scss', 'dev/**/*.pug' ], dest: 'tmp' }),
	action.del({ src: 'tmp/**/*', marker: 'DIST' }),
	action.sass({ src: 'tmp/**/!(_)*.scss', dest: 'dist' }),
	action.pug({ src: 'tmp/components/page/!(_)*.pug', dest: 'dist' }),
	action.copy({ src: [ 'dev/**/*.js', 'dev/**/*.ico' ], dest: 'dist' }),
	action.minifyimg({ src: [ 'dev/**/*.jpg', 'dev/**/*.png' ], dest: 'dist' }),
	action.clean({ src: 'tmp' })
]);
```


## API

### set()
Creates an array of executable functions out of the action sequence for further transfer to [gulp.series](https://gulpjs.com/docs/en/api/series) or [gulp.parallel](https://gulpjs.com/docs/en/api/parallel).

```js
executableSet = set( actions );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actions` | _Array_ | yes | An array of the action set |
| `executableSet` | _Array_ |  | Executable set of functions |


### task()
Creates a gulp-task out of the action sequence.
Afterward, it can be inserted into another task or exported.

```js
series = task( actions );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actions` | _Array_ | yes | An array of the action set |
| `series` | _function_ |  | Task series |


### action.copy()
File copying.

```js
actionObject = action.copy( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for copying |
| `options.dest` | _string\|Array_ | yes | destination path |


### action.clean()
File deletion.

```js
actionObject = action.clean( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for deletion |


### action.minifyimg()
Image minifying.

```js
actionObject = action.minifyimg( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.src` | _string\|Array_ | yes | glob image file selection for minifying |
| `options.dest` | _string\|Array_ | no | Destination path (if not specified, source files will be overwritten) |
| `options.cache` | _boolean_ | no | Using cache during minifying (the result is cached and used repeatedly to save time) |


### action.del()
Deleting a part of the file using markers.

```js
actionObject = action.del( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.src` | _string\|Array_ | yes | glob file selection |
| `options.dest` | _string\|Array_ | no | Destination path (if not specified, source files will be overwritten) |
| `options.marker` | _string_ | yes | Marker name (digits, letters, uppercase, and underscore are acceptable) |


### action.pug()
Compiling Pug files.

```js
actionObject = action.pug( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.pug` | _object_ | no | [pug](https://pugjs.org/api/reference.html) compiler parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for compiling |
| `options.dest` | _string\|Array_ | yes | Destination path |
| `options.debug` | _boolean_ | no | Shows the compiled file in the console |


### action.sass()
Compiling Sass files.

```js
actionObject = action.sass( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.sass` | _object_ | no | [sass](https://github.com/sass/node-sass#options) compiler parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for compiling |
| `options.dest` | _string\|Array_ | yes | Destination path |
| `options.debug` | _boolean_ | no | Shows the compiled file in the console |


### action.transform()
Transforming the file selection content.

```js
actionObject = action.transform( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for processing |
| `options.dest` | _string\|Array_ | no | Destination path (if not specified, source files will be overwritten) |
| `options.cb` | _function_ | yes | Transformation callback, gets the file content (`contents` & `file`), must return a string |


### action.json()
Modifying the content of a JSON-file as an object.

```js
actionObject = action.json( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.fname` | _string\|object\|function_ | no | [gulp-rename](https://www.npmjs.com/package/gulp-rename#usage) parameters |
| `options.src` | _string\|Array_ | yes | glob file selection for processing |
| `options.dest` | _string\|Array_ | no | Destination path (if not specified, source files will be overwritten) |
| `options.cb` | _function_ | yes | Transformation callback, gets an object, must return an object |


### action.zip()
Packing the file selection into a zip archive.

```js
actionObject = action.zip( options );
```

| parameter | type | required | description |
|:---:|:---:|:---:|---|
| `actionObject` | _object_ |  | Created action object for further execution |
| `options` | _object_ | yes | Action parameters |
| `options.name` | _string_ | no | Name of the action displayed in the console during execution |
| `options.cb` | _function_ | no | Executable callback (must be synchronous), does not accept parameters |
| `options.opts` | _object_ | no | [gulp.src](https://gulpjs.com/docs/en/api/src) parameters |
| `options.zip` | _object_ | no | [gulp-zip](https://www.npmjs.com/package/gulp-zip#api) parameters |
| `options.fname` | _string_ | yes | Name of the zip archive |
| `options.src` | _string\|Array_ | yes | glob file selection for processing |
| `options.dest` | _string\|Array_ | no | Destination path, if not specified, then the archive will be created in the project’s root folder |


## Custom action
A conditional action is a function of a gulp task or a simple object with the `execute` parameter that represents a [gulp task](https://gulpjs.com/docs/en/getting-started/creating-tasks), too.

Examples:
```js
let action = function ( end ) {
  console.log( 'Hello world' );
  end();
};

let actionObject = {
  execute: function ( end ) {
    console.log( 'Hello world' );
    end();
  }
};

let actionObject = {
  execute: function () {
    return src( 'src/*.js' )
      .pipe( dest( 'output/' ) );
  }
};
```

To shorten the routine actions, a function that returns an action object can be used, for example:
```js
/**
 * File copying
 * @param {object} data - object with parameters
 * @param {string|Array.<string>} data.src - glob file selection for copying
 * @param {string} data.dest - destination path
 * @return {object}
 */
let myCopy = function ( obj ) {
  // Checking for required parameters
  if ( !obj || !obj.src || !obj.dest ) throw Error( 'Required parameter of myCopy not specified (src, dest)' );

  // Gulp task for file copying with the received parameters obj.src and obj.dest
  obj.execute = function () {
    return src( obj.src ).pipe( dest( obj.dest ) );
  }

  // Changing the task name
  obj.execute.displayName = 'My Simple Copy';

  // Returning the action object
  return obj;
};
```

Now, a new action can be used:
```js
const { action, task } = require( 'tempaw-build' );

module.exports.build = task([
	action.clean({ src: 'dist' }),
	myCopy({ src: [ 'dev/**/*.scss', 'dev/**/*.pug' ], dest: 'tmp' }),
	action.del({ src: 'tmp/**/*', marker: 'DIST' }),
	action.sass({ src: 'tmp/**/!(_)*.scss', dest: 'dist' }),
	action.pug({ src: 'tmp/components/page/!(_)*.pug', dest: 'dist' }),
	myCopy({ src: [ 'dev/**/*.js', 'dev/**/*.ico' ], dest: 'dist' }),
	action.minifyimg({ src: [ 'dev/**/*.jpg', 'dev/**/*.png' ], dest: 'dist' }),
	action.clean({ src: 'tmp' })
]);
```
