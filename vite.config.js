// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './src',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        404: resolve(__dirname, 'src/pages/404.html'),
        brazil: resolve(__dirname, 'src/pages/brazil.html'),
        graphs: resolve(__dirname, 'src/pages/graphs.html'),
        home: resolve(__dirname, 'src/pages/home.html'),
        india: resolve(__dirname, 'src/pages/india.html'),
        russia: resolve(__dirname, 'src/pages/russia.html')
      },
    },
  },
  publicDir: '../public',
  base: '/research_sc_viz/',
})
