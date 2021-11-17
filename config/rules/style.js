const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PATHS = require('../paths');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
	test: /\.(css|s[ac]ss)$/i,
	use: [
		{
			loader: MiniCssExtractPlugin.loader,
		},
		{
			loader: 'css-loader',
			options: {
				sourceMap: !isProd,
			},
		},
		{
			loader: 'postcss-loader',
			options: {
				sourceMap: !isProd,
			},
		},
		{
			loader: 'sass-loader',
			options: {
				sourceMap: !isProd,
			},
		},
		{
			loader: 'sass-resources-loader',
			options: {
				resources: PATHS.stylesGlobal,
			},
		},
		{
			loader: 'glob-import-loader',
		},
	],
};
