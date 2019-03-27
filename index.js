const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const MultiPagesUtil = {}

function resolve (dir) {
  return path.join(__dirname, dir)
}
const srcDir = resolve('src')
const appDir = path.resolve(srcDir, 'pages')
const addPage = function (files, filePath) {
  const entry = filePath.replace(__dirname, '').substring(1).replace(/\\/g, '/')
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
        const chunks = assets.chunks
        for (let key in chunks) {
          chunks[key].entry = hierarchyEntry + chunks[key].entry
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
      assetTags.head.forEach(v => {
        if (v.attributes.as === 'script') {
          let href = v.attributes.href.split('/')
          let headName = ''
          if (href.length > 0) {
            headName = href[href.length - 1]
          }
          const index = _.findIndex(assetTags.body, v => {
            return v.attributes.src.indexOf(headName)
          })
          if (index !== -1) {
            v.attributes.href = assetTags.body[index].attributes.src
          }
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
MultiPagesUtil.autoScan = getPages()
module.exports = MultiPagesUtil
