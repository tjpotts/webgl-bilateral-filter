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
			images: {
				expand: true,
				cwd: 'source/',
				src: 'images/**/*',
				dest: 'build/'
			}
		},

		// Webpack
		webpack:{
			all: {
				entry: "./source/scripts/main.js",
				output: {
					path: "build/scripts",
					filename: "main.js"
				},
				module: {
					loaders: [
						{
							test: /\.js$/,
							loader: 'babel',
							exclude: /buffer/
						},
						{
							test: /\.glsl$/,
							loader: 'raw',
							exclude: /node_modules/
						}
					]
				},
				devtool: "source-map"
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
				tasks: ['webpack']
			},
			shaders: {
				files: ['source/scripts/**/*.glsl'],
				tasks: ['webpack']
			},
			images: {
				files: ['source/images/**/*'],
				tasks: ['copy:images']
			}
		}
	});

	grunt.registerTask('build',['copy','webpack','connect','watch']);
	grunt.registerTask('default',['build']);
};
