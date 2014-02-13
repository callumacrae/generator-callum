'use strict';

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');


function isInstalled(app, cb) {
	var cmd = spawn('which', [app]),
		installed = false;

	cmd.stdout.on('data', function () {
		installed = true;
	});

	cmd.on('close', function () {
		cb(installed);
	});
}

var CallumGenerator = yeoman.generators.Base.extend({
	init: function () {
		this.pkg = require('../package.json');
	},

	checkDeps: function () {
		var deps = ['casperjs', 'git', 'hub'],
			completed = 0,
			cb = this.async();

		this.installed = {};

		deps.forEach(function (dep) {
			isInstalled(dep, function (installed) {
				this.installed[dep] = installed;

				completed++;
				if (completed === deps.length) {
					cb();
				}
			}.bind(this));
		}.bind(this));
	},

	askFor: function () {
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
				name: 'cachedDeps',
				message: 'Should dependencies be installed from cache where possible?',
				default: false
			},
//			{
//				type: 'confirm',
//				name: 'casperInstall',
//				message: 'Do you want unit testing with CasperJS?',
//				default: false,
//				when: function () {
//					return this.installed.casperjs;
//				}.bind(this)
//			},
			{
				type: 'confirm',
				name: 'jQueryInstall',
				message: 'Would you like to install jQuery?',
				default: true
			},
			{
				type: 'confirm',
				name: 'fontLoaderInstall',
				message: 'What about webfontloader?',
				default: false
			}
		];

		this.prompt(prompts, function (props) {
			this.props = props;

			this.props.libraries = [];
			if (props.jQueryInstall) {
				this.props.libraries.push('jquery' + (props.cachedDeps ? '' : '#1.10.2'));
			}
			if (props.fontLoaderInstall) {
				this.props.libraries.push('webfontloader');
			}

			cb();
		}.bind(this));
	},

	_librariesAsync: false,
	askForLibraries: function () {
		if (!this._librariesAsync) {
			this._librariesAsync = this.async();
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
				this._librariesAsync();
			}
		}.bind(this));
	},

	staticFiles: function () {
		this.directory('.', '.');
		this.copy('.gitignore', '.gitignore'); // ?!
	},

	templateFiles: function () {
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
	},

	bowerTasks: function () {
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
	},

	installDeps: function () {
		var cb = this.async();

		this.npmInstall(null, {
			skipInstall: this.options['skip-install'],
			cacheMin: this.props.cachedDeps ? 999999 : 0
		}, function () {
			this.bowerInstall(null, {
				skipInstall: this.options['skip-install'],
				offline: this.props.cachedDeps
			}, function () {
//				this.spawnCommand('grunt', ['bower'])
//					.on('close', cb);
				cb(); // @todo: Do this
			}.bind(this));
		}.bind(this));
	},

//	installCasper: function () {
//		if (!this.props.casperInstall) {
//			return;
//		}
//
//		var cb = this.async();
//
//		this.mkdir('tests');
//		this.mkdir('tests/casperjs');
//
//		this.npmInstall(['grunt-casperjs'], {
//			cacheMin: this.props.cachedDeps ? 999999 : 0,
//			saveDev: true
//		}, cb);
//	},

	askGit: function () {
		if (!this.installed.git) {
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
					return answers.initGit && this.installed.hub;
				}.bind(this)
			},
			{
				name: 'githubRepo',
				message: 'What would you like the repo name to be?',
				default: this.props.project_name, //jshint ignore:line
				when: function (answers) {
					return answers.initGit && this.installed.hub && answers.github;
				}.bind(this)
			},
			{
				type: 'confirm',
				name: 'pushNow',
				message: 'Push to GitHub now?',
				default: false,
				when: function (answers) {
					return answers.initGit && this.installed.hub && answers.commit && answers.github;
				}.bind(this)
			}
		];

		this.prompt(prompts, function (answers) {
			this._gitAnswers = answers;
			cb();
		}.bind(this));
	},

	gitInit: function () {
		if (!this._gitAnswers.initGit) {
			return;
		}

		var cb = this.async();

		exec('git init', function () {
			console.log('Git initiated');

			if (this._gitAnswers.commit) {
				var commitMessage = this._gitAnswers.commitMessage.replace(/"/g, '\\"');
				exec('git add -A && git commit -am "' + commitMessage + '"', function () {
					console.log('Committed to Git');
					cb();
				});
			} else {
				cb();
			}
		}.bind(this));
	},

	github: function () {
		if (!this._gitAnswers.github) {
			return;
		}

		var cb = this.async();

		console.log('Creating GitHub repository...');

		var spawnGitHub = spawn('hub', ['create', this._gitAnswers.githubRepo], {stdio: 'inherit'});
		spawnGitHub.on('close', function () {
			console.log('Created GitHub repository');

			if (this._gitAnswers.commit && this._gitAnswers.pushNow) {
				console.log('Pushing to GitHub...');
				exec('git push origin master', function () {
					console.log('Pushed to GitHub');
					cb();
				});
			} else {
				cb();
			}
		}.bind(this));
	},

	done: function () {
		this.config.save();
		console.log('\n\nAll done and installed!\n\nType "gulp" to run gulp now.\n');
	}
});

module.exports = CallumGenerator;
