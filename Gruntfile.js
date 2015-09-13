module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		// Copy source files to the build directory
		copy: {
			html: {
				expand: true,
				cwd: 'source/',
				src: '**/*.html',
				dest: 'build/'
			},
			shaders: {
				expand: true,
				cwd: 'source/',
				src: 'scripts/**/*.glsl}',
				dest: 'build/'
			},
			images: {
				expand: true,
				cwd: 'source/',
				src: 'images/**/*',
				dest: 'build/'
			}
		},

		// Compile JSX
		babel: {
			options: {
				sourceMap: true
			},
			files: {
				expand: true,
				cwd: 'source/',
				src: 'scripts/**/*.js',
				dest: 'build/'
			}
		},

		// Wire up bower dependencies
		wiredep: {
			all: {
				src: 'build/**/*.html'
			}
		},

		// A basic static web server with livereload
		connect: {
			dev: {
				options: {
					port: 8080,
					base: ['.','build'],
					hostname: '*',
					livereload: true
				}
			}
		},

		watch: {
			options: {
				livereload: true
			},
			html: {
				files: ['source/**/*.html'],
				tasks: ['copy:html','wiredep']
			},
			js: {
				files: ['source/scripts/**/*.js'],
				tasks: ['babel']
			},
			shaders: {
				files: ['source/scripts/**/*.glsl'],
				tasks: ['copy:shaders']
			},
			images: {
				files: ['source/images/**/*'],
				tasks: ['copy:images']
			}
		}
	});

	grunt.registerTask('build',['copy','babel','wiredep','connect','watch']);
	grunt.registerTask('default',['build']);
};
