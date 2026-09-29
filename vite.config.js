import { fileURLToPath, URL } from 'node:url'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  resolve: {
    // '@/...' → 'src/...' (에디터 자동완성은 tsconfig.json의 paths와 맞춤)
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
