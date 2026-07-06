const factory = require('../factory.js');

const postcssSpacingPlugin = () => {
  return factory('postcss-radius-plugin', 'radius', (value) => `var(--mantine-radius-${value})`);
};

module.exports = postcssSpacingPlugin;
module.exports.postcss = true;
