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
				rjsConfig: 'app/assets/js/build.js'
			}
		},
		requirejs: {
			compile: {
				options: {
					name: 'app',
					baseUrl: 'app/assets/js',
					out: 'app/assets/build/script.js',
					mainConfigFile: 'app/assets/js/build.js',
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


	// Validation
	grunt.loadNpmTasks('grunt-html-validation');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('validate', ['jshint'/*, 'validation'*/]); // Don't run this task with others; buggy

	// Asset tasks
	grunt.loadNpmTasks('grunt-remove-logging');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('build', ['validate', 'bower', 'requirejs', 'less']);

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