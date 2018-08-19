const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'vacalians-ui': path.resolve(__dirname),
      },
    },
  },
};
