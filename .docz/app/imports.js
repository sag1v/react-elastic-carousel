export const imports = {
  'src/docs/doc.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-doc" */ 'src/docs/doc.mdx'),
}
