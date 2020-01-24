const path = require('path')
const pkg = require('./package.json');

const libName = pkg.name;

module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-127217040-1",
        head: true,
      },
    },
  ],
  onCreateWebpackConfig: ({
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
  },
}
