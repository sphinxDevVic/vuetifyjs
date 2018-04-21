module.exports = api => {
  // Config file
  api.describeConfig({
    id: 'eslintrc',
    name: 'ESLint configuration',
    description: 'Error checking & Code quality',
    link: 'https://eslint.org',
    icon: '.eslintrc.json',
    files: {
      json: ['.eslintrc', '.eslintrc.json'],
      js: ['.eslintrc.js'],
      package: 'eslintConfig'
    },
    onRead: ({ data }) => ({
      prompts: [
        {
          name: 'vue/attribute-hyphenation',
          type: 'list',
          message: 'Attribute hyphenation',
          group: 'Strongly recommended',
          description: 'Enforce attribute naming style in template (`my-prop` or `myProp`)',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attribute-hyphenation.md',
          default: JSON.stringify('off'),
          choices: [
            {
              name: 'Off',
              value: JSON.stringify('off')
            },
            {
              name: 'Never',
              value: JSON.stringify(['error', 'never'])
            },
            {
              name: 'Always',
              value: JSON.stringify(['error', 'always'])
            }
          ],
          value: data.rules && JSON.stringify(data.rules['vue/attribute-hyphenation'])
        },
        {
          name: 'vue/html-end-tags',
          type: 'confirm',
          message: 'Template end tags style',
          group: 'Strongly recommended',
          description: 'End tag on Void elements, end tags and self-closing opening tags',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-end-tags.md',
          default: false,
          value: data.rules && data.rules['vue/html-end-tags'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        },
        {
          name: 'vue/html-indent',
          type: 'list',
          message: 'Template indentation',
          group: 'Strongly recommended',
          description: 'Enforce indentation in template',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-indent.md',
          default: JSON.stringify('off'),
          choices: [
            {
              name: 'Off',
              value: JSON.stringify('off')
            },
            {
              name: 'Tabs',
              value: JSON.stringify(['error', 'tabs'])
            },
            {
              name: '2 spaces',
              value: JSON.stringify(['error', 2])
            },
            {
              name: '4 spaces',
              value: JSON.stringify(['error', 4])
            },
            {
              name: '8 spaces',
              value: JSON.stringify(['error', 8])
            }
          ],
          value: data.rules && JSON.stringify(data.rules['vue/html-indent'])
        },
        {
          name: 'vue/html-self-closing',
          type: 'confirm',
          message: 'Template tag self-closing style',
          group: 'Strongly recommended',
          description: 'Self-close any component or non-Void element tags',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-self-closing.md',
          default: false,
          value: data.rules && data.rules['vue/html-self-closing'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        },
        {
          name: 'vue/require-default-prop',
          type: 'confirm',
          message: 'Require default in required props',
          group: 'Strongly recommended',
          description: 'This rule requires default value to be set for each props that are not marked as `required`',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-default-prop.md',
          default: false,
          value: data.rules && data.rules['vue/require-default-prop'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        },
        {
          name: 'vue/require-prop-types',
          type: 'confirm',
          message: 'Require types for props',
          group: 'Strongly recommended',
          description: 'In committed code, prop definitions should always be as detailed as possible, specifying at least type(s)',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/require-prop-types.md',
          default: false,
          value: data.rules && data.rules['vue/require-prop-types'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        },
        {
          name: 'vue/attributes-order',
          type: 'confirm',
          message: 'Attribute order',
          group: 'Recommended',
          description: 'This rule aims to enforce ordering of component attributes (the default order is specified in the Vue style guide)',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/attributes-order.md',
          default: false,
          value: data.rules && data.rules['vue/attributes-order'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        },
        {
          name: 'vue/html-quotes',
          type: 'list',
          message: 'Attribute quote style',
          group: 'Recommended',
          description: 'Enforce style of the attribute quotes in templates',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-quotes.md',
          default: JSON.stringify('off'),
          choices: [
            {
              name: 'Off',
              value: JSON.stringify('off')
            },
            {
              name: 'Double quotes',
              value: JSON.stringify(['error', 'double'])
            },
            {
              name: 'Single quotes',
              value: JSON.stringify(['error', 'single'])
            }
          ],
          value: data.rules && JSON.stringify(data.rules['vue/html-quotes'])
        },
        {
          name: 'vue/order-in-components',
          type: 'confirm',
          message: 'Component options order',
          group: 'Recommended',
          description: 'This rule aims to enforce ordering of component options (the default order is specified in the Vue style guide)',
          link: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/order-in-components.md',
          default: false,
          value: data.rules && data.rules['vue/order-in-components'] === 'error',
          filter: input => JSON.stringify(input ? 'error' : 'off')
        }
      ]
    }),
    onWrite: ({ api, prompts }) => {
      api.setData(prompts.reduce((obj, prompt) => {
        obj[`rules.${prompt.id}`] = api.getAnswer(prompt.id, JSON.parse)
        return obj
      }, {}))
    }
  })

  // Tasks
  api.describeTask({
    match: /vue-cli-service lint/,
    description: 'Lints and fixes files',
    link: 'https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint#injected-commands',
    prompts: [
      {
        name: 'noFix',
        type: 'confirm',
        default: false,
        description: 'Do not fix errors'
      }
    ],
    onBeforeRun: ({ answers, args }) => {
      if (answers.noFix) {
        args.push('--no-fix')
      }
    }
  })
}
