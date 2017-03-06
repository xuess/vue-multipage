var fs = require('fs');
var path = require('path');

module.exports = {
    ROOT_PATH: undefined,
    IGNORE_DIRS: undefined,
    RELATIVE_URL: undefined,

    init: function(basePath, relativeUrl, ignoreDirs) {
        this.ROOT_PATH = basePath;
        this.RELATIVE_URL = relativeUrl;
        this.IGNORE_DIRS = ignoreDirs;
    },

    getAlias: function(aliasObj) {
        var self = this;
        self.RELATIVE_URL.forEach(function(itemUrl) {
            var url = self.ROOT_PATH+itemUrl;
            self.traverseFiles(url, aliasObj);
        });
        return aliasObj;
    },

    traverseFiles: function(url, aliasObj) {
        var self = this;
        var files = fs.readdirSync(url);
        files.forEach(function(filename) {
            var itemPath = url + '/' + filename;
            var stats = fs.statSync(itemPath);
            if(stats.isDirectory()) {
                if(!self.isIgnoreDir(filename)) {
                    self.traverseFiles(itemPath, aliasObj);
                }
            } else if(filename.indexOf(".") != 0) {
                var property = filename.substr(0, filename.lastIndexOf("."));
                if(filename.indexOf(".css") > -1) {
                    property = "css"+property;
                }
                var propertyValue = itemPath.replace(self.ROOT_PATH, ".");
                aliasObj[property] = path.resolve(self.ROOT_PATH, propertyValue);
            }
        });
    },

    isIgnoreDir: function(dir) {
        var isIgnore = false;
        this.IGNORE_DIRS.forEach(function(v){
            if(dir == v) {
                isIgnore = true;
            }
        });
        return isIgnore;
    },

};