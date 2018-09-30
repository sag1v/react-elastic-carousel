import React from "react";
import Dot from "../Dot";
import { mount } from "enzyme";

describe("Dot", () => {
  it("renders", () => {
    mount(<Dot />);
  });
});
