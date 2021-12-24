/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint no-console: 0 */

const fs = require('fs');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const PATHS = require('./paths');
const ALIAS = require('./alias');

const RULES = [];
fs.readdirSync(PATHS.rules).filter((filename) => RULES.push(require(`${PATHS.rules}/${filename}`)));

const PAGES_ENTRY = {
	main: `${PATHS.src}/${PATHS.entry.global}`,
};

const PAGE_EXT = (filename) => filename.endsWith('.pug') || filename.endsWith('.twig') || filename.endsWith('.html');
const PAGES_DIR = `${PATHS.src}/${PATHS.assets.templates}/${PATHS.assets.pages}`;
const DEVELOP_PAGES = fs.readdirSync(PAGES_DIR).filter((filename) => filename.startsWith('_'));
const PAGES = DEVELOP_PAGES.length > 0 ? DEVELOP_PAGES : fs.readdirSync(PAGES_DIR).filter(PAGE_EXT);

PAGES.forEach((page) => {
	const PAGE_NAME = page.replace(/^_/g, '').replace(/\.(pug|html|twig)/g, '');
	const PAGES_ENTRY_FILES = fs.readdirSync(`${PATHS.src}/${PATHS.assets.pages}`);

	if (PAGES_ENTRY_FILES.includes(`${PAGE_NAME}.js`)) {
		PAGES_ENTRY[PAGE_NAME] = {
			dependOn: PATHS.entry.global.replace(/\.(js)/g, ''),
			import: `${PATHS.src}/${PATHS.assets.pages}/${PAGE_NAME}.js`,
		};
	} else {
		console.error('\x1b[31m', `ERROR! No entry page for ${page}`, '\x1b[0m');
		delete PAGES_ENTRY.main;
		PAGES.length = 0;
	}
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
		alias: ALIAS,
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
				const PAGE_NAME = page.replace(/^_/g, '').replace(/\.(pug|html|twig)/g, '');
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
