import * as helpers from "../helpers";

describe("helpers", () => {
  it("numberToArray", () => {
    const length = 5;
    const arr = helpers.numberToArray(length);
    expect(Array.isArray(arr)).toEqual(true);
    expect(arr.length).toEqual(length);
  });

  it("cssPrefix", () => {
    const css = helpers.cssPrefix("test");
    expect(css).toEqual("rec rec-test");
  });

  it("cssPrefix multi keys", () => {
    const css = helpers.cssPrefix("test", "test2");
    expect(css).toEqual("rec rec-test rec-test2");
  });

  it("pipe", () => {
    const inc = num => num + 1;
    const double = num => num * 2;
    const split = num => num / 2;

    const result = split(double(inc(2)));
    const piped = helpers.pipe(
      inc,
      double,
      split
    );
    expect(result).toEqual(piped(2));
  });
});
