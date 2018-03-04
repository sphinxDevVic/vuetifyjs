const chalk = require('chalk')
const { loadOptions } = require('./options')
const { installPackage } = require('./util/installDeps')
const {
  log,
  error,
  hasYarn,
  stopSpinner
} = require('@vue/cli-shared-utils')
const invoke = require('./invoke')

async function add (pluginName, options = {}, context = process.cwd()) {
  const packageName = pluginName.includes('vue-cli-plugin-') ? pluginName : `vue-cli-plugin-${pluginName}`

  log()
  log(`📦  Installing ${chalk.cyan(packageName)}...`)
  log()

  const packageManager = loadOptions().packageManager || (hasYarn() ? 'yarn' : 'npm')
  await installPackage(context, packageManager, null, packageName)

  stopSpinner()

  log()
  log(`${chalk.green('✔')}  Successfully installed plugin: ${chalk.cyan(packageName)}`)
  log()

  invoke(pluginName, options, context)
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
