module.exports = {
  baseUrl: '/_addon/vue-webpack',
  configureWebpack: {
    output: {
      // Important
      filename: 'index.js'
    }
  },
  css: {
    extract: false
  },
  chainWebpack: config => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('html')
    config.plugins.delete('split-vendor')
    config.plugins.delete('split-vendor-async')
    config.plugins.delete('split-manifest')
  },
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
}
