const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const pak = require('./package.json');

const root = path.resolve(__dirname, '..');

const config = {
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    extraNodeModules: {
      [pak.name]: root,
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: true },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
