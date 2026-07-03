const factory = require('../factory.js');

const postcssPrimaryPlugin = () => {
  return factory(
    'postcss-primary-plugin',
    'primary',
    (value) => `var(--mantine-primary-color-${value})`,
  );
};

module.exports = postcssPrimaryPlugin;
module.exports.postcss = true;
