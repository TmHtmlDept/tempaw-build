const
	util     = require( './util.js' ),
	color    = require( 'ansi-colors' ),
	gulp     = require( 'gulp' ),
	del      = require( 'del' ),
	zip      = require( 'gulp-zip' ),
	pug      = require( 'gulp-pug' ),
	sass     = require( 'gulp-sass' )(require('node-sass') ),
	insert   = require( 'gulp-insert' ),
	cache    = require( 'gulp-cache' ),
	rename   = require( 'gulp-rename' ),
	imagemin = require( 'gulp-imagemin' ),
	mkdirp = require('mkdirp');

let action = {};


/**
 * Копирование файлов
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {string|Array.<string>} data.src - glob выборка файлов для копирования
 * @param {string|Array.<string>} data.dest - путь назначения
 * @todo {boolean} [data.debug] - показывает копируемый файл
 */
action.copy = function ( data ) {
	if ( !data || !data.src || !data.dest ) throw Error( 'Required parameter of action.copy not specified (src, dest)' );
	data.opts = util.merge( { allowEmpty: true }, data.opts );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Copy';
	return data;
};

/**
 * Удаление файлов
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {string|Array.<string>} data.src - glob выборка файлов для удаления
 */
action.clean = function ( data ) {
	if ( !data || !data.src ) throw Error( 'Required parameter of action.clean not specified (src)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'source:', color.magenta( data.src ) );
		return del( data.src );
	};

	data.execute.displayName = data.name || 'Clean';
	return data;
};

/**
 * Минификация картинок
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {string|Array.<string>} data.src - glob выборка файлов для минификации
 * @param {string} [data.dest] - путь назначения, если не указан то будут перезаписаны исходные файлы
 * @param {boolean} [data.cache] - использование кеширования при минификации
 */
action.minifyimg = function ( data ) {
	if ( !data || !data.src ) throw Error( 'Required parameter of action.minifyimg not specified (src)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		if ( data.cache ) {
			util.log( color.yellow( 'cache is used!' ) );
			pipeline = pipeline.pipe( cache( imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			], { verbose: true }) ) );
		} else {
			pipeline = pipeline.pipe( imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 })
			], { verbose: true }) );
		}

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( typeof( data.dest ) === 'string' ) {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		} else if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'overwriting sources' );
			pipeline = pipeline.pipe( gulp.dest( ( file ) => {
				return file.base;
			}));
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Minify Images';
	return data;
};

/**
 * Удаление части содержимого по маркерам
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя задачи
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {string|Array.<string>} data.src - glob выборка файлов
 * @param {string|Array.<string>} [data.dest] - путь назначения, если не указан то будут перезаписаны исходные файлы
 * @param {string} data.marker - имя маркера (допустимы цифры, буквы верхнего регистра и символ подчеркивания)
 *
 * @todo в принципе для этого лучше использовать готовый модуль
 * @todo избавиться от transform, если можно
 * @todo парсинг маркера
 * @todo LET- маркер
 * @todo комментарий #
 */
action.del = function ( data ) {
	if ( !data || !data.src || !data.marker ) throw Error( 'Required parameter of action.del not specified (src, marker)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		pipeline = pipeline.pipe( insert.transform( function( content, file ) {
			let regExp = new RegExp( `\\s*\\/\\/\\{DEL.*?${data.marker}.*?\\}[^\\v]*?\\/\\/\\{DEL\\}`, 'g' );
			return content.replace( regExp, function() {
				util.log( color.yellow( `DEL ${data.marker} at:` ), file.path );
				return '';
			}).replace( /\s*\/\/\{DEL.*?\}/g, '' );
		}));

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( typeof( data.dest ) === 'string' ) {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		} else if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'overwriting sources' );
			pipeline = pipeline.pipe( gulp.dest( ( file ) => {
				return file.base;
			}));
		}

		return pipeline;
	};

	data.execute.displayName = data.name || `Delete markers {${data.marker}}`;
	return data;
};

/**
 * Компиляция pug файлов
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {object} [data.pug] - параметры pug компилятора
 * @param {string|Array.<string>} data.src - glob выборка файлов для компиляции
 * @param {string|Array.<string>} data.dest - путь назначения
 * @param {boolean} [data.debug] - показывает компилируемый файл
 * @todo data.nobase из tempaw-functions?
 */
action.pug = function ( data ) {
	if ( !data || !data.src || !data.dest ) throw Error( 'Required parameter of action.pug not specified (src, dest)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		if ( data.debug ) {
			pipeline = pipeline.pipe( insert.transform( function( contents, file ) {
				util.log( color.gray( `Compiling: ${file.path}` ) );
				return contents;
			}));
		}

		pipeline = pipeline.pipe( pug( data.pug ) );

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Pug';
	return data;
};

