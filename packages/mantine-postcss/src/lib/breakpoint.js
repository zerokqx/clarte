const factory = require('../factory.js');

const postcssBreakpointPlugin = () => {
  return factory(
    'postcss-breakpoint-plugin',
    'breakpoint',
    (value) => `var(--mantine-breakpoint-${value})`,
  );
};

module.exports = postcssBreakpointPlugin;
module.exports.postcss = true;
