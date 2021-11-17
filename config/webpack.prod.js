const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const common = require('./webpack.common.js');

module.exports = merge(common, {
	devtool: false,
	output: {
		filename: `${common.externals.paths.assets.js}/[name].[contenthash:6].js`,
	},
	performance: {
		maxEntrypointSize: 1024000,
		maxAssetSize: 1024000,
	},
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
			}),
		],
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			generateStatsFile: true,
			statsOptions: {
				source: false,
			},
		}),
		new CompressionPlugin({
			test: /\.(js|css|html)$/i,
		}),
		new MiniCssExtractPlugin({
			filename: `${common.externals.paths.assets.styles}/[name].[contenthash:6].css`,
			linkType: false,
		}),
		new HtmlBeautifyPlugin({
			config: {
				html: {
					end_with_newline: true,
					indent_size: 2,
					indent_with_tabs: true,
					indent_inner_html: true,
					preserve_newlines: true,
					inline: [],
				},
			},
			replace: ['type="text/javascript"'],
		}),
	],
});
