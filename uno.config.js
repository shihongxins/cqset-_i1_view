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
      themeblue: {
        DEFAULT: '#2196f3',
        50: '#e3f2fd',
        100: '#bbdefb',
        200: '#90caf9',
        300: '#64b5f6',
        400: '#42a5f5',
        500: '#2196f3',
        600: '#1e88e5',
        700: '#1976d2',
        800: '#1565c0',
        900: '#0d47a1',
      },
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
    'color-themeblue',
    'color-primary',
    'color-danger',
    'color-warning',
    'color-success',
    'color-info',
    'color-content',
  ],
});
