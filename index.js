const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const MultiPagesUtil = {}

function resolveProjectPath(){
  return path.join(__dirname, '../../')
}

function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}
const srcDir = resolve('src')
let appDir = path.resolve(srcDir, 'pages')
const addPage = function (files, filePath) {
  const entry = filePath.replace(resolveProjectPath(), '').replace(/\\/g, '/')
  const jsName = entry.substring(entry.indexOf('pages') + 6)
  const template = entry.replace(/js$/, 'html')
  const filename = template.substring(template.indexOf('src/') + 4)
  files[jsName] = {
    entry: entry,
    template: template,
    filename: filename
  }
}
const getPages = (p = appDir) => {
  const dirs = fs.readdirSync(p)
  let matchs = []
  let files = {}

  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/) // 检查是否是js
    const filePath = path.resolve(p, item)
    if (matchs) { // 是js
      addPage(files, filePath)
    } else {
      const isDir = fs.lstatSync(filePath).isDirectory()
      if (isDir) {
        files = Object.assign({}, files, getPages(filePath))
      }
    }
  })
  return files
}
const DEFAULT_OPTIONS = {

}
const autoScan = (options) => {
  const opt = _.extend({}, DEFAULT_OPTIONS, options)
  if (opt.appDir) {
    appDir = path.resolve(srcDir, opt.appDir)
  }
  return getPages()
}

function MultiHtmlWebpackPlus () {}
MultiHtmlWebpackPlus.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-before-html-generation', function (htmlPluginData) {
      const {assets, plugin } = htmlPluginData
      const fileName = plugin.options.filename
      const hierarchy = fileName.split('/').length - 1
      let hierarchyEntry = []
      for (let i = 0; i < hierarchy; i++) {
        hierarchyEntry.push('../')
      }
      hierarchyEntry = hierarchyEntry.join('')
      if (hierarchyEntry) {
        assets.publicPath = ''
        assets.js = assets.js.map(v => {
          return hierarchyEntry + v
        })
        assets.css = assets.css.map(v => {
          return hierarchyEntry + v
        })
        const chunks = assets.chunks
        for (let key in chunks) {
          chunks[key].entry = hierarchyEntry + chunks[key].entry
          chunks[key].css = chunks[key].css.map(v => {
            return hierarchyEntry + v
          })
        }
      }
      htmlPluginData.assets = assets
      return Promise.resolve()
        .then(() => {
          return htmlPluginData
        })
    })
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData) {
      const assetTags = htmlPluginData
      const fileName = assetTags.plugin.options.filename
      const hierarchy = fileName.split('/').length - 1
      let hierarchyEntry = []
      for (let i = 0; i < hierarchy; i++) {
        hierarchyEntry.push('../')
      }
      hierarchyEntry = hierarchyEntry.join('')
      assetTags.head.forEach(v => {
        if (v.attributes.as === 'script') {
          v.attributes.href = hierarchyEntry + v.attributes.href
        } else if (v.attributes.as === 'style') {
          v.attributes.href = hierarchyEntry + v.attributes.href
        }
      })
      return Promise.resolve()
        .then(() => {
          return htmlPluginData
        })
    })
  })
}
MultiPagesUtil.MultiHtmlWebpackPlus = MultiHtmlWebpackPlus
MultiPagesUtil.autoScan = autoScan
module.exports = MultiPagesUtil
