const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAbiFilters(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('defaultConfig {')) {
      if (!config.modResults.contents.includes('abiFilters')) {
        config.modResults.contents = config.modResults.contents.replace(
          'defaultConfig {',
          'defaultConfig {\n        ndk {\n            abiFilters "arm64-v8a"\n        }',
        );
        console.log('[withAbiFilters] Successfully added arm64-v8a to build.gradle');
      }
    }
    return config;
  });
};
