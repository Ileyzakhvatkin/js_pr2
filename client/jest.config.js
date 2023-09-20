// eslint-disable-next-line no-undef
const {defaults} = require('jest-config');
module.exports = {
  // Игнорируем папку cypress
  testPathIgnorePatterns: ['./cypress/'],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  transform: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      './src/js/fileTransformer.js',
    '\\.js$': 'babel-jest',
  },
  testEnvironment: 'jsdom',
};
