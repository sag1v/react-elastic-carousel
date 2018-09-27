import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import Carousel from "../Carousel";
import { numberToArray } from '../../utils/helpers';
import { debug } from 'util';


describe("Carousel - public API (props)", () => {
    const Items = numberToArray(5).map(i => <div className="test-child" key={i}>{i}</div>);

    it('renders without crashing', () => {
        shallow(<Carousel>{Items}</Carousel>);
    });

    it("renders children", () => {
        const wrapper = mount(<Carousel>{Items}</Carousel>);
        const children = wrapper.find(Carousel).find('.test-child');
        expect(children.length).toEqual(Items.length);
    });

    it("renders with className in root", () => {
        const testClassName = "test-root";
        const wrapper = mount(<Carousel className={testClassName}>{Items}</Carousel>);
        const carousel = wrapper.first();
        expect(carousel.hasClass(testClassName));
    });

    it("renders with style in root", () => {
        const styleToRender = {position: 'fixed'};
        const wrapper = mount(<Carousel style={styleToRender}>{Items}</Carousel>);
        const carousel = wrapper.getDOMNode();
        expect(carousel.style.position).toEqual('fixed');
    });

    it("isRTL", () => {
        const wrapper = shallow(<Carousel isRTL>{Items}</Carousel>);
        const inner = wrapper.first();
        expect(inner.props().isRTL).toEqual(true);
    });
});