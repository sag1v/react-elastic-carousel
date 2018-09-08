export const imports = {
  'src/docs/index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-index" */ 'src/docs/index.mdx'),
  'src/docs/components/mdx/easing.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-easing" */ 'src/docs/components/mdx/easing.mdx'),
  'src/docs/components/mdx/breakpoints.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-breakpoints" */ 'src/docs/components/mdx/breakpoints.mdx'),
  'src/docs/components/mdx/enableAutoPlay.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-enable-auto-play" */ 'src/docs/components/mdx/enableAutoPlay.mdx'),
  'src/docs/components/mdx/initialFirstItem.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-initial-first-item" */ 'src/docs/components/mdx/initialFirstItem.mdx'),
  'src/docs/components/mdx/focusOnSelect.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-focus-on-select" */ 'src/docs/components/mdx/focusOnSelect.mdx'),
  'src/docs/components/mdx/isRTL.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-is-rtl" */ 'src/docs/components/mdx/isRTL.mdx'),
  'src/docs/components/mdx/itemPadding.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-item-padding" */ 'src/docs/components/mdx/itemPadding.mdx'),
  'src/docs/components/mdx/itemsToScroll.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-items-to-scroll" */ 'src/docs/components/mdx/itemsToScroll.mdx'),
  'src/docs/components/mdx/itemsToShow.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-items-to-show" */ 'src/docs/components/mdx/itemsToShow.mdx'),
  'src/docs/components/mdx/onUserNext.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "src-docs-components-mdx-on-user-next" */ 'src/docs/components/mdx/onUserNext.mdx'),
}
