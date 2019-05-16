const workboxPlugin = require('workbox-webpack-plugin')
const path = require('path')
const sw_name = 'CustomServiceWorker.js'

module.exports = {
  webpack: function(config, env) {
      return config
  }, 
  jest: function(config) {
      return config
  },
  devServer: function(configFunction) {
      console.log(configFunction.toString())
      return function (proxy, allowedHost) {
          console.log(proxy, allowedHost)
          const config = configFunction(proxy, allowedHost)
          return config
      }
  }
}