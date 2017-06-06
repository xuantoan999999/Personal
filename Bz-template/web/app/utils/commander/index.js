var fs = require('fs');
var path = require('path');

const filename_example = [
'hello.js',
'countdown.js'
];

const filename_app = [
'cmd_init.js',
'cmd_demo.js',
'cmd_initCategory.js',
];

module.exports = function commandLoader(program) {
	'use strict';

	var commands = {};
	var loadPathExample = path.dirname(__filename)+'/example';
	var loadPathApp = path.dirname(__filename)+'/commands';

	/*App*/
	for (var key in filename_app) {
		if (filename_app.hasOwnProperty(key)) {
			var name = filename_app[key].substr(0, filename_app[key].lastIndexOf('.'));
			// Require command
			var command = require(path.join(loadPathApp, filename_app[key]));
			// Initialize command
			commands[name] = command(program);
		}
	}

	/*Example*/
	for (var key in filename_example) {
		if (filename_example.hasOwnProperty(key)) {
			var name = filename_example[key].substr(0, filename_example[key].lastIndexOf('.'));
			// Require command
			var command = require(path.join(loadPathExample, filename_example[key]));
			// Initialize command
			commands[name] = command(program);
		}
	}

	/*Auto Load files*/
	// var loadPath = path.dirname(__filename);
	// // Loop though command files
	// fs.readdirSync(loadPath).filter(function (filename) {
	// 	return (/\.js$/.test(filename) && filename !== 'index.js');
	// }).forEach(function (filename) {
	// 	var name = filename.substr(0, filename.lastIndexOf('.'));

	// 	// Require command
	// 	var command = require(path.join(loadPath, filename));

	// 	// Initialize command
	// 	commands[name] = command(program);
	// });

	return commands;
};