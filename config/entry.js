var fs = require('fs');

module.exports = {
	ROOT_PATH: undefined, // 根目录
	IGNORE_DIRS: undefined, //忽略目录
	RELATIVE_URL: undefined, // 相对路径
	EXT_NAME: undefined, // 获取文件的扩展名 .js 、 .html

	init: function(basePath, relativeUrl, ignoreDirs, extName) {
		this.ROOT_PATH = basePath;
		this.RELATIVE_URL = relativeUrl;
		this.IGNORE_DIRS = ignoreDirs;
		this.EXT_NAME = extName;
	},

	getJsEntrys: function(entryObj) {
		var url = this.ROOT_PATH + this.RELATIVE_URL;
		this.EXT_NAME = '.js';
		this.IGNORE_DIRS = ['commons'];
		this.traverseFiles(url, entryObj);
		console.log('----------------entryList start---------------',this.EXT_NAME);
		console.log(entryObj);
		console.log('----------------entryList end---------------',this.EXT_NAME);
		return entryObj;
	},
	getHtmlEntrys: function(entryObj) {
		var url = this.ROOT_PATH + this.RELATIVE_URL;
		this.EXT_NAME = '.html';
		this.traverseFiles(url, entryObj);
		console.log('----------------entryList start---------------',this.EXT_NAME);
		console.log(entryObj);
		console.log('----------------entryList end---------------',this.EXT_NAME);
		return entryObj;
	},

	traverseFiles: function(url, entryObj) {
		var self = this;
		var files = fs.readdirSync(url);
		files.forEach(function(filename) {
			var itemPath = url + '/' + filename;
			var stats = fs.statSync(itemPath);
			if(stats.isDirectory()) {
				if(!self.isIgnoreDir(filename)) {
					self.traverseFiles(itemPath, entryObj);
				}
			} else if(filename.indexOf(".") != 0 && filename.indexOf(self.EXT_NAME) > -1) {
				var property = filename.substr(0, filename.lastIndexOf("."));
				var propertyValue = itemPath;
				//var propertyValue = itemPath.replace(self.ROOT_PATH, ".");
				//entryObj[property] = [propertyValue];
				//文件名重新定义
				//var nameValue = propertyValue.substring(propertyValue.indexOf('js/')+3,propertyValue.indexOf('.js'));
				var nameValue = propertyValue.substring(propertyValue.indexOf('src/') + 4, propertyValue.indexOf(self.EXT_NAME));
				if(self.EXT_NAME == '.js'){
					entryObj[nameValue] = [propertyValue];
				}else{
					entryObj[nameValue] = propertyValue;
				}
			}
		});
	},

	isIgnoreDir: function(dir) {
		var isIgnore = false;
		this.IGNORE_DIRS.forEach(function(v) {
			if(dir == v) {
				isIgnore = true;
			}
		});
		return isIgnore;
	},

};