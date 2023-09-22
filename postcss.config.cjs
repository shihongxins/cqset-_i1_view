module.exports = {
  plugins: {
    'postcss-preset-env': {},
    /*
    'postcss-px-to-viewport': {
      viewportWidth: 1920,
      selectorBlackList: ['keep-unit'],
      exclude: [/node_modules/],
    },
    */
    'postcss-pxtorem': {
      // ❗根元素字体大小的值，即 1rem ，即 设计稿宽/10 px
      rootValue: 16,
      // 单位转换后保留的小数精度
      unitPrecision: 4,
      // 要转换单位的属性，本处为除字体大小外的其他所有属性
      propList: ['*'],
      // 设置不进行单位转换的选择器，本处为以 keep-px 结尾的类选择器不转换
      // ❗对于某单一属性不想转换单位，可将 px 单位，写为 PX,Px,pX 等
      selectorBlackList: [/\..+-keep-px$/],
      // 替换该属性而非添加为备选
      replace: true,
      // 是否转换媒体查询
      mediaQuery: false,
      // 最小需要转换的像素
      minPixelValue: 1,
      // 排除的文件夹
      // exclude: /node_modules/i,
    },
  },
};
