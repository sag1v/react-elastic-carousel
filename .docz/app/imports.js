export const imports = {
  'index.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "index" */ 'index.mdx'),
  'components/mdx/breakpoints.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-breakpoints" */ 'components/mdx/breakpoints.mdx'),
  'components/mdx/easing.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-easing" */ 'components/mdx/easing.mdx'),
  'components/mdx/enableAutoPlay.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-enable-auto-play" */ 'components/mdx/enableAutoPlay.mdx'),
  'components/mdx/focusOnSelect.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-focus-on-select" */ 'components/mdx/focusOnSelect.mdx'),
  'components/mdx/initialFirstItem.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-initial-first-item" */ 'components/mdx/initialFirstItem.mdx'),
  'components/mdx/isRTL.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-is-rtl" */ 'components/mdx/isRTL.mdx'),
  'components/mdx/itemPadding.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-item-padding" */ 'components/mdx/itemPadding.mdx'),
  'components/mdx/itemPosition.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-item-position" */ 'components/mdx/itemPosition.mdx'),
  'components/mdx/itemsToScroll.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-items-to-scroll" */ 'components/mdx/itemsToScroll.mdx'),
  'components/mdx/itemsToShow.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-items-to-show" */ 'components/mdx/itemsToShow.mdx'),
  'components/mdx/onUserNext.mdx': () =>
    import(/* webpackPrefetch: true, webpackChunkName: "components-mdx-on-user-next" */ 'components/mdx/onUserNext.mdx'),
}
