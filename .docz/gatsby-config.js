const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/react-elastic-carousel/',

  siteMetadata: {
    title: 'React Elastic Carousel',
    description: 'A flexible and responsive carousel component for react',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: './',
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [
          'Getting started',
          {
            name: 'Examples',
            menu: [
              'itemsToScroll',
              'itemsToShow',
              'breakPoints',
              'verticalMode',
              'initialFirstItem',
              'focusOnSelect',
              'isRTL',
              'enableAutoPlay',
              'itemPadding',
              'itemPosition',
              'easing',
              'renderArrow',
              'renderPagination',
              'onNextStart',
              'onNextEnd',
              'onPrevStart',
              'onPrevEnd',
              'onResize',
              'slideNext / slidePrev',
              'goTo',
            ],
          },
        ],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [
          'README.md',
          'changelog.md',
          'CODE_OF_CONDUCT.md',
          'contributing.md',
          'LICENSE.md',
        ],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: 'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz',
        base: '/react-elastic-carousel/',
        source: './',
        'gatsby-root': './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: './demo',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'React Elastic Carousel',
        description: 'A flexible and responsive carousel component for react',
        host: 'localhost',
        port: 8888,
        p: 3000,
        separator: '-',
        paths: {
          root: 'C:\\Users\\sagiv\\github clones\\react-elastic-carousel',
          templates:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz',
          cache:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\.cache',
          app:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app',
          appPackageJson:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\package.json',
          appTsConfig:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\tsconfig.json',
          gatsbyConfig:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app\\index.html',
          db:
            'C:\\Users\\sagiv\\github clones\\react-elastic-carousel\\.docz\\app\\db.json',
        },
        hashRouter: true,
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
