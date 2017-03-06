/**
 * xuess
 * webpack配置
 */
var path = require('path'),
	webpack = require('webpack'),
	glob = require('glob'),
	//打包html
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//独立打包样式文件
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
	srcDir = path.resolve(process.cwd(), 'src'),
	ROOT_PATH = path.resolve(__dirname),
	OUT_PATH = "./dist/",
	ALIAS_IGNORE_DIRS = [""],
	ENTRY_IGNORE_DIRS = ["commons"], //忽略目录
	alias = require('./config/alias'),
	entry = require('./config/entry');

alias.init(ROOT_PATH, ["/src/js/commons"], ALIAS_IGNORE_DIRS);
entry.init(ROOT_PATH, ["/src/js"], ENTRY_IGNORE_DIRS);

var extractCSS = new ExtractTextPlugin('css/[name].css?[contenthash]')
var cssLoader = extractCSS.extract(['css'])
var sassLoader = extractCSS.extract(['css', 'sass'])
var lessLoader = extractCSS.extract(['css', 'less'])

//var entries = function() {
//	var jsDir = path.resolve(srcDir, 'js')
//	var entryFiles = glob.sync(jsDir + '/*.{js,jsx}')
//	var map = {};
//
//	for(var i = 0; i < entryFiles.length; i++) {
//		var filePath = entryFiles[i];
//		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
//		map[filename] = filePath;
//	}
//	return map;
//}
//var html_plugins = function() {
//	var entryHtml = glob.sync(srcDir + '/*.html')
//	var r = []
//	var entriesFiles = entries()
//	for(var i = 0; i < entryHtml.length; i++) {
//		var filePath = entryHtml[i];
//		var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
//		var conf = {
//			template: 'html!' + filePath,
//			filename: filename + '.html'
//		}
//		//如果和入口js文件同名
//		if(filename in entriesFiles) {
//			conf.inject = 'body'
//			conf.chunks = ['vendor', filename]
//		}
//		//跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
//		//if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
//		r.push(new HtmlWebpackPlugin(conf))
//	}
//	return r
//};

//插件配置
var plugins = [];
plugins.push(extractCSS);
///webpack.ProvidePlugin插件作用是jquery变成全局，所以不需要引用就能在js文件中运用
plugins.push(new webpack.ProvidePlugin({
	"jQuery": "jquery",
	"$": "jquery"
}));
plugins.push(new CommonsChunkPlugin({
	name: 'libs',
	minChunks: Infinity
}));
plugins.push(new webpack.optimize.UglifyJsPlugin({
	mangle: {
		except: ['$', 'jQuery']
	},
	// sourceMap: false,
	compress: {
		warnings: false
	}
}));
//DefinePlugin 接收字符串插入到代码当中, 可以写上 JS 的字符串或常量
plugins.push(new webpack.DefinePlugin({
	__TEST_SERVER__: false, //true：请求测试环境数据，false：请求线上环境数据
	__COOKIE__: JSON.stringify(""), //测试cookie 22:YveSjjGMrik=  20:4uCmFZS2TXc=
	__OPEN_LOG__: false, //true:打日志，false:关闭日志
}));

module.exports = {
	//devtool: "source-map",
	resolve: {
		//参数名的自动补全，现在可以写 require('file') 代替 require('file.js')
		extensions: ['', '.js', '.json', '.coffee', '.css', '.jsx', '.vue'],
		//解析目录名的一个数组到当前目录以及先前的目录，并且是查找模块。
		modulesDirectories: ['node_modules'],
		//设置别名，便于在开发中模块的使用
		alias: alias.getAlias({
			jquery: path.resolve(ROOT_PATH, "./node_modules/jquery/dist/jquery.min.js"),
			md5: path.resolve(ROOT_PATH, "./node_modules/md5/md5.js"),
			//swiperjs: path.resolve(ROOT_PATH, "./node_modules/swiper/dist/js/swiper.min.js"),
			// fastclick : path.resolve(ROOT_PATH, "./node_modules/fastclick/lib/fastclick.js")
		}),
		//绝对路径
		publicPath: '/'
	},
	//	entry: entry.getEntrys({}),
	entry: entry.getEntrys({ 'libs': ['jquery'] }),

	output: {
		path: OUT_PATH, //文件输出目录
		publicPath: OUT_PATH, //用于配置文件发布路径，如CDN或本地服务器
		//		publicPath: "/",
		//publicPath: debug ? '/__build/' : 'http://cdn.site.com/'
		filename: 'js/[name].js' //根据入口文件输出的对应多个文件名
	},
	module: {
		loaders: [
			//			 {
			//			     test: /\.(png|jpe?g|eot|svg|ttf|woff2?)$/,
			//			     loader: "file?name=img/[hash:8].[name].[ext]"
			//			 },
			//			{
			//	            test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
			//	            loaders: [
			//	                // 小于10KB的图片会自动转成dataUrl
			//	                'url?limit=10240&name=img/[hash:8].[name].[ext]',
			//	                'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
			//	            ]
			//	        },
			//			{ test: /\.scss$/, loader: 'style!css!sass'},
			//			{ test: /\.css$/, loader: 'style-loader!css-loader' },
			//			{
			//				test: /\.less$/,
			//				loader: ("style-loader!css-loader!less-loader")
			//			},
			{ test: /\.css$/, loader: cssLoader },
			{ test: /\.scss$/, loader: sassLoader },
			{ test: /\.less$/, loader: lessLoader },
			{ test: /\.(png|jpg)$/, loader: 'url-loader' },
			//			{
			//				test: /\.jsx?$/,
			//				exclude: /(node_modules|bower_components)/,
			//				loader: 'babel?cacheDirectory'
			//			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.html$/,
				loader: 'html'
			}
		]
	},
	//	// 自动添加前缀的插件
	//	postcss: [
	//		require('autoprefixer') //调用autoprefixer插件
	//	],
	plugins: plugins
};
/*new webpack.optimize.CommonsChunkPlugin(
        	{
        		name: "common",
				filename: "js/common.js",
				chunks: ["utils","activity","ajax","downtimer","lxlib"]
        	}
        ),*/