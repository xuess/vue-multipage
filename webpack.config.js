/**
 * xuess
 * date 2017-03-22
 * lastdate 2017-06-05
 * webpack配置
 */
const path = require('path'),
	webpack = require('webpack'),
	autoprefixer = require('autoprefixer'),
	yargs = require('yargs').argv,
	//打包html
	HtmlWebpackPlugin = require('html-webpack-plugin'),
	//独立打包样式文件
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	//公共模块单独打包
	CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
	NODE_ENV = yargs.p,//true == production ,false == development
//	NODE_ENV = yargs.p ? '"production"':'"development"',
	ROOT_PATH = path.resolve(__dirname), //根目录
	OUT_PATH = ROOT_PATH + '/dist/', //输出目录
	alias = require('./config/alias'),
	entry = require('./config/entry');
	
let	buildFileName = '';//打包目录名称
//捕获命令行输入 的 目录名称
if(!!yargs._[0]){
	buildFileName = '/' + yargs._[0];
}
alias.init(ROOT_PATH, ['/src/commons/js'], ['']);
entry.init(ROOT_PATH, ['/src' + buildFileName]);

//css 相关配置
const extractCSS = new ExtractTextPlugin({
	//禁用插件，用于热加载
	disable: !yargs.p,
	filename: (getPath) => {
		return getPath('[name].css').replace('js', 'css');
	}
});
const cssLoader = extractCSS.extract({
	fallback: 'style-loader',
	use: ['css-loader','postcss-loader']
});
//const sassLoader = extractCSS.extract({
//	fallback: 'style-loader',
//	use: ['css-loader', 'sass-loader','postcss-loader']
//});
const lessLoader = extractCSS.extract({
	fallback: 'style-loader',
	use: ['css-loader', 'less-loader', 'postcss-loader']
});

//设置html 配置
var html_plugins = function() {
	var entryHtmlList = entry.getHtmlEntrys({});
	var r = [];
	//	var entriesFiles = entry.getEntrys({});
	for(let temp in entryHtmlList) {
		var filePath = entryHtmlList[temp];
		var filename = temp;

		var conf = {
			template: filePath,
			//template: 'html!'+filePath,
			filename: filename + '.html',
			inject: false
		}
		//如果和入口js文件同名
		//if (filename in entriesFiles) {
		//    conf.inject = 'body'
		//    conf.chunks = ['vendor', filename]
		//}
		//跨页面引用，如pageA,pageB 共同引用了common-a-b.js，那么可以在这单独处理
		//if(pageA|pageB.test(filename)) conf.chunks.splice(1,0,'common-a-b')
		r.push(new HtmlWebpackPlugin(conf))
	}
	return r;
}

//插件配置
const plugins = [];
plugins.push(
	extractCSS
	//	//打包公用库
	//	new CommonsChunkPlugin({
	//		name: 'libs',
	//		minChunks: Infinity
	//	})
	//	//混淆压缩，忽略$ jQuery
	//	new webpack.optimize.UglifyJsPlugin({
	//		mangle: {
	//			except: ['$', 'jQuery']
	//		},
	////		sourceMap: true,
	//		//警告 false=不打印
	//		compress: {
	//			warnings: false
	//		}
	//	})
	//	//压缩
	//	new webpack.LoaderOptionsPlugin({
	//		minimize: true
	//	})
);

module.exports = {
//	devtool: NODE_ENV ? false : 'cheap-module-source-map',
	resolve: {
		modules: [
			path.join(__dirname, 'src'),
			'node_modules'
		],
		//取模块
		alias: alias.getAlias({
			//jquery: path.resolve(__dirname, './node_modules/jquery/dist/jquery.js')
			vue: ROOT_PATH + '/node_modules/vue/dist/vue.min.js'
		}),
		//参数名的自动补全，现在可以写 require('file') 代替 require('file.js')
		//extensions: ['.js', '.pug', '.css', '.scss', '.sass', '.less','.vue'],
		extensions: ['.js', '.pug', '.css', '.less', '.vue'],
		unsafeCache: false
	},

	entry: entry.getJsEntrys({
//		'commons/libs': ['']
	}),
	output: {
		path: OUT_PATH, //文件输出目录
		publicPath: '/',
		//publicPath: OUT_PATH, //用于配置文件发布路径，如CDN或本地服务器
		filename: '[name].js' //根据入口文件输出的对应多个文件名,
	},
	module: {
		rules: [{
				test: /\.css$/,
				loader: cssLoader
			},
			//{ test: /\.scss$/, loader: sassLoader },
			{
				test: /\.less$/,
				loader: lessLoader
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]'
			},
			//{
			//		test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
			//	    loaders: [
			//	       //小于10KB的图片会自动转成dataUrl，
			//	       'url?limit=10000&name=img/[hash:8].[name].[ext]',
			//	       'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
			//		]
			//},
			{
				test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
				loader: 'url-loader?limit=10000&name=fonts/[hash:8].[name].[ext]'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					//生产环境压缩
					minimize: NODE_ENV ? true : false,
					//removeComments: false,
					//collapseWhitespace: false,
					//removeAttributeQuotes: false,
				}
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			}
		]
	},
	plugins: plugins.concat(html_plugins())
};