import { NEXT_ITEM, PREV_ITEM } from "../actions/consts";

export const activeIndexReducer = (state, action) => {
  const { limit, itemsToScroll, type } = action;
  switch (type) {
    case NEXT_ITEM: {
      let optimisticNextItem = state + itemsToScroll;
      const nextItem = limit >= optimisticNextItem ? optimisticNextItem : limit;
      return nextItem;
    }

    case PREV_ITEM: {
      let optimisticPrevItem = state - itemsToScroll;
      const prevItem = optimisticPrevItem >= limit ? optimisticPrevItem : limit;
      return prevItem;
    }

    default:
      return state;
  }
};
