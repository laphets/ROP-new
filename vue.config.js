module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ?
    '/console/' : '/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args;
    })
  },
  devServer: {
    disableHostCheck: true,
    port: 80,
    proxy: {
      '/api': {
        target: 'https://rop.zjuqsc.com/api',
        // target: 'http://127.0.0.1:8080',
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/socket.io': {
        target: 'http://127.0.0.1:8000',
        ws: true,
        // pathRewrite: {
        //   '^/socket': '/'
        // }
      }
    }
  }
}