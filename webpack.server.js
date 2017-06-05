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
	devServer: {
		//实时刷新
//		inline: true,
		port: 8088,
		host: '127.0.0.1',
		//不跳转
		historyApiFallback: true,
		watchOptions: {
			aggregateTimeout: 300,
			poll: 1000
		},
		stats: {
			colors: true
		},
		// 开启服务器的模块热替换(HMR) 开启会影响html 刷新，单页面可以开启
//		hot: true,
		// 输出文件的路径
	    contentBase: path.join(__dirname, 'dist'),
	    // 和上文 output 的“publicPath”值保持一致
	    publicPath: '/'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new webpack.HotModuleReplacementPlugin()
	]
})