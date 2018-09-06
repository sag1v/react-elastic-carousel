export default {
  logo:{ 
   src: "https://cdn.iconscout.com/icon/premium/png-512-thumb/elastic-band-2-670638.png",
   width: 250
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