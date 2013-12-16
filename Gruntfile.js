var fs = require('fs'),
	DEBUG;

/* jshint camelcase: false */

module.exports = function (grunt) {
	'use strict';

	DEBUG = grunt.cli.tasks[0] !== 'build';

	var config = {
		generateValidationReport: false,
		validateOnWatch: false
	}, gruntConfig = {
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			files: {
				src: ['app/assets/js/*.js', 'Gruntfile.js'],
				options: {
					jshintrc: true
				}
			}
		},
		validation: {
			options: {
				stoponerror: true
			},
			files: {
				src: [
					'app/**/*.html'
				]
			}
		},


		requirejs: {
			compile: {
				options: {
					name: 'app',
					baseUrl: 'app/assets/js',
					out: 'app/assets/build/script.js',
					include:  ['lib/require']
				}
			}
		},
		less: {
			files: {
				options: {
					paths: ['app/assets/less', 'app/assets/css'],
					cleancss: true
				},
				files: {
					'app/assets/build/style.css': 'app/assets/less/style.less'
				}
			}
		},

		shell: {
			watchers: {
				command: '(grunt watch && echo) & grunt browser_sync',
				options: {
					stdout: true
				}
			}
		},

		browser_sync: {
			files: {
				src : [
					'app/assets/build/style.css',
					'app/assets/css/**/*.css',
					'<%= requirejs.compile.options.out %>',
					'app/assets/imgs/**/*.jpg',
					'app/assets/imgs/**/*.png',
					'app/**/*.php',
					'app/**/*.html'
				],
				options: {
					server: {
						baseDir: './app/'
					},
					ghostMode: {
						scroll: true,
						links: true,
						forms: true
					}
				}
			}
		},

		watch: {
			less: {
				files: ['app/assets/less/style.less'],
				tasks: ['less'],
				options: {
					interrupt: true
				}
			},

			scripts: {
				files: ['<%= requirejs.compile.options.baseUrl %>/**/*.js'],
				tasks: ['requirejs'],
				options: {
					interrupt: true
				}
			}
		}
	};

	if (config.validateOnWatch) {
		gruntConfig.watch.scripts.tasks.unshift('validate');
	}
	if (!config.generateValidationReport) {
		gruntConfig.validation.options.reportpath = false;
	}

	var requireOptionsFile = JSON.parse(fs.readFileSync('app/assets/js/build.json'));
	mergeRequireOptions(gruntConfig.requirejs.compile.options, requireOptionsFile);

	grunt.initConfig(gruntConfig);


	// Validation
	grunt.loadNpmTasks('grunt-html-validation');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('validate', ['jshint'/*, 'validation'*/]); // Commented because buggy

	// Asset tasks
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('build', ['validate', 'requirejs', 'less']);

	// Watchers
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('watchers', ['shell:watchers']);
	grunt.registerTask('default', ['build', 'watchers']);

	// Misc
	grunt.loadNpmTasks('grunt-notify');

	grunt.registerTask('default', ['build', 'shell:watchers']);

};

function mergeRequireOptions(options, newOptions) {
	'use strict';

	for (var option in newOptions) {
		if (!newOptions.hasOwnProperty(option)) {
			return;
		}

		if (option === 'include' && options.include) {
			/* jshint loopfunc: true */
			newOptions.forEach(function (include) {
				if (options.include.indexOf(include) == -1) {
					options.include.add(include);
				}
			});

			continue;
		} else if (option === 'requirejs' && DEBUG) {
			if (options.uglify && options.uglify.defines && options.uglify.defines.DEBUG) {
				options.uglify.defines.DEBUG[1] = true;
			}
		} else if (option === 'dev') {
			if (DEBUG) {
				mergeRequireOptions(options, newOptions.dev);
			}
			continue;
		} else if (option === 'prod') {
			if (!DEBUG) {
				mergeRequireOptions(options, newOptions.prod);
			}
			continue;
		}

		options[option] = newOptions[option];
	}
}