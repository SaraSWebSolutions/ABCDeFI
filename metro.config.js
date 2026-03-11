const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const {
    resolver: { sourceExts, assetExts },
} = defaultConfig;

const config = {
    resolver: {
        sourceExts: [...sourceExts, 'cjs', 'mjs'],
        assetExts: [...assetExts, 'png', 'jpg', 'jpeg', 'gif', 'svg'],
    },
};

module.exports = mergeConfig(defaultConfig, config);

