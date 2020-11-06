import React from "react";
import { mount, shallow } from "enzyme";
import Carousel from "../Carousel";
import Slider from "../styled/Slider";
import Pagination from "../Pagination/Pagination";
import { numberToArray } from "../../utils/helpers";

describe("Carousel - public API (props)", () => {
  const Items = numberToArray(5).map(i => (
    <div className="test-child" key={i}>
      {i}
    </div>
  ));

  it("renders without crashing", () => {
    shallow(<Carousel>{Items}</Carousel>);
  });

  it("renders children", () => {
    const wrapper = mount(<Carousel>{Items}</Carousel>);
    const children = wrapper.find(Carousel).find(".test-child");
    expect(children.length).toEqual(Items.length);
  });

  it("one child wont break on next", () => {
    const wrapper = mount(<Carousel>{Items[0]}</Carousel>);
    const nextButton = wrapper.find(Carousel).find("button.rec-arrow-right");
    nextButton.simulate("click");
  });

  it("renders with className in root", () => {
    const testClassName = "test-root";
    const wrapper = mount(
      <Carousel className={testClassName}>{Items}</Carousel>
    );
    const carousel = wrapper.first();
    expect(carousel.hasClass(testClassName));
  });

  it("renders with style in root", () => {
    const styleToRender = { position: "fixed" };
    const wrapper = mount(<Carousel style={styleToRender}>{Items}</Carousel>);
    const carousel = wrapper.getDOMNode();
    expect(carousel.style.position).toEqual("fixed");
  });

  it("verticalMode", () => {
    const wrapper = shallow(<Carousel verticalMode>{Items}</Carousel>);
    const slider = wrapper.find(Slider);
    expect(slider.props().verticalMode).toEqual(true);
  });

  it("isRTL", () => {
    const wrapper = shallow(<Carousel isRTL>{Items}</Carousel>);
    const slider = wrapper.find(Slider);
    expect(slider.props().isRTL).toEqual(true);
  });

  it("pagination", () => {
    const wrapper = shallow(<Carousel pagination>{Items}</Carousel>);
    const pagination = wrapper.find(Pagination);
    expect(pagination.exists()).toEqual(true);
  });

  it("renderPagination (renders custom pagination)", () => {
    const CustomPagination = () => <div>test</div>;
    const renderPagination = () => <CustomPagination />;
    const wrapper = shallow(
      <Carousel renderPagination={renderPagination}>{Items}</Carousel>
    );

    const customPagination = wrapper.find(CustomPagination);
    expect(customPagination.exists()).toEqual(true);
  });
});
