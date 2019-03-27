# multi-html-webpack-plus

## 简介
vue-cli3 搭建的应用，通过配置 `pages`属性来支持多页应用。限制也比较多，比如页面分级以及js的引入问题。所以这个插件用于解决这样的问题。
```
npm i multi-html-webpack-plus --save-dev

// vue.config.js

const {autoScan, MultiHtmlWebpackPlus} = require('multi-html-webpack-plus')

module.exports = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new MultiHtmlWebpackPlus()
    ]
  },
  pages: autoScan // 这个自动扫描src/pages/下的所有js，构建pages对象
}
```
## autoScan返回结果
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
