import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import vue2 from '@vitejs/plugin-vue2';
import vue2Jsx from '@vitejs/plugin-vue2-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementUiResolver } from 'unplugin-vue-components/resolvers';
import Copy from 'rollup-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
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
    AutoImport({
      resolvers: [ElementUiResolver()],
    }),
    Components({
      resolvers: [ElementUiResolver()],
    }),
    Copy({
      targets: [
        { src: 'node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml', dest: 'public' },
        { src: 'node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf', dest: 'public' },
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
        target: 'http://ndiot.cqset.com',
        // target: 'http://192.168.1.166:8800',
        changeOrigin: true,
      },
    },
  },
});
