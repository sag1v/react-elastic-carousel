export const imports = {
  'src/docs/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-index" */ 'src/docs/index.mdx'),
  'src/docs/components/mdx/Basic.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-basic" */ 'src/docs/components/mdx/Basic.mdx'),
  'src/docs/components/mdx/Pagination.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-pagination" */ 'src/docs/components/mdx/Pagination.mdx'),
  'src/docs/components/mdx/Breakpoints.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-breakpoints" */ 'src/docs/components/mdx/Breakpoints.mdx'),
}
