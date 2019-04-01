# multi-html-webpack-plus

## 简介
vue-cli3 搭建的应用，通过配置 `pages`属性来支持多页应用。
有时候在部署的时候，可能会把dist整个目录部署在一个不确定的目录下面。
`vue.config.js`中提供了`publicPath`可以配置，但是由于可能存在的目录不确定性，如果一单更改目录就需要去更改配置。
也是比较麻烦，所以在相对路径构建的时候`MultiHtmlWwebpackPlus`会通过层级追加`../`最终形成相对路径注入到`html`中。

安装
```
npm i multi-html-webpack-plus --save-dev
```
配置
```
// vue.config.js

const {autoScan, MultiHtmlWebpackPlus} = require('multi-html-webpack-plus')

module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new MultiHtmlWebpackPlus()
    ]
  },
  pages: autoScan({appDir: 'pages'}) // 这个自动扫描src/pages/下的所有js，构建pages对象
}
```
## autoScan
同时提供了autoScan方法自动扫描`src/`目录下某个文件夹的多页文件
如下返回实例就扫描`src/pages`下的页面。
```
{
	'a/a.js': {
		entry: 'src/pages/a/a.js',
		template: 'src/pages/a/a.html',
		filename: 'pages/a/a.html'
	},
	'a/c/c.js': {
		entry: 'src/pages/a/c/c.js',
		template: 'src/pages/a/c/c.html',
		filename: 'pages/a/c/c.html'
	},
	'b/b.js': {
		entry: 'src/pages/b/b.js',
		template: 'src/pages/b/b.html',
		filename: 'pages/b/b.html'
	},
	'b/c/c.js': {
		entry: 'src/pages/b/c/c.js',
		template: 'src/pages/b/c/c.html',
		filename: 'pages/b/c/c.html'
	}
}
```
