module.exports = function lint (args = {}, api, silent) {
  const cwd = api.resolve('.')
  const fs = require('fs')
  const path = require('path')
  const globby = require('globby')
  const tslint = require('tslint')
  const ts = require('typescript')
  /* eslint-disable-next-line node/no-extraneous-require */
  const vueCompiler = require('vue-template-compiler')
  const isVueFile = file => /\.vue(\.ts)?$/.test(file)

  const options = {
    fix: args['fix'] !== false,
    formatter: args.format || 'codeFrame',
    formattersDirectory: args['formatters-dir'],
    rulesDirectory: args['rules-dir']
  }

  // hack to make tslint --fix work for *.vue files
  // this works because (luckily) tslint lints synchronously
  const vueFileCache = new Map()
  const writeFileSync = fs.writeFileSync

  const patchWriteFile = () => {
    fs.writeFileSync = (file, content, options) => {
      if (isVueFile(file)) {
        const { before, after } = vueFileCache.get(path.normalize(file))
        content = `${before}\n${content.trim()}\n${after}`
      }
      return writeFileSync(file, content, options)
    }
  }

  const restoreWriteFile = () => {
    fs.writeFileSync = writeFileSync
  }

  const parseTSFromVueFile = file => {
    const content = fs.readFileSync(file, 'utf-8')
    const { script } = vueCompiler.parseComponent(content, { pad: 'line' })
    if (script) {
      vueFileCache.set(file, {
        before: content.slice(0, script.start),
        after: content.slice(script.end)
      })
    }
    return script && script.content
  }

  const program = tslint.Linter.createProgram(api.resolve('tsconfig.json'))

  // patch getSourceFile for *.vue files
  const getSourceFile = program.getSourceFile
  program.getSourceFile = function (file, languageVersion, onError) {
    if (isVueFile(file)) {
      const script = parseTSFromVueFile(file)
      return ts.createSourceFile(file, script, languageVersion, true)
    } else {
      return getSourceFile.call(this, file, languageVersion, onError)
    }
  }

  const linter = new tslint.Linter(options, program)

  const config = tslint.Configuration.findConfiguration(api.resolve('tslint.json')).results
  // create a patched config that disables the blank lines rule,
  // so that we get correct line numbers in error reports for *.vue files.
  const vueConfig = Object.assign(config)
  const rules = vueConfig.rules = new Map(vueConfig.rules)
  const rule = rules.get('no-consecutive-blank-lines')
  rules.set('no-consecutive-blank-lines', Object.assign({}, rule, {
    ruleSeverity: 'off'
  }))

  const lint = file => {
    const filePath = api.resolve(file)
    const isVue = isVueFile(file)
    patchWriteFile()
    linter.lint(
      // append .ts so that tslint apply TS rules
      filePath,
      '',
      // use Vue config to ignore blank lines
      isVue ? vueConfig : config
    )
    restoreWriteFile()
  }

  const files = args._ && args._.length
    ? args._
    : ['src/**/*.ts', 'src/**/*.vue', 'src/**/*.tsx', 'tests/**/*.ts', 'tests/**/*.tsx']

  return globby(files, { cwd }).then(files => {
    files.forEach(lint)
    if (silent) return
    const result = linter.getResult()
    if (result.output.trim()) {
      process.stdout.write(result.output)
    } else if (result.fixes.length) {
      // some formatters do not report fixes.
      const f = new tslint.Formatters.ProseFormatter()
      process.stdout.write(f.format(result.failures, result.fixes))
    } else if (!result.failures.length) {
      console.log(`No lint errors found.\n`)
    }

    if (result.failures.length && !args.force) {
      process.exitCode = 1
    }
  })
}
