# webpack 2.0 多页面应用

### 使用过程


- [x] node >=6.0
- [x] npm >=3.0
- [x] webpack >=2.0


```
//全局安装 webpack webpack-dev-server
npm install -g webpack webpack-dev-server
//装依赖包
npm install 
//运行webpack-dev-server 及时刷新
npm run start
//开发环境打包 + 监听
npm run dev
//发布打包（压缩）-p
npm run build

```




> 2017-06-05更新摘要

1. 精简获取`html实体`方法。
2. `package.json`,版本号固定，删除`^`符号
2. 增加命令行参数传入判断，如`webpack master2 -p` ，这样只会打包`src`下的 `master`目录。
3. 修正es6支持，增加`.js`文件的`loader`。
4. 增加对`postcss`支持。
4. 优化`webpack.server.js`文件。
5. 删除对`sass`支持，删除js公用`libs`配置（注释掉了）。
6. 增加css热更新（修改css不刷新，动态改变样式），增加配置，html会不自动刷新，所以，开发单页面可以放开那个配置。在`webpack.server.js`文件中。