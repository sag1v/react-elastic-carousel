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
  description: pkg.description,
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      [libName]:path.join(__dirname, `/src/${libName}/index.js`)
    }
    return config;
  },
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        href: '//codemirror.net/theme/dracula.css'
      }]
    }
  },
  themeConfig: {
    logo: {
      src: "//cdn.onlinewebfonts.com/svg/img_569227.png",
      width: 50
    },
    mode: 'light',
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