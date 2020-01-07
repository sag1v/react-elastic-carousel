const { mergeWith } = require('lodash/fp')
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
    title: 'react-elastic-carousel',
    description: 'A flexible and responsive carousel component for react',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {
          mode: 'light',
          showPlaygroundEditor: true,
          codemirrorTheme: 'dracula',
          styles: {
            body: {
              fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
              fontSize: 16,
              lineHeight: 1.6,
            },
            container: { width: '100%', padding: ['20px 40px'] },
          },
        },
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
        ignore: [],
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
        src: './src/docs',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: './demo',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'react-elastic-carousel',
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
        ordering: 'ascending',
        htmlContext: {
          head: {
            scripts: [
              {
                async: 'async',
                src:
                  'https://www.googletagmanager.com/gtag/js?id=UA-127217040-1',
              },
            ],
            raw:
              "<script>\n              window.dataLayer = window.dataLayer || [];\n              function gtag(){dataLayer.push(arguments);}\n              gtag('js', new Date());\n              gtag('config', 'UA-127217040-1');\n            </script>",
            links: [
              { rel: 'stylesheet', href: '//codemirror.net/theme/dracula.css' },
            ],
          },
        },
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
