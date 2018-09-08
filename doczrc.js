import path from 'path'

export default {
  ordering: "ascending",
  modifyBundlerConfig: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-elastic-carousel":path.join(__dirname, "/src/react-elastic-carousel/index.js")
    }
    return config;
  },
  htmlContext: {
    head: {
      links: [{
        rel: 'stylesheet',
        href: 'https://codemirror.net/theme/dracula.css'
      }]
    }
  },
  themeConfig: {
    logo: {
      src: "http://cdn.onlinewebfonts.com/svg/img_569227.png",
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