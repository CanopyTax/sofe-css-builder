let path = require('path');
let postcss = require('postcss');
let cssnano = require('cssnano');

let json;

module.exports = function(css, inputFile, serviceName, options = {}) {
	return new Promise((resolve, reject) => {
		postcss([
			require('postcss-modules')({
				scopeBehaviour: options.global ? 'global' : 'local',
				generateScopedName: function(name, filename, css) {
					return '_sofe_' + serviceName + '__' + name;
				},
				getJSON: function(cssFileName, _json) {
					json = _json;
				}
			})
		]).process(css, { from: inputFile }).then(function(result) {
			cssnano.process(result.css, { safe: true })
				.then((result) => {
					resolve({
						css: removeWrappingQuotes(result.css),
						exports: json,
					});
				})
				.catch(err => reject(err));
		}).catch(err => reject(err));

	});
}

function removeWrappingQuotes(source) {
  return source
    .replace(/(["\\])/g, '\\$1')
    .replace(/[\f]/g, '\\f')
    .replace(/[\b]/g, '\\b')
    .replace(/[\n]/g, '\\n')
    .replace(/[\t]/g, '\\t')
    .replace(/[\r]/g, '\\r')
    .replace(/[\']/g, '\\\'')
    .replace(/[\u2028]/g, '\\u2028')
    .replace(/[\u2029]/g, '\\u2029')
		.replace(/^["']|["']$/g, '');
}
