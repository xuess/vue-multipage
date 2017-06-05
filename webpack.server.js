/**
 * xuess
 * date 2017-03-22
 * webpack server配置
 */

const webpack = require('webpack')
const path = require('path')
const webpackMerge = require('webpack-merge')
const commonConfig = require('./webpack.config.js')

module.exports = webpackMerge(commonConfig, {
	output: {
		publicPath: '/'
	},
	devServer: {
		//实时刷新
		inline: true,
		port: 8088,
		host: '127.0.0.1',
		//不跳转
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 3000,
			poll: 1000
		},
		stats: {
			colors: true
		},
		//本地服务器所加载的页面所在的目录
		contentBase: path.resolve('dist')
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				context: '/',
				postcss: []
			},
			//不压缩
			minimize: false,
			//开启debug
			debug: true,
			comments: true
		})
	]
})