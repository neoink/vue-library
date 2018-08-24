// Libraries
import path from 'path';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify-es';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import minimist from 'minimist';
import progress from 'rollup-plugin-progress';

// Helpers
import { componentPath } from './../src/helpers';

const argv = minimist(process.argv.slice(2)); // Get cli arguments
const componentsFile = require('./../components.json'); // Load libraries DI

// Rollup Plugins
const plugins = [
  vue({
    css: true,
    compileTemplate: true,
    template: { optimizeSSR: true }
  }),
  babel({
    exclude: 'node_modules/**'
  }),
  alias({
    'vacalians-ui': path.resolve(__dirname, '../')
  }),
  progress()
];

// Match DI and replace require directory to "lib" directory entry point
const re = /^(vacalians-ui\/src\/packages\/)([a-z]+(.*)\/)([a-z].*js)$/;
const DI = Object.keys(componentsFile).map(value => componentsFile[value]);
const DIObj = {};

Object.keys(componentsFile).forEach(value => {
  const result = componentsFile[value].match(re);
  DIObj[componentsFile[value]] = componentPath(result);
});

const config = [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/lib.common.js',
      format: 'cjs',
      name: 'vacaliansUi'
    },
    plugins
  },
  {
    input: 'src/packages/options/index.js',
    output: {
      file: 'lib/options.js',
      format: 'cjs',
      name: 'Options'
    },
    plugins
  },
  {
    input: 'src/packages/counter/index.js',
    output: {
      file: 'lib/counter.js',
      format: 'cjs',
      name: 'Counter',
      interop: false,
      paths: DIObj
    },
    external: DI,
    plugins
  },
  {
    input: 'src/packages/helloworld/index.js',
    output: {
      file: 'lib/hello-world.js',
      format: 'cjs',
      name: 'HelloWorld',
      interop: false,
      paths: DIObj
    },
    external: DI,
    plugins
  }
];

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
