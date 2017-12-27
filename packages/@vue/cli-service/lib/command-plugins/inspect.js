module.exports = (api, options) => {
  api.registerCommand('inspect', args => {
    api.setEnv(args.env || 'development')

    const stringify = require('javascript-stringify')
    const config = api.resolveWebpackConfig()
    const keys = args._

    let res
    if (keys.length) {
      res = {}
      keys.forEach(key => {
        res[key] = config[key]
      })
    } else {
      res = config
    }

    // TODO improve stringification for loaders, plugins etc.
    console.log(stringify(res, null, 2))
  })
}
