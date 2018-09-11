export const noop = () => {};

export const numberToArray = n => [...Array(n).keys()];

export const cssPrefix = className => `rec rec-${className}`;

export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

export const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
