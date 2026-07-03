const factory = require('../factory.js');

const postcssSpacingPlugin = () => {
  return factory('postcss-spacing-plugin', 'spacing', (value) => `var(--mantine-spacing-${value})`);
};

module.exports = postcssSpacingPlugin;
module.exports.postcss = true;
