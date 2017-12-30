module.exports = {
  // project deployment base
  base: '/',

  // where to output built files
  outputDir: 'dist',

  // where to generate static assets under outputDir
  staticDir: 'static',

  // boolean, use full build?
  compiler: false,

  // apply css modules to CSS files that doesn't end with .mdoule.css?
  cssModules: false,

  // vue-loader options
  vueLoaderOptions: {},

  // sourceMap for production build?
  productionSourceMap: true,

  // enable css source map?
  cssSourceMap: false,

  // boolean | Object, extract css?
  extractCSS: true,

  devServer: {
  /*
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null, // string | Object
    before: app => {}
  */
  }
}
