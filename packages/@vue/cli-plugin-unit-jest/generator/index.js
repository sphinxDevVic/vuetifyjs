module.exports = (api, _, __, invoking) => {
  api.render('./template', {
    hasTS: api.hasPlugin('typescript')
  })

  api.extendPackage({
    scripts: {
      'test:unit': 'vue-cli-service test:unit'
    },
    devDependencies: {
      '@vue/test-utils': '1.0.0-beta.29'
    },
    jest: {
      preset: api.hasPlugin('babel')
        ? '@vue/cli-plugin-unit-jest/preset'
        : '@vue/cli-plugin-unit-jest/preset/no-babel'
    }
  })

  if (api.hasPlugin('eslint')) {
    api.extendPackage({
      eslintConfig: {
        overrides: [
          {
            files: [
              '**/__tests__/*.{j,t}s?(x)',
              '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
              jest: true
            }
          }
        ]
      }
    })
  }

  if (api.hasPlugin('typescript')) {
    applyTS(api, invoking)
  }
}

const applyTS = (module.exports.applyTS = (api, invoking) => {
  api.extendPackage({
    jest: {
      preset: api.hasPlugin('babel')
        ? '@vue/cli-plugin-unit-jest/preset/typescript-and-babel'
        : '@vue/cli-plugin-unit-jest/preset/typescript'
    },
    devDependencies: {
      '@types/jest': '^24.0.11'
    }
  })

  if (invoking) {
    // inject jest type to tsconfig.json
    api.render(files => {
      const tsconfig = files['tsconfig.json']
      if (tsconfig) {
        const parsed = JSON.parse(tsconfig)
        if (
          parsed.compilerOptions.types &&
          !parsed.compilerOptions.types.includes('jest')
        ) {
          parsed.compilerOptions.types.push('jest')
        }
        files['tsconfig.json'] = JSON.stringify(parsed, null, 2)
      }
    })
  }
})
