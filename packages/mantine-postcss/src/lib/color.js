/**
 * @typedef {import('postcss').Plugin} PostcssPlugin
 * @typedef {import('postcss').Declaration} Declaration
 */

const COLOR_REGEX = /c\(([^)]+)\)/g;

/**
 * PostCSS плагин для трансформации функции c(color.number) в переменные Mantine
 * @returns {{ postcssPlugin: string, Declaration: (decl: Declaration) => void }}
 */
const postcssColorPlugin = () => {
  return {
    postcssPlugin: 'postcss-color-plugin',

    Declaration(decl) {
      if (decl.value.includes('c(')) {
        decl.value = decl.value.replace(COLOR_REGEX, (_match, content) => {
          const cleanContent = content.trim();

          if (cleanContent.includes('.')) {
            const [color, number] = cleanContent.split('.');
            return `var(--mantine-color-${color.trim()}-${number.trim()})`;
          }

          return `var(--mantine-color-${cleanContent})`;
        });
      }
    },
  };
};

module.exports = postcssColorPlugin;
module.exports.postcss = true;
