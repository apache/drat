module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/proteus': {
        target: process.env.VUE_APP_ROOT_API,
        changeOrigin: true
      },
      '/solr': {
        target: process.env.VUE_APP_ROOT_API,
        changeOrigin: true
      }
    }
  }
};
