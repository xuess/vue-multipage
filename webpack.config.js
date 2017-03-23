/**
 * xuess
 * date 2017-03-22
 * webpack配置
 */
const path = require('path'),
	webpack = require('webpack'),
	fs = require('fs'),
	//打包html
	//	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//独立打包样式文件
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	//公共模块单独打包
	CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
	ROOT_PATH = path.resolve(__dirname), //根目录

	OUT_PATH = ROOT_PATH + "/dist/", //输出目录
	SRC_PATH = ROOT_PATH + "/src/js", //源代码目录
	ALIAS_IGNORE_DIRS = [""], //忽略目录
	ENTRY_IGNORE_DIRS = ["commons"], //忽略目录
	alias = require('./config/alias'),
	entry = require('./config/entry');

alias.init(ROOT_PATH, ["/src/js/commons"], ALIAS_IGNORE_DIRS);
entry.init(ROOT_PATH, ["/src/js"], ENTRY_IGNORE_DIRS);

const extractCSS = new ExtractTextPlugin({
	filename: "css/[name].css"
});
//var extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
const cssLoader = extractCSS.extract({
	fallback: "style-loader",
	use: ['css-loader']
});
const sassLoader = extractCSS.extract({
	fallback: "style-loader",
	use: ['css-loader', 'sass-loader']
});
const lessLoader = extractCSS.extract({
	fallback: "style-loader",
	use: ['css-loader', 'less-loader']
});

//插件配置
const plugins = [];
plugins.push(
	extractCSS,
	///webpack.ProvidePlugin插件作用是jquery变成全局，所以不需要引用就能在js文件中运用
	new webpack.ProvidePlugin({
		"jQuery": "jquery",
		"$": "jquery"
	}),
	//打包公用库
	new CommonsChunkPlugin({
		name: 'libs',
		minChunks: Infinity
	}),
	//混淆压缩，忽略$ jQuery
	new webpack.optimize.UglifyJsPlugin({
		mangle: {
			except: ['$', 'jQuery']
		},
//		sourceMap: true,
		//警告 false=不打印
		compress: {
			warnings: false
		}
	})
//	//压缩
//	new webpack.LoaderOptionsPlugin({
//		minimize: true
//	})
);

module.exports = {
//	devtool: "source-map",
	resolve: {
		modules: [
			path.join(__dirname, "src"),
			"node_modules"
		],
		//取模块
		alias: alias.getAlias({
//			jquery: path.resolve(__dirname, "./node_modules/jquery/dist/jquery.js")
		}),
		//参数名的自动补全，现在可以写 require('file') 代替 require('file.js')
		extensions: ['.js', '.pug', '.css', '.scss', '.sass', '.less'],
		unsafeCache: false
	},

	entry: entry.getEntrys({ 'libs': ['jquery'] }),
	output: {
		path: OUT_PATH, //文件输出目录
		publicPath: OUT_PATH, //用于配置文件发布路径，如CDN或本地服务器
		filename: 'js/[name].js' //根据入口文件输出的对应多个文件名
	},
	module: {
		rules: [
			{ test: /\.css$/, loader: cssLoader },
			{ test: /\.scss$/, loader: sassLoader },
			{ test: /\.less$/, loader: lessLoader },
			{ test: /\.(png|jpg)$/, loader: 'url-loader' },
			{ test: /\.vue$/, loader: 'vue-loader' },
			{ test: /\.html$/, loader: 'html' }
		]
	},
	plugins: plugins
	//	,
	//	
	//	devServer:{
	//      contentBase: './dist/',  //静态资源的目录 相对路径,相对于当前路径 默认为当前config所在的目录
	//      devtool: 'eval',
	//      hot: true,        //自动刷新
	//      inline: true,    
	//      port: 3005        
	//  }
};