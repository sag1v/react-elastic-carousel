import styled from "styled-components";

const calcLeft = ({
  isRTL,
  isSwiping,
  swipedSliderPosition,
  sliderPosition
}) => {
  if (isRTL) {
    return "auto";
  } else {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
  }
};

const calcRight = ({
  isRTL,
  isSwiping,
  swipedSliderPosition,
  sliderPosition
}) => {
  if (isRTL) {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
  } else {
    return "auto";
  }
};

const calcTransition = ({ isSwiping, transitionMs, easing, tiltEasing }) => {
  const duration = isSwiping ? 250 : transitionMs;
  const effectiveEasing = isSwiping ? tiltEasing : easing;
  return `all ${duration}ms ${effectiveEasing}`;
};

export default styled.div`
  position: absolute;
  display: flex;
  min-height: 100%;
  transition: ${calcTransition};
  left: ${calcLeft};
  right: ${calcRight};
`;
