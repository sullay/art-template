import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: `import { render, h } from 'lib'`
  },
  resolve:{
    alias: {
      lib: path.resolve(__dirname, 'lib')
    }
  }
})
