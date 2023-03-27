const CracoLessPlugin = require('craco-less')
const CracoAlias = require('craco-alias')

module.exports = {
  plugins: [
    // 自定义主题
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
    // 路径别名
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: './',
        tsConfigPath: './tsconfig.extend.json',
      },
    },
  ],
  // 开发服务器配置
  devServer: {
    port: 4000,
    open: true,
    // 激活代理服务器
    proxy: {
      // 将来以/dev-api开头的请求，就会被开发服务器转发到目标服务器去。
      '/dev-api': {
        // 需要转发的请求前缀
        target: 'http://syt-api.atguigu.cn', // 目标服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          // 路径重写
          '^/dev-api': '',
        },
      },
    },
  },
}
