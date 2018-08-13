module.exports = {
  lintOnSave: false,
  devServer: {
    disableHostCheck: true,
    port: 80,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  }
}