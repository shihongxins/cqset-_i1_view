import {
  defineConfig,
  presetUno,
  presetAttributify,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      darkblue: '#14508c',
      primary: '#139FFF',
      danger: '#F56C6C',
      warning: '#DFA43C',
      success: '#26B926',
      info: '#909399',
      content: '#F2F6FC',
    },
  },
  safelist: [
    'i-material-symbols:lists-rounded',
    'i-material-symbols:camera-video-outline',
    'i-material-symbols:image-search-rounded',
    'i-material-symbols:detector-alarm-outline-rounded',
    'i-material-symbols:docs-outline',
    'color-darkblue',
    'color-primary',
    'color-danger',
    'color-warning',
    'color-success',
    'color-info',
    'color-content',
  ],
});
