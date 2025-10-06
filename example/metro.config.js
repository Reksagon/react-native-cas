const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const pak = require('../package.json'); // <-- ВАЖЛИВО: parent package.json

module.exports = mergeConfig(getDefaultConfig(__dirname), {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    // щоб import 'react-native-cas' йшов у корінь репо
    extraNodeModules: {
      [pak.name]: root,
      // опційно залочити ці модулі на example, щоб не дублювались
      react: path.join(__dirname, 'node_modules/react'),
      'react-native': path.join(__dirname, 'node_modules/react-native'),
    },
  },
});
