/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const PATHS = require('./paths');

const RULES = [];
fs.readdirSync(PATHS.rules.pages).filter((filename) => RULES.push(require(`${PATHS.rules.pages}/${filename}`)));

const PAGES_ENTRY = {};
PAGES_ENTRY.main = `${PATHS.src}/${PATHS.rules.global}`;

const PAGES_DIR = `${PATHS.src}/${PATHS.assets.templates}/${PATHS.assets.pages}`;

const PAGES = fs.readdirSync(PAGES_DIR).filter((filename) => {
	if (filename.endsWith('.pug') || filename.endsWith('.twig') || filename.endsWith('.html')) {
		const PAGE_EXT = `.${filename.split('.').pop()}`;
		filename = filename.replace(PAGE_EXT, '').replace('.html', '');

		PAGES_ENTRY[filename.replace(PAGE_EXT, '')] = {
			dependOn: PATHS.rules.global.replace('.js', ''),
			import: `${PATHS.src}/${PATHS.assets.pages}/${filename.replace(PAGE_EXT, '')}.js`,
		};
		return filename;
	}
	return false;
});

module.exports = {
	externals: {
		paths: PATHS,
	},
	mode: process.env.NODE_ENV,
	entry: PAGES_ENTRY,
	output: {
		path: PATHS.output,
		clean: true,
		publicPath: '/',
	},
	resolve: {
		alias: {
			'@': PATHS.src,
		},
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
					enforce: true,
				},
			},
		},
	},
	module: {
		rules: RULES,
	},
	plugins: [
		new CaseSensitivePathsPlugin(),
		new VueLoaderPlugin(),
		new CopyWebpackPlugin({
			patterns: [{
				from: `${PATHS.src}/${PATHS.assets.static}`,
				to: PATHS.output,
			}],
		}),
		...PAGES.map(
			(page) => {
				const PAGE_NAME = page.replace('.pug', '').replace('.twig', '').replace('.html', '');
				return new HtmlWebpackPlugin({
					template: `${PAGES_DIR}/${page}`,
					filename: `./${PAGE_NAME}.html`,
					chunks: ['main', `${PAGE_NAME}`],
					cache: true,
					scriptLoading: 'blocking',
					base: '/',
				});
			},
		),
		new HtmlReplaceWebpackPlugin([
			{
				pattern: / data-src="[^"]+"/g,
				replacement: '',
			},
		]),
	],
};
