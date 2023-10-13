const
	color     = require( 'ansi-colors' ),
	timestamp = require( 'time-stamp' );


/**
 * Получение тэга обьекта (для точного определения типа)
 * @param {*} data - любой тип данных
 * @returns {string} - тэг обьекта
 */
function tag ( data ) {
	return Object.prototype.toString.call( data ).slice( 8, -1 );
}

/**
 * Слияние обьектов, модифицирует исходный
 * @param {object} source - исходный обьект
 * @param {object} merged - слияемый обьект
 * @return {object} - конечный обьект
 */
function merge( source, merged ) {
	for ( let key in merged ) {
		if ( tag( merged[ key ] ) === 'Object' ) {
			if ( typeof( source[ key ] ) !== 'object' ) source[ key ] = {};
			source[ key ] = merge( source[ key ], merged[ key ] );
		} else {
			source[ key ] = merged[ key ];
		}
	}

	return source;
}

/**
 * Логирование с временным штампом серого цвета в квадратных скобках
 * @param {...*}
 */
function log () {
	console.log( `[${color.gray( timestamp('HH:mm:ss') )}]`, ...arguments );
}


module.exports = { tag, merge, log };
