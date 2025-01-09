module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.module.rules.push({
          test: /\.svg$/,
          use: ['file-loader'],
        });
        return webpackConfig;
      },
    },
  };
  