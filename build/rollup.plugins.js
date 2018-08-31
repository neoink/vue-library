import path from 'path';
import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import filesize from 'rollup-plugin-filesize';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';
import sourcemaps from 'rollup-plugin-sourcemaps';
import visualizer from 'rollup-plugin-visualizer';

export default [
  commonjs({
    include: ['node_modules/**']
  }),
  nodeResolve({
    browser: true,
    jsnext: true,
    main: true
  }),
  vue({
    css: true,
    compileTemplate: true,
    template: { optimizeSSR: true }
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  alias({
    'vue-library': path.resolve(__dirname, '../')
  }),
  cleanup({
    comments: ['eslint', /^\*-/],
    extensions: ['.js', '.vue']
  }),
  sourcemaps(),
  filesize(),
  visualizer({
    sourcemap: true,
    open: true
  })
];
