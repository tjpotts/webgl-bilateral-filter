var path = require('path');
var node_modules = path.resolve(__dirname,'node_modules');
var reactPath = path.resolve(node_modules, 'react/dist/react-with-addons.js');

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
				entry: "./source/index.js",
				resolve: {
					alias: {
						'react': reactPath
					}
				},
				output: {
					path: "build",
					filename: "index.js"
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
						},
						{
							test: /\.css$/,
							loader: 'style!css'
						},
						{
							test: /\.scss$/,
							loader: 'style!css!sass'
						}
					],
					noParse: reactPath
				},
				devtool: "source-map"
			}
		},

		// A basic static web server with livereload
		connect: {
			dev: {
				options: {
					port: 8080,
					base: ['build'],
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
				tasks: ['copy:html']
			},
			webpack: {
				files: ['source/**/*.{js,glsl,css,scss}'],
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
