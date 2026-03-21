// const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  */
// const config = {};

const { getDefaultConfig } = require('@react-native/metro-config')

const config = getDefaultConfig(__dirname)

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  process: require.resolve('process'),
  url: require.resolve('url'),
  path: require.resolve('path-browserify'),
}

// ADD THESE 2 PROPERTIES for thirdweb
config.resolver.unstable_enablePackageExports = true
config.resolver.unstable_conditionNames = [
  "react-native",
  "browser",
  "require",
]

module.exports = config