module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.android.js', '.ios.js']
      }
    }
  },
  parser: 'babel-eslint',
  env: {
    node: true,
    es6: true,
  },
  globals: {
    fetch: true,
    __DEV__: true,
    FormData: true,
  },
  extends: ['plugin:react/recommended', 'plugin:flowtype/recommended', 'airbnb'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    impliedStrict: false,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    }
  },
  plugins: [
    'babel',
    'jsx-a11y',
    'sort-class-members',
    'flowtype',
    'react',
    'react-native'
  ],
  rules: {
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 2,
    'jsx-quotes': ['error', 'prefer-double'],
    'jsx-a11y/href-no-hash': 2,
    'jsx-a11y/label-has-for': 2,
    'jsx-a11y/mouse-events-have-key-events': 2,
    'jsx-a11y/role-has-required-aria-props': 2,
    'jsx-a11y/role-supports-aria-props': 2,
    'jsx-a11y/aria-props': 2,
    'react/display-name': 1,
    'react/jsx-boolean-value': 0,
    'react/jsx-no-undef': 2,
    'react/jsx-sort-prop-types': 0,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 1,
    'react/jsx-uses-vars': 1,
    'babel/flow-object-type': 1,
    'react/no-did-mount-set-state': 1,
    'react/no-did-update-set-state': 1,
    'react/no-multi-comp': 1,
    'react/no-unknown-property': 1,
    'react/prop-types': 1,
    'react/react-in-jsx-scope': 1,
    'react/self-closing-comp': 1,
    'sort-class-members/sort-class-members': [2, {
      'order': [
        '[static-properties]',
        '[static-methods]',
        '[static-render-methods]',
        '[properties]',
        '[conventional-private-properties]',
        'constructor',
        '[lifecycle]',
        '[arrow-function-properties]',
        '[everything-else]',
        // '/^render.+$/',
        'render',
      ],
      'groups': {
        'lifecycle': [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'state',
          'getInitialState',
          'getChildContext',
          'componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'componentDidUpdate',
          'componentWillUnmount'
        ],
        'static-render-methods': [
          { 'name': '/^render.+$/', 'type': 'method', static: true }
        ]
      }
    }],
    'react/sort-comp': 0,
    'react/jsx-wrap-multilines': 1,
    'babel/generator-star-spacing': 0,
    'react/jsx-filename-extension': 0, // disabled because react native doesnt like .jsx
    'babel/new-cap': 0,
    'babel/object-curly-spacing': 0,
    'babel/object-shorthand': 1,
    'babel/arrow-parens': 0,
    'babel/no-await-in-loop': 1,
    'arrow-parens': 0,
    'new-cap': [
      'error',
      { newIsCap: true, capIsNewExceptions: ['Color', 'SelectableBackground'], newIsCapExceptionPattern: ['SelectableBackground'] },
    ],
    indent: [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'comma-dangle': [
      'warn',
      'always-multiline'
    ],
    'no-unused-vars': 1,
    'no-use-before-define': 0,
    'no-console': [
      'warn', { allow: ['warn', 'error']}
    ],
    'no-mixed-operators': 0,
    'class-methods-use-this': 0,
    'react/forbid-prop-types': 0, // replace with 1 for very strict type checks
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
  }
};
