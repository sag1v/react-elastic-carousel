export const noop = () => {};

export const numberToArray = n => [...Array(n).keys()];

export const cssPrefix = (...classNames) => {
  const prefix = "rec";
  const space = " ";
  let result = `${prefix}`; // initial it with global prefix;

  // in case of an array we add the class prefix per item;
  const chainedClasses = classNames.reduce((acc, current) => {
    if (current) {
      acc += `${space}${prefix}-${current}`; // we must keep spaces between class names
    }
    return acc;
  }, "");
  result += chainedClasses;

  return result;
};

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
