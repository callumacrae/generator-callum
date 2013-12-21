'use strict';

var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');



var CallumGenerator = module.exports = function CallumGenerator(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);
	this.options = options;

	this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(CallumGenerator, yeoman.generators.Base);

CallumGenerator.prototype.askFor = function askFor() {
	var cb = this.async();

	// have Yeoman greet the user.
	console.log(this.yeoman);

	var prompts = [
		{
			name: 'project_name',
			message: 'What is your project\'s name?',
			default: this.appname,
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
			this.askForLibraries.call(this);
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

CallumGenerator.prototype.installDeps = function () {
	var cb = this.async();

	this.installDependencies({
		skipInstall: this.options['skip-install'],
		callback: function () {
			this.spawnCommand('grunt', ['bower'])
				.on('close', function () {
					cb();
				});
		}.bind(this)
	});
};

CallumGenerator.prototype._isInstalled = function (app, cb) {
	var cmd = spawn('which', [app]),
		installed = false;

	cmd.stdout.on('data', function () {
		installed = true;
	});

	cmd.on('close', function () {
		cb(installed);
	});
};

CallumGenerator.prototype.initInitGit = function () {
	var cb = this.async();

	this._isInstalled('git', function (gitInstalled) {
		this.gitInstalled = gitInstalled;

		if (gitInstalled) {
			this._isInstalled('hub', function (hubInstalled) {
				this.hubInstalled = hubInstalled;
				cb();
			}.bind(this));
		} else {
			cb();
		}
	}.bind(this));
};

var gitAnswers;
CallumGenerator.prototype.askGit = function () {
	if (!this.gitInstalled) {
		return;
	}

	var cb = this.async();

	var prompts = [
		{
			type: 'confirm',
			name: 'initGit',
			message: 'Would you like to initiate git here?',
			default: true
		},
		{
			type: 'confirm',
			name: 'commit',
			message: 'Make an initial commit containing generated files?',
			default: true,
			when: function (answers) {
				return answers.initGit;
			}
		},
		{
			name: 'commitMessage',
			message: 'What would you like the commit message to be?',
			default: 'Initial commit by generator-callum',
			when: function (answers) {
				return answers.initGit && answers.commit;
			}
		},
		{
			type: 'confirm',
			name: 'github',
			message: 'Create a GitHub repo?',
			default: true,
			when: function (answers) {
				return answers.initGit && this.hubInstalled;
			}.bind(this)
		},
		{
			name: 'githubRepo',
			message: 'What would you like the repo name to be?',
			default: this.props.project_name, //jshint ignore:line
			when: function (answers) {
				return answers.initGit && this.hubInstalled && answers.github;
			}.bind(this)
		},
		{
			type: 'confirm',
			name: 'pushNow',
			message: 'Push to GitHub now?',
			default: false,
			when: function (answers) {
				return answers.initGit && this.hubInstalled && answers.commit && answers.github;
			}
		}
	];

	this.prompt(prompts, function (answers) {
		gitAnswers = answers;
		cb();
	});
};

CallumGenerator.prototype.gitInit = function () {
	if (!gitAnswers.initGit) {
		return;
	}

	var cb = this.async();

	exec('git init', function () {
		console.log('Git initiated');

		if (gitAnswers.commit) {
			var commitMessage = gitAnswers.commitMessage.replace(/"/g, '\\"');
			exec('git add -A && git commit -am "' + commitMessage + '"', function () {
				console.log('committed');
				cb();
			});
		} else {
			cb();
		}
	});
};

CallumGenerator.prototype.github = function () {
	if (!gitAnswers.github) {
		return;
	}

	var cb = this.async();

	var spawnGitHub = spawn('hub', ['create', gitAnswers.githubRepo], {stdio: 'inherit'});
	spawnGitHub.on('close', function () {
		if (gitAnswers.commit && gitAnswers.pushNow) {
			exec('git push origin master', cb);
		} else {
			cb();
		}
	});
};

CallumGenerator.prototype.done = function () {
	console.log('\n\nAll done and installed!\n');
};