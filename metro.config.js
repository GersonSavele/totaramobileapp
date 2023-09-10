const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  //@apollo/client only works adding this "sourceExts"
  resolver: {
    ...defaultResolver,
    sourceExts: [...defaultResolver.sourceExts, "cjs"]
  }
};

const { getDefaultConfig } = require("metro-config");
const { resolver: defaultResolver } = getDefaultConfig.getDefaultValues();

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
