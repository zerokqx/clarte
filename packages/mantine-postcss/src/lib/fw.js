const factory = require('../factory.js');

const postcssFwPlugin = () => {
  return factory('postcss-fw-plugin', 'fw', (value) => `var(--mantine-font-weight-${value})`);
};

module.exports = postcssFwPlugin;
module.exports.postcss = true;
