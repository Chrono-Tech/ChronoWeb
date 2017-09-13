'use strict';

module.exports = {
	entry: {
		swiper: './src/js/swiper.jquery',
		common: './src/js/common'
	},
	output: {
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			loader: 'babel-loader',
			options: {
				presets: ['es2015']
			}
		}]
	},
	// devtool: 'inline-source-map',
	watch: true,
	watchOptions: {
		aggregateTimeout: 100
	}
};
