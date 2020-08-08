import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import copy from "rollup-plugin-copy";
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import resolve from 'rollup-plugin-node-resolve';
import url from 'rollup-plugin-url';
import alias from 'rollup-plugin-alias';

import pkg from './package.json'

import libName from './libName';

export default {
  input: `src/${libName}/index.js`,
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    alias({
      [libName]: `./src/${libName}/index.js`
    }),
    external(),
    postcss({
      modules: false
    }),
    url(),
    babel({
      exclude: 'node_modules/**',
      plugins: [ '@babel/external-helpers' ]
    }),
    resolve(),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'node_modules/react-is/index.js': ['isValidElementType']
      }
    }),
    copy({
      targets: [{ src: `src/${libName}/index.d.ts`, dest: "dist" }],
    })
  ]
}
