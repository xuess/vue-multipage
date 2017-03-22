/**
 * xuess
 * date 2017-03-22
 * webpack配置
 */
var path = require('path'),
	webpack = require('webpack'),
	//打包html
	//	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//独立打包样式文件
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	//公共模块单独打包
	CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
	ROOT_PATH = path.resolve(__dirname), //根目录
	OUT_PATH = "./dist/", //输出目录
	ALIAS_IGNORE_DIRS = [""], //忽略目录
	ENTRY_IGNORE_DIRS = ["commons"], //忽略目录
	alias = require('./config/alias'),
	entry = require('./config/entry');

alias.init(ROOT_PATH, ["/src/js/commons"], ALIAS_IGNORE_DIRS);
entry.init(ROOT_PATH, ["/src/js"], ENTRY_IGNORE_DIRS);

var extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
var cssLoader = extractCSS.extract(['css'])
var sassLoader = extractCSS.extract(['css', 'sass'])
var lessLoader = extractCSS.extract(['css', 'less'])
//插件配置
var plugins = [];
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
		// sourceMap: false,
		//警告 false=不打印
		compress: {
			warnings: false
		}
	})
);

module.exports = {
	//	devtool: "source-map",
	resolve: {
		//参数名的自动补全，现在可以写 require('file') 代替 require('file.js')
		extensions: ['', '.js', '.json', '.coffee', '.css', '.jsx', '.vue', '.less' ,'.scss'],
		//解析目录名的一个数组到当前目录以及先前的目录，并且是查找模块。
//		modulesDirectories: ['node_modules'],
		//设置别名，便于在开发中模块的使用
		alias: alias.getAlias({
//			jquery: ROOT_PATH + "/node_modules/jquery/dist/jquery.min.js",
//			md5: path.resolve(ROOT_PATH, "./node_modules/md5/md5.js")
		})
	},
	entry: entry.getEntrys({ 'libs': ['jquery','md5'] }),
	output: {
		path: OUT_PATH, //文件输出目录
		publicPath: OUT_PATH, //用于配置文件发布路径，如CDN或本地服务器
		filename: 'js/[name].js' //根据入口文件输出的对应多个文件名
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: cssLoader },
			{ test: /\.scss$/, loader: sassLoader },
			{ test: /\.less$/, loader: lessLoader },
			{ test: /\.(png|jpg)$/, loader: 'url-loader' },
			{ test: /\.vue$/, loader: 'vue-loader' },
			{ test: /\.html$/, loader: 'html' }
		]
	},
	plugins: plugins,
	
	devServer:{
        contentBase: './dist/',  //静态资源的目录 相对路径,相对于当前路径 默认为当前config所在的目录
        devtool: 'eval',
        hot: true,        //自动刷新
        inline: true,    
        port: 3005        
    },
};