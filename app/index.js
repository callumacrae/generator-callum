'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CallumGenerator = module.exports = function CallumGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({ skipInstall: options['skip-install'] });
	});

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CallumGenerator, yeoman.generators.Base);

CallumGenerator.prototype.askFor = function askFor() {
	var cb = this.async(),
		dirName;

	// have Yeoman greet the user.
	console.log(this.yeoman);

	dirName = this.sourceRoot().split('/');
	dirName = dirName[dirName.length - 3];

	var prompts = [
		{
			name: 'project_name',
			message: 'What is your project\'s name?',
			default: dirName,
			validate: function (name) {
				return (/^[a-zA-Z0-9-_]+$/).test(name);
			}
		},
		{
			name: 'author_name',
			message: 'What is your name?',
			default: 'Callum Macrae'
		},
		{
			name: 'author_email',
			message: 'What is your email address?',
			default: 'callum@macr.ae'
		},
		{
			type: 'confirm',
			name: 'jQueryInstall',
			message: 'Would you like to install jQuery?',
			default: true
		}
	];

	this.prompt(prompts, function (props) {
		this.jquery = props.jQueryInstall;
		this.props = props;

		cb();
	}.bind(this));
};

CallumGenerator.prototype.staticFiles = function () {
	this.directory('.', '.');
};

CallumGenerator.prototype.templateFiles = function () {
	var fs = require('fs'),
		cb = this.async(),
		done = 0,
		files = ['package.json', 'bower.json', 'app/assets/less/style.less', 'app/assets/js/app.js'],
		that = this;

	files.forEach(function (file) {
		fs.unlink(file, function () {
			that.template(file, file, that.props);

			done++;
			if (done === files.length) {
				cb();
			}
		});
	});
};
