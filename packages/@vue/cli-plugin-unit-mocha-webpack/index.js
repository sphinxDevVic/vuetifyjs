module.exports = api => {
  api.configureWebpack(webpackConfig => {
    if (process.env.NODE_ENV === 'test') {
      if (!webpackConfig.externals) {
        webpackConfig.externals = []
      }
      webpackConfig.externals = [].concat(
        webpackConfig.externals,
        require('webpack-node-externals')()
      )
      webpackConfig.devtool = 'inline-cheap-module-source-map'
    }
  })

  api.registerCommand('test', {
    description: 'run unit tests with mocha-webpack',
    usage: 'vue-cli-service test [options] [...files]',
    options: {
      '--watch, -w': 'run in watch mode',
      '--grep, -g': 'only run tests matching <pattern>',
      '--slow, -s': '"slow" test threshold in milliseconds',
      '--timeout, -t': 'timeout threshold in milliseconds',
      '--bail, -b': 'bail after first test failure',
      '--require, -r': 'require the given module before running tests',
      '--include': 'include the given module into test bundle'
    },
    details: (
      `The above list only includes the most commonly used options.\n` +
      `For a full list of available options, see\n` +
      `http://zinserjan.github.io/mocha-webpack/docs/installation/cli-usage.html`
    )
  }, (args, rawArgv) => {
    api.setMode('test')
    // for @vue/babel-preset-app
    process.env.VUE_CLI_BABEL_TARGET_NODE = true
    // setup JSDOM
    require('jsdom-global')()
    // start runner
    return require('./runner')(api.resolveWebpackConfig(), args, rawArgv)
  })
}
