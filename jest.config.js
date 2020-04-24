const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  preset: 'react-native',
  transform: {
    ...tsjPreset.transform,
    '\\.js$': '<rootDir>/node_modules/react-native/jest/preprocessor.js',
  },
  globals: {
    'ts-jest': {
      babelConfig: true,
      diagnostics: {
        warnOnly: true
      }
    }
  },
  cacheDirectory: '.jest/cache',
  moduleNameMapper: {
    "@totara/(.*)": "<rootDir>/src/totara/$1",
    "@resources/(.*)": "<rootDir>/src/resources/$1"
  },
  testPathIgnorePatterns: ["e2e"],
  setupFiles: [
    "<rootDir>/jest.setup.js"
  ],
  collectCoverageFrom: [
    "src/totara/**/*.{js,jsx,ts,tsx}"
  ]
};
