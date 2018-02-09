const path = require('path')

class PluginAPI {
  /**
   * @param {string} id - Id of the plugin.
   * @param {Service} service - A vue-cli-service instance.
   */
  constructor (id, service) {
    this.id = id
    this.service = service
  }

  /**
   * Resolve path for a project.
   *
   * @param {string} _path - Relative path from project root
   * @return {string} The resolved absolute path.
   */
  resolve (_path) {
    return path.resolve(this.service.context, _path)
  }

  /**
   * Check if the project has a given plugin.
   *
   * @param {string} id - Plugin id, can omit the (@vue/|vue-)-cli-plugin- prefix
   * @return {boolean}
   */
  hasPlugin (id) {
    const prefixRE = /^(@vue\/|vue-)cli-plugin-/
    return this.service.plugins.some(p => {
      return p.id === id || p.id.replace(prefixRE, '') === id
    })
  }

  /**
   * Set project mode and resolve env variables for that mode.
   * this should be called by any registered command as early as possible, and
   * should be called only once per command.
   *
   * @param {string} mode
   */
  setMode (mode) {
    process.env.VUE_CLI_MODE = mode
    // by default, NODE_ENV and BABEL_ENV are set to "development" unless mode
    // is production or test. However this can be overwritten in .env files.
    process.env.NODE_ENV = process.env.BABEL_ENV =
      (mode === 'production' || mode === 'test')
        ? mode
        : 'development'
    // load .env files based on mode
    this.service.loadEnv(mode)
  }

  /**
   * Register a command that will become available as `vue-cli-service [name]`.
   *
   * @param {string} name
   * @param {object} [opts]
   *   {
   *     description: string,
   *     usage: string,
   *     options: { [string]: string }
   *   }
   * @param {function} fn
   *   (args: { [string]: string }, rawArgs: string[]) => ?Promise
   */
  registerCommand (name, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = null
    }
    this.service.commands[name] = { fn, opts }
  }

  /**
   * Regsiter a function that will receive a chainable webpack config
   * the function is lazy and won't be called until `resolveWebpackConfig` is
   * called
   *
   * @param {function} fn
   */
  chainWebpack (fn) {
    this.service.webpackChainFns.push(fn)
  }

  /**
   * Regsiter
   * - a webpack configuration object that will be merged into the config
   * OR
   * - a function that will receive the raw webpack config.
   *   the function can either mutate the config directly or return an object
   *   that will be merged into the config.
   *
   * @param {object | function} fn
   */
  configureWebpack (fn) {
    this.service.webpackRawConfigFns.push(fn)
  }

  /**
   * Register a dev serve config function. It will receive the express `app`
   * instnace of the dev server.
   *
   * @param {function} fn
   */
  configureDevServer (fn) {
    this.service.devServerConfigFns.push(fn)
  }

  /**
   * Resolve the final raw webpack config, that will be passed to webpack.
   * Typically, you should call `setMode` before calling this.
   *
   * @param {ChainableWebpackConfig} [chainableConfig]
   * @return {object} Raw webpack config.
   */
  resolveWebpackConfig (chainableConfig) {
    return this.service.resolveWebpackConfig(chainableConfig)
  }

  /**
   * Resolve an intermediate chainable webpack config instance, which can be
   * further tweaked before generating the final raw webpack config.
   * You can call this multiple times to generate different branches of the
   * base webpack config.
   * See https://github.com/mozilla-neutrino/webpack-chain
   *
   * @return {ChainableWebpackConfig}
   */
  resolveChainableWebpackConfig () {
    return this.service.resolveChainableWebpackConfig()
  }
}

module.exports = PluginAPI
