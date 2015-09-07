module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		copy: {
			// Copy all source files to the build directory
			source: {
				expand: true,
				cwd: 'source/',
				src: '**/*',
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
					livereload: true,
					keepalive: true
				}
			}
		}
	});

	grunt.registerTask('build',['copy:source','wiredep','connect']);
	grunt.registerTask('default',['build']);
};
