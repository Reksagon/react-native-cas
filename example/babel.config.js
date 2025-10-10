const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        alias: {
          // ім'я пакета → сирці бібліотеки
          [pak.name]: path.join(__dirname, '..', pak.source || 'src/index'),
        },
      },
    ],
  ],
};
