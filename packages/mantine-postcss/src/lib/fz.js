const factory = require('../factory.js');

const postcssFzPlugin = () => {
  return factory('postcss-fz-plugin', 'fz', (value) => `var(--mantine-font-size-${value})`);
};

module.exports = postcssFzPlugin;
module.exports.postcss = true;
