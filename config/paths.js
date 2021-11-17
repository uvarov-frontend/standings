const path = require('path');

module.exports = {
	src: path.join(__dirname, '../src'),
	output: path.join(__dirname, '../build'),
	rules: {
		global: 'main.js',
		pages: path.join(__dirname, './rules'),
	},
	assets: {
		pages: 'pages',
		js: 'js',
		img: 'img',
		fonts: 'fonts',
		styles: 'styles',
		static: 'static',
		templates: 'templates',
	},
	stylesGlobal: [
		path.join(__dirname, '../src/styles/mixin.scss'),
		path.join(__dirname, '../src/styles/variables.scss'),
	],
};
