import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import alias from "rollup-plugin-alias";
import serve from "rollup-plugin-serve";
import replace from "@rollup/plugin-replace";
import livereload from 'rollup-plugin-livereload'

import libName from "./libName";

import * as ReactNamedExports from 'react';
import * as ReactIsNamedExports from 'react-is';

export default {
  input: `demoApp/src/index.js`,
  output: [
    {
      file: "demoApp/dist/bundle.js",
      format: "cjs",
      sourcemap: true,
      exports: "named",
    },
  ],
  plugins: [
    alias({
      "react-elastic-carousel": `src/${libName}/index.js`,
    }),
    //external(),
    postcss({
      modules: false,
    }),
    url(),
    babel({
      exclude: "node_modules/**",
      plugins: ["@babel/external-helpers"],
    }),
    resolve(),
    commonjs({
      include: "node_modules/**",
      namedExports: {
        "node_modules/react-is/index.js": Object.keys(ReactIsNamedExports),
        "node_modules/react/index.js": Object.keys(ReactNamedExports),
      },
    }),
    serve({
      open: true,
      contentBase: "demoApp/dist",
    }),
    livereload(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
  ],
};
