import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // 使用路径别名时想要省略的后缀名，可以自己 增减
    extensions: ['.js', '.json', '.ts', '.vue', '.d.ts'],
  },
  base: './',
  css: {
    preprocessorOptions: {
      scss: {
        /**
         * 单行溢出隐藏 @include single-hide();
         *
         * 多行溢出隐藏 @include multi-hide(3);
         *
         * flex布局垂直水平居中 @include flex-center();
         *
         */
        additionalData: `
          @mixin flex-center() {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          @mixin single-hide() {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          @mixin multi-hide($num) {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: $num;
          }
        `,
      },
    },
  },
  server: {
    host: true,
    port: 6969,
    proxy: {
      '/zd-api': {
        target: 'https://open.api.luojigou.vip',
        // target: 'https://open.test.luojigou.vip',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zd-api/, ''),
      },
    },
  },
})
