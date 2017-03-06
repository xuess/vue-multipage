var fs = require('fs');

module.exports = {
    ROOT_PATH: undefined,
    IGNORE_DIRS: undefined,
    RELATIVE_URL: undefined,

    init: function(basePath, relativeUrl, ignoreDirs) {
        this.ROOT_PATH = basePath;
        this.RELATIVE_URL = relativeUrl;
        this.IGNORE_DIRS = ignoreDirs;
    },

    getEntrys: function(entryObj) {
        var url = this.ROOT_PATH+this.RELATIVE_URL;
        this.traverseFiles(url, entryObj);
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
            } else if(filename.indexOf(".") != 0 && filename.indexOf(".js") > -1) {
                var property = filename.substr(0, filename.lastIndexOf("."));
                var propertyValue = itemPath.replace(self.ROOT_PATH, ".");
                entryObj[property] = [propertyValue];
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