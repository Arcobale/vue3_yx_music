const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  //关闭项目打包时产生map
  productionSourceMap: false,
  transpileDependencies: true,
  //关闭eslint
  lintOnSave: false,
  //代理跨域
  devServer: {
    host: 'localhost',
    port: '8080',
    proxy: {
      '/api': {
        target: 'http://localhost:3000/',
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})