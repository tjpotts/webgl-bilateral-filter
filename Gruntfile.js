module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		copy: {
			// Copy all source files to the build directory
			html: {
				expand: true,
				cwd: 'source/',
				src: '**/*.html',
				dest: 'build/'
			},
			scripts: {
				expand: true,
				cwd: 'source/',
				src: 'scripts/**/*.{js,glsl}',
				dest: 'build/'
			},
			images: {
				expand: true,
				cwd: 'source/',
				src: 'images/**/*',
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
				tasks: ['copy:scripts']
			},
			shaders: {
				files: ['source/scripts/**/*.glsl'],
				tasks: ['copy:scripts']
			},
			images: {
				files: ['source/images/**/*'],
				tasks: ['copy:images']
			}
		}
	});

	grunt.registerTask('build',['copy','wiredep','connect','watch']);
	grunt.registerTask('default',['build']);
};
