module.exports = {
  plugins: {
    "postcss-preset-env": {},
    "postcss-px-to-viewport": {
      viewportWidth: 1920,
      selectorBlackList: ["keep-unit"],
      exclude: [/node_modules/],
    },
  },
};
