const PATHS = require('../paths');
const ALIAS = require('../alias');

module.exports = {
	test: /\.js$/,
	include: PATHS.src,
	exclude: /node_modules/,
	use: [
		{
			loader: 'babel-loader',
			options: {
				presets: ['@babel/preset-env'],
			},
		},
		{
			loader: 'glob-import-loader',
			options: {
				resolve: {
					alias: ALIAS,
				},
			},
		},
	],
};
