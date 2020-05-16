// const autoprefixer = require('autoprefixer');
// const pxtoviewport = require('postcss-px-to-viewport');
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/vant-demo/' : '/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 100
          })
        ]
      }
    }
  },
  chainWebpack:config=>{
    config.resolve.alias
    .set('@',resolve('src'))
    .set('components',resolve('src/components'))
    .set('views',resolve('src/views'))
    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },
  devServer: {
    host: '0.0.0.0',
    port: 8088, // 端口号
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器  open: 'Google Chrome'-默认启动谷歌
  }
};
