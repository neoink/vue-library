const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vue-library': path.resolve(__dirname)
      }
    }
  }
};
