const config = {
  preset: '@vue/cli-plugin-unit-jest',
  verbose: true,
  setupFiles: ['./tests/setup.js'],
  transform: {
    'vee-validate/dist/rules': 'babel-jest',
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vee-validate/dist/rules)',
  ],
}
module.exports = config