#!/usr/bin/env node

let fs = require('fs');
let chalk = require('chalk');
let path = require('path');

const builder = require('./builder.js');

let argv = require('minimist')(process.argv.slice(2));

if (argv._.length !== 2 || argv.h || !argv.s) {
	console.log(chalk.blue('               SOFE CSS Modules Builder v' + require('../package.json').version));
	console.log('---------------------------------------------------------------');
	console.log(chalk.green('sofe-css-builder ') + chalk.yellow('-s=[serviceName] ') + chalk.yellow('[input.css] [built-output.js]'));
	console.log('Optional Parameters:');
	console.log(chalk.yellow('\t-g  ') + 'default to global scope');
	process.exit(1);
}

let inputFile = path.join(process.cwd(), argv._[0]);
let outputFile = path.join(process.cwd(), argv._[1]);

let css = fs.readFileSync(inputFile, 'utf8');

console.log(chalk.blue('Building ') + inputFile);

builder(css, inputFile, argv.s, {
	global: !!argv.g,
}).then(({css, exports}) => {

	let output = `
	(function(c){
	let style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = c;
	document.head.insertBefore(style, document.head.firstChild);
	})("${css}");

	module.exports = ${JSON.stringify(exports)};
	`;

	fs.writeFileSync(outputFile, output);
	console.log(chalk.green('CSS built to', outputFile));
}).catch(err => {
	console.log(chalk.red('Error:\t') + err)
	process.exit(1);
});


