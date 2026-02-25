import { defineConfig } from 'vite'

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  // 库模式构建配置
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'ForgeWebUI',
      fileName: (format) => `forge-web-ui.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['@netless/forge-whiteboard'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          '@netless/forge-whiteboard': 'ForgeWhiteboard'
        }
      }
    },
    outDir: 'dist',
    sourcemap: true
  }
})
