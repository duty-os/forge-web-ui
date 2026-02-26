import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    // 开发服务器配置
    server: {
        port: 3301,
        open: true
    },
    // 构建配置
    build: {
        outDir: 'demo-react',
        sourcemap: true
    },
    // 指向 demo 目录作为根目录
    root: 'demo/react'
})
