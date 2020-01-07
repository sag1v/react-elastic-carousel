const path = require('path')
const pkg = require('./package.json');

const libName = pkg.name;

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, '../src'), 'node_modules'],
      alias: {
        [libName]: path.join(__dirname, `/src/${libName}/index.js`)
      }
    }
  })
}