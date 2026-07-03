const factory = require('../factory.js');

const postcssLhPlugin = () => {
  return factory('postcss-lh-plugin', 'lh', (value) => `var(--mantine-line-height-${value})`);
};

module.exports = postcssLhPlugin;
module.exports.postcss = true;
