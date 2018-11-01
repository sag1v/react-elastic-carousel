import path from 'path'
import pkg from './package.json';

const libName = pkg.name;

export default {
  src: './src/docs',
  dest: './demo',
  title: libName,
  port: 8888,
  hashRouter: true,
  base: `/${libName}/`,
  ordering: "ascending",
  menu: [
    "Getting started",
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
        'goTo'
      ]
    }
  ],
  description: pkg.description,
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      [libName]: path.join(__dirname, `/src/${libName}/index.js`)
    }
    return config;
  },
  htmlContext: {
    head: {
      scripts: [
        {
          async: 'async',
          src: 'https://www.googletagmanager.com/gtag/js?id=UA-127217040-1'
        }
      ],
    raw:   `<script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-127217040-1');
            </script>`,
      links: [{
        rel: 'stylesheet',
        href: '//codemirror.net/theme/dracula.css'
      }]
    }
  },
  themeConfig: {
    // logo: {
    //   src: "//image.ibb.co/iACdcK/carousel_logo.png",
    //   width: "50%"
    // },
    mode: 'light',
    showPlaygroundEditor: true,
    codemirrorTheme: 'dracula',
    styles: {
      body: {
        fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
        fontSize: 16,
        lineHeight: 1.6,
      },
      container: {
        width: '100%',
        padding: ['20px 40px'],
      },
    }
  },
}