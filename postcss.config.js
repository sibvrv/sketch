module.exports = {
  parser: false,
  plugins: {
    'autoprefixer': {
      browsers: ['last 2 versions']
    },
    'postcss-import': {},
    'postcss-preset-env': {},
    'cssnano': {}
  }
};
