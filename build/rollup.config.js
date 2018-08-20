// rollup.config.js
import path from 'path';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify-es';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const componentsFile = require('./../components.json'); // Load library DI

// Match DI and replace on "lib" entry point
const DI = Object.keys(componentsFile).map(value => componentsFile[value]);
const DIObj = {};
Object.keys(componentsFile).forEach(value => {
  const splitDI = componentsFile[value].split('/');
  DIObj[componentsFile[value]] = `${splitDI[0]}/lib/${splitDI[3]}`;
});

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
  })
];

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