/**
 * Компиляция sass файлов
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {object} [data.sass] - параметры sass компилятора
 * @param {string|Array.<string>} data.src - glob выборка файлов для компиляции
 * @param {string|Array.<string>} data.dest - путь назначения
 * @param {boolean} [data.debug] - показывает компилируемый файл
 * @todo data.nobase из tempaw-functions?
 */
action.sass = function ( data ) {
	if ( !data || !data.src || !data.dest ) throw Error( 'Required parameter of action.sass not specified (src, dest)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();

		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		if ( data.debug ) {
			pipeline = pipeline.pipe( insert.transform( function( contents, file ) {
				util.log( color.gray( `Compiling: ${file.path}` ) );
				return contents;
			}));
		}

		pipeline = pipeline.pipe( sass( data.sass ) );

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Sass';
	return data;
};

/**
 * Трансформация содержимого файлов из выборки
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {string|Array.<string>} data.src - glob выборка файлов для обработки
 * @param {string|Array.<string>} [data.dest] - путь назначения, если не указан то будут перезаписаны исходные файлы
 * @param {function} data.cb - колбек для транформации, получает содержимое файла contents и file, должен возвращать строку
 */
action.transform = function ( data ) {
	if ( !data || !data.src || !data.cb ) throw Error( 'Required parameter of action.transform not specified (src, cb)' );

	data.execute = function () {
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		pipeline = pipeline.pipe( insert.transform( function( contents, file ) { return data.cb( contents, file ); }));

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( typeof( data.dest ) === 'string' ) {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		} else if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'overwriting sources' );
			pipeline = pipeline.pipe( gulp.dest( ( file ) => {
				return file.base;
			}));
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Transform';
	return data;
};

/**
 * Изменение содержимого json-файла как объекта
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {object} [data.opts] - параметры gulp.src
 * @param {string|object|function} [data.fname] - параметры gulp-rename
 * @param {string|Array.<string>} data.src - glob выборка файлов для обработки
 * @param {string|Array.<string>} [data.dest] - путь назначения, если не указан то будут перезаписаны исходные файлы
 * @param {function} data.cb - колбек для транформации, получает объект, должен возвращать объект
 */
action.json = function ( data ) {
	if ( !data || !data.src || !data.cb ) throw Error( 'Required parameter of action.json not specified (src, cb)' );

	data.execute = function () {
		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		pipeline = pipeline.pipe( insert.transform( function( contents, file ) { return JSON.stringify( data.cb( JSON.parse( contents ) ) ); }));

		if ( data.fname ) {
			pipeline = pipeline.pipe( rename( data.fname ) );
		}

		if ( typeof( data.dest ) === 'string' ) {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		} else if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'overwriting sources' );
			pipeline = pipeline.pipe( gulp.dest( ( file ) => {
				return file.base;
			}));
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Json';
	return data;
};

/**
 * Запаковка выборки файлов в zip-архив
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {object} [data.opts] - gulp.src параметры
 * @param {object} [data.zip] - параметры gulp-zip плагина
 * @param {string} data.fname - имя архива
 * @param {string|Array.<string>} data.src - glob выборка файлов для запаковки
 * @param {string|Array.<string>} [data.dest] - путь назначения, если не указан то архив будет создан в корне проекта
 */
action.zip = function ( data ) {
	if ( !data || !data.src || !data.fname ) throw Error( 'Required parameter of action.zip not specified (src, fname)' );

	data.execute = function () {
		if ( data.cb instanceof Function ) data.cb();

		util.log( 'source:', color.magenta( data.src ) );
		let pipeline = gulp.src( data.src, data.opts );

		pipeline = pipeline.pipe( zip( data.fname, data.zip ) );

		if ( typeof( data.dest ) === 'string' ) {
			util.log( 'destination:', color.magenta( data.dest ) );
			pipeline = pipeline.pipe( gulp.dest( data.dest ) );
		} else if ( data.dest instanceof Array ) {
			data.dest.forEach( ( str ) => {
				util.log( 'destination:', color.magenta( str ) );
				pipeline = pipeline.pipe( gulp.dest( str ) );
			});
		} else {
			util.log( 'destination: "./"' );
			pipeline = pipeline.pipe( gulp.dest( './' ) );
		}

		return pipeline;
	};

	data.execute.displayName = data.name || 'Zip';
	return data;
};

/**
 * Создание новой пустой директории
 * @param {object} data - объект с параметрами
 * @param {string} [data.name] - отображаемое имя действия
 * @param {function} [data.cb] - выполняемый колбек (должен быть синхронным)
 * @param {string} data.path - путь для создания директории
 */
action.mkdirp = function (data) {
	if (!data || !data.path) throw Error('Required parameter of action.mkdirp not specified (path)');

	data.execute = function () {
		if (data.cb instanceof Function) data.cb();

		util.log('Creating directory:', color.magenta(data.path));
		return new Promise((resolve, reject) => {
			mkdirp(data.path, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};

	data.execute.displayName = data.name || 'Create Directory';
	return data;
};

module.exports = action;
