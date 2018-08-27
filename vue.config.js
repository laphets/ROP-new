module.exports = {
  lintOnSave: false,
  baseUrl: process.env.NODE_ENV === 'production' ?
    '/manage/' : '/manage/',
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].chunksSortMode = 'none'
      return args
    })
  },
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