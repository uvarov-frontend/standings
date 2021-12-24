const path = require('path');

module.exports = {
	src: path.join(__dirname, '../src'),
	output: path.join(__dirname, '../build'),
	rules: path.join(__dirname, './rules'),
	entry: {
		global: 'main.js',
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
