import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import webExtension from '@samrum/vite-plugin-web-extension'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

const pathResolve = (dir: string): string => {
  return resolve(__dirname, '.', dir)
}

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    basicSsl(),
    vue(),
    svgLoader(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [pathResolve('src/assets/svg/')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    }),
    VitePWA({
      registerType: 'autoUpdate', // 如果此项值为autoUpdate，则为自动给更新
      manifest: {
        name: 'demo name', // 项目名
        id: 'csdn',
        short_name: 'Scanner',
        description: '一个Vite PWA测试APP',
        theme_color: '#DC143C', // 红 // 用于设置工具栏的颜色，并且可以反映在任务切换器中的应用预览中。theme_color 应与文档标头中指定的 meta 主题颜色一致。
        background_color: '#FFFF00', // 黄-首次在移动设备上启动应用时，启动画面会使用 background_color 属性。
        display: 'minimal-ui', // 您可以自定义应用启动时显示的浏览器界面。例如，您可以隐藏地址栏和浏览器界面元素
        icons: [
          //添加图标，注意路径和图像像素正确，sizes必须和图片的尺寸一致
          {
            src: 'logo.png',
            sizes: '500x500',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: '111.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow',
          },
          {
            src: '222.png',
            type: 'image/png',
            sizes: '720x540',
            form_factor: 'wide',
          },
        ],
      },
      workbox: {
        // globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],		// 缓存相关静态资源，这个放开会导致页面html被缓存，谨慎使用
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  server: {
    hmr: true,
    host: '0.0.0.0',
    port: 9999,
    https: true,
  },
  build: {
    // 最终构建的浏览器兼容目标
    target: 'es2015',
    // 是否自动注入module preload的polyfill
    polyfillModulePreload: true,
    // 指定混淆器
    minify: 'esbuild',
    // 启用css代码拆分
    cssCodeSplit: true,
    // 允许用户为css的压缩设置一个不同的浏览器target, 与build esbuild一致
    cssTarget: '',
    // 清空输入文件夹
    emptyOutDir: false,
    // 取消计算文件大小，加快打包速度
    reportCompressedSize: false,
    // 启用压缩大小报告,
    // brotliSize: false,
    // chunk大小警告的限制
    chunkSizeWarningLimit: 500,
    // 取消sourceMap， 加快打包速度,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules'))
            return id
              .toString()
              .split('node_modules')[1]
              .split('/')[0]
              .toString()
        },
        entryFileNames: 'js/[name].hash.js',
        chunkFileNames: 'js/[name].hash.js',
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name
          if (fileName?.endsWith('.svg'))
            return 'img/svg/[name]-[hash][extname]'
          return 'css/[name]-[hash][extname]'
        },
      },
    },
  },
})
