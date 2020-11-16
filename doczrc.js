import path from 'path'
import pkg from './package.json';

const libName = pkg.name;

export default {
  ignore: ['README.md', 'changelog.md', 'CODE_OF_CONDUCT.md', 'contributing.md', 'LICENSE.md'],
  //src: './src',
  dest: './demo',
  port: 8888,
  hashRouter: true,
  base: `/${libName}/`,
  menu: [
    "Getting started",
    {
      name: 'Examples',
      menu: [
        'itemsToScroll',
        'itemsToShow',
        'breakPoints',
        'verticalMode',
        'initialActiveIndex',
        'focusOnSelect',
        'isRTL',
        'enableAutoPlay',
        'itemPadding',
        'sidePadding',
        'itemPosition',
        'easing',
        'renderArrow',
        'renderPagination',
        'autoTabIndexVisibleItems',
        'onChange',
        'onNextStart',
        'onNextEnd',
        'onPrevStart',
        'onPrevEnd',
        'onResize',
        'slideNext / slidePrev',
        'goTo',
        'Styling'
      ]
    }
  ],
  // htmlContext: {
  //   head: {
  //     scripts: [
  //       {
  //         async: 'async',
  //         src: 'https://www.googletagmanager.com/gtag/js?id=UA-127217040-1'
  //       }
  //     ],
  //     raw: `<script>
  //             window.dataLayer = window.dataLayer || [];
  //             function gtag(){dataLayer.push(arguments);}
  //             gtag('js', new Date());
  //             gtag('config', 'UA-127217040-1');
  //           </script>`,
  //     links: [{
  //       rel: 'stylesheet',
  //       href: '//codemirror.net/theme/dracula.css'
  //     }]
  //   }
  // },
  // themeConfig: {
  //   // logo: {
  //   //   src: "//image.ibb.co/iACdcK/carousel_logo.png",
  //   //   width: "50%"
  //   // },
  //   mode: 'light',
  //   showPlaygroundEditor: true,
  //   codemirrorTheme: 'dracula',
  //   styles: {
  //     body: {
  //       fontFamily: "'Source Sans Pro', Helvetica, sans-serif",
  //       fontSize: 16,
  //       lineHeight: 1.6,
  //     },
  //     container: {
  //       width: '100%',
  //       padding: ['20px 40px'],
  //     },
  //   }
  // },
}
