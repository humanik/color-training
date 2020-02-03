module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/color-training/'
    : '/',
  pwa: {
    name: 'Color training',
    themeColor: '#f9f9f9',
    msTileColor: '#f9f9f9',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black'
  }
}
