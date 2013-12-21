'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var CallumGenerator = module.exports = function CallumGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);

	this.on('end', function () {
		this.installDependencies({
			skipInstall: options['skip-install'],
			callback: function () {
				this.emit('dependenciesInstalled');
			}.bind(this)
		});
	});

	this.on('dependenciesInstalled', function () {
		this.spawnCommand('grunt', ['bower']);
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
		this.props = props;

		this.props.libraries = [];
		if (props.jQueryInstall) {
			this.props.libraries.push('jquery#1.10.2');
		}

		cb();
	}.bind(this));
};

var librariesAsync = false;
CallumGenerator.prototype.askForLibraries = function () {
	if (!librariesAsync) {
		librariesAsync = this.async();
	}

	this.prompt([
		{
			name: 'otherLibrary',
			message: 'Enter a bower library to install (or leave blank for none):'
		}
	], function (props) {
		if (props.otherLibrary) {
			this.props.libraries.push(props.otherLibrary);
			CallumGenerator.prototype.askForLibraries.call(this);
		} else {
			librariesAsync();
		}
	}.bind(this));
};

CallumGenerator.prototype.staticFiles = function () {
	this.directory('.', '.');
};

CallumGenerator.prototype.templateFiles = function () {
	var fs = require('fs'),
		cb = this.async(),
		done = 0,
		files = ['package.json', 'bower.json', 'app/index.html', 'app/assets/less/style.less', 'app/assets/js/app.js'],
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

CallumGenerator.prototype.bowerTasks = function () {
	if (this.props.libraries.length) {
		var bower = require('bower'),
			cb = this.async(),
			that = this,
			libsInstalled = 0;

		this.props.libraries.forEach(function (lib) {
			bower.commands
				.install([lib], {save: true})
				.on('end', function () {
					libsInstalled++;

					if (libsInstalled === that.props.libraries.length) {
						cb();
					}
				});
		});
	}
};