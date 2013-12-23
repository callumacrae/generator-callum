/* jshint camelcase: false */

module.exports = function (grunt) {
	'use strict';

	var DEBUG = (grunt.cli.tasks[0] !== 'build');

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
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			}
		},
		lesslint: {
			src: ['app/assets/less/**/*.less']
		},
		validation: {
			options: {
				stoponerror: true,
				reset: true
			},
			files: {
				src: [
					'app/**/*.html'
				]
			}
		},


		bower: {
			target: {
				rjsConfig: 'app/assets/js/build.js',
				options: {
					exclude: ['requirejs']
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					name: 'app',
					baseUrl: 'app/assets/js',
					out: 'app/assets/build/script.js',
					mainConfigFile: 'app/assets/js/build.js',
					include:  ['bower/requirejs/require']
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

		concurrent: {
			watchers: ['watch', 'browser_sync'],
			options: {
				logConcurrentOutput: true
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
				files: ['<%= requirejs.compile.options.baseUrl %>/**/*.js', '!app/assets/js/bower/**.*.js'],
				tasks: ['requirejs'],
				options: {
					interrupt: true
				}
			},

			bower: {
				files: ['app/assets/js/bower/**.*.js'],
				tasks: ['bower', 'requirejs'],
				options: {
					interrupt: true
				}
			},

			casperjs: {
				options: {
					async: {
						parallel: false
					}
				},
				files: ['tests/casperjs/**/*.js']
			}
		}
	};

	if (config.validateOnWatch) {
		gruntConfig.watch.scripts.tasks.unshift('validate');
	}
	if (!config.generateValidationReport) {
		gruntConfig.validation.options.reportpath = false;
	}

	// Minify and remove debug when DEBUG is false
	if (DEBUG) {
		gruntConfig.requirejs.compile.options.optimize = 'none';
	} else {
		gruntConfig.requirejs.compile.options.preserveLicenseComments = false;
		gruntConfig.requirejs.compile.options.uglify = {
			defines: {
				DEBUG: ['name', false]
			}
		};
	}

	grunt.initConfig(gruntConfig);


	// Load all grunt tasks. Keep package.json up to date!
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.registerTask('validate', ['jshint', 'lesslint'/*, 'validation'*/]); // Validation is buggy
	grunt.registerTask('build', ['validate', 'bower', 'requirejs', 'less']);
	grunt.registerTask('watchers', ['concurrent:watchers']);
	grunt.registerTask('test', ['casperjs']);
	grunt.registerTask('default', ['build', 'watchers']);

};