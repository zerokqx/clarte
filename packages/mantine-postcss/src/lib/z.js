const factory = require('../factory.js');

const postcssZPlugin = () => {
  return factory('postcss-z-plugin', 'z', (value) => `var(--mantine-z-index-${value})`);
};

module.exports = postcssZPlugin;
module.exports.postcss = true;
