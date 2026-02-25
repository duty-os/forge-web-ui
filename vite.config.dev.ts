import { defineConfig } from 'vite'

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3000,
    open: true
  },
  // 构建配置
  build: {
    outDir: 'demo-dist',
    sourcemap: true
  },
  // 指向 demo 目录作为根目录
  root: 'demo'
})
