const {
  color,
  spacing,
  primary,
  radius,
  shadow,
  fz,
  fw,
  lh,
  breakpoint,
  z,
} = require('@clarte/mantine-postcss');

module.exports = {
  plugins: [
    color(),
    spacing(),
    primary(),
    radius(),
    shadow(),
    fz(),
    fw(),
    lh(),
    breakpoint(),
    z(),
    require('postcss-preset-mantine')({}),
    require('postcss-simple-vars')({
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    }),
  ],
};
