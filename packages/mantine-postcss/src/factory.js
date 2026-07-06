/**
 * @typedef {import('postcss').Plugin} PostcssPlugin
 */

/**
 * @param {string} pluginName
 * @param {string} keyWord
 * @param {function(string): string} variableCallback
 * @returns {{ postcssPlugin: string, Declaration: (decl: any) => void }}
 */
const factory = (pluginName, keyWord, variableCallback) => {
  const escapedKeyWord = keyWord.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escapedKeyWord}\\(([^)]+)\\)`, 'g');

  return {
    postcssPlugin: pluginName,

    /**
     * @param {Declaration} decl
     */
    Declaration(decl) {
      if (decl.value.includes(`${keyWord}(`)) {
        decl.value = decl.value.replace(regex, (_match, size) => {
          const cleanSize = size.trim();
          return variableCallback(cleanSize);
        });
      }
    },
  };
};

module.exports = factory;
