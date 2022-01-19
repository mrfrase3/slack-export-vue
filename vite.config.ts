import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: true,
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'dayjs': [['*', 'dayjs']],
          '@/util/emoji': [['default', 'emoji']],
          '@/store/index': ['useStore'],
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
