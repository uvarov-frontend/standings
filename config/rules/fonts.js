const PATHS = require('../paths');

module.exports = {
	test: /\.(woff|woff2|eot|ttf|otf)$/i,
	type: 'asset/resource',
	generator: {
		filename: `${PATHS.assets.fonts}/[name].[contenthash:6][ext]`,
	},
};
