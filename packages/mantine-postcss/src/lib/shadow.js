const factory = require('../factory.js');

const postcssShadowPlugin = () => {
  return factory('postcss-shadow-plugin', 'shadow', (value) => `var(--mantine-shadow-${value})`);
};

module.exports = postcssShadowPlugin;
module.exports.postcss = true;
