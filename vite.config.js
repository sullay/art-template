import { defineConfig } from 'vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxFactory: 'atr.h',
    jsxFragment: 'atr.Fragment',
    jsxInject: `import atr from 'atr'`
  },
  resolve: {
    alias: {
      atr: path.resolve(__dirname, 'arthur')
    }
  }
})
