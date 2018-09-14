import styled from "styled-components";

const calcLeft = ({
  isRTL,
  verticalMode,
  isSwiping,
  swipedSliderPosition,
  sliderPosition
}) => {
  if (verticalMode || isRTL) {
    return "auto";
  } else {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
  }
};

const calcRight = ({
  isRTL,
  verticalMode,
  isSwiping,
  swipedSliderPosition,
  sliderPosition
}) => {
  if (!verticalMode && isRTL) {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
  } else {
    return "auto";
  }
};

const calcTop = ({
  verticalMode,
  isSwiping,
  swipedSliderPosition,
  sliderPosition
}) => {
  if (!verticalMode) {
    return "auto";
  } else {
    return `${isSwiping ? swipedSliderPosition : sliderPosition}px`;
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
  flex-direction: ${({ verticalMode }) => (verticalMode ? "column" : "row")};
  min-height: 100%;
  transition: ${calcTransition};
  left: ${calcLeft};
  right: ${calcRight};
  top: ${calcTop};
`;
