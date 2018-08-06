module.exports = api => {
  api.chainWebpack(webpackConfig => {
    if (process.env.NODE_ENV === 'test') {
      webpackConfig.merge({
        target: 'node',
        devtool: 'inline-cheap-module-source-map'
      })

      // when target === 'node', vue-loader will attempt to generate
      // SSR-optimized code. We need to turn that off here.
      webpackConfig.module
        .rule('vue')
          .use('vue-loader')
          .tap(options => {
            options.optimizeSSR = false
            return options
          })
    }
  })

  api.registerCommand('test:unit', {
    description: 'run unit tests with mocha-webpack',
    usage: 'vue-cli-service test:unit [options] [...files]',
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
    // for @vue/babel-preset-app
    process.env.VUE_CLI_BABEL_TARGET_NODE = true
    // start runner
    const { execa } = require('@vue/cli-shared-utils')
    const bin = require.resolve('mocha-webpack/bin/mocha-webpack')
    const hasInlineFilesGlob = args._ && args._.length
    const argv = [
      '--recursive',
      '--require',
      require.resolve('./setup.js'),
      '--webpack-config',
      require.resolve('@vue/cli-service/webpack.config.js'),
      ...rawArgv,
      ...(hasInlineFilesGlob ? [] : [
        api.hasPlugin('typescript')
          ? `tests/unit/**/*.spec.ts`
          : `tests/unit/**/*.spec.js`
      ])
    ]

    return new Promise((resolve, reject) => {
      const child = execa(bin, argv, { stdio: 'inherit' })
      child.on('error', reject)
      child.on('exit', code => {
        if (code !== 0) {
          reject(`mocha-webpack exited with code ${code}.`)
        } else {
          resolve()
        }
      })
    })
  })
}

module.exports.defaultModes = {
  'test:unit': 'test'
}
