function carouselReducer(state, action) {
  switch (action.type) {
    case "slider_resize":
    case "container_resize":
    case "set_child_width": {
      return {
        ...state,
        ...payload
      };
    }

    default:
      break;
  }
}

export default carouselReducer;
