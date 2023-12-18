import { fileURLToPath, URL } from 'node:url';
import { cwd } from 'node:process';

import { defineConfig, loadEnv } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';
import vue2Jsx from '@vitejs/plugin-vue2-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import UnoCSS from 'unocss/vite';
import Copy from 'rollup-plugin-copy';
import { Plugin as importToCDN } from 'vite-plugin-cdn-import';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd());
  /**
   * @type {import('vite').UserConfigExport}
   */
  const config = {
    base: env.VITE_STATIC_FILE_BASE,
    plugins: [
      vue2(),
      vue2Jsx(),
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      }),
      eslintPlugin({
        include: ['src/**/*.{vue,js,ts,jsc,tsc}'],
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      UnoCSS(),
      Copy({
        targets: [
          {
            src: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml',
            dest: 'public',
          },
          {
            src: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf',
            dest: 'public',
          },
          {
            src: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js',
            dest: 'public/js',
          },
        ],
        verbose: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {},
      postcss: 'postcss.config.cjs',
    },
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
    build: {
      sourcemap: 'development' === mode,
      assetsDir: env.VITE_ASSETS_DIR,
      rollupOptions: {
        external: [],
      },
    },
  };
  if ('development' === mode) {
    console.log('vite defineConfig mode and env', mode, env);
  } else {
    config.plugins.push(
      importToCDN({
        modules: [
          {
            name: 'vue',
            var: 'Vue',
            path: 'https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.min.js',
          },
          {
            name: 'vue-demi',
            var: 'VueDemi',
            path: 'https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.6/index.iife.min.js',
          },
          {
            name: 'element-ui',
            var: 'ELEMENT',
            path: 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/index.min.js',
            css: 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.14/theme-chalk/index.min.css',
          },
        ],
      })
    );
    config.build.rollupOptions.external = ['vue', 'vue-demi', 'element-ui'];
  }
  return config;
});
