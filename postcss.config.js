// https://tailwindcss.com/docs/controlling-file-size
// https://github.com/FullHuman/purgecss/tree/master/packages/postcss-purgecss
const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./public/**/*.html', './src/**/*.html', './src/**/*.jsx', './src/**/*.tsx'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = ({ env }) => ({
  plugins: [
    require('postcss-import'),
    require('tailwindcss'),
    require('postcss-nested'),
    env === 'production' ? purgecss : null,
    require('autoprefixer'),
  ],
});