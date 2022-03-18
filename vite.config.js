import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'art.h',
    jsxFragment: 'art.Fragment',
    jsxInject: `import art from 'art'`
  },
  resolve: {
    alias: {
      art: path.resolve(__dirname, 'art')
    }
  }
})
