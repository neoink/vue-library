// Libraries
import path from 'path';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify-es';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import minimist from 'minimist';
import filesize from 'rollup-plugin-filesize';

// Helpers
const { componentConf } = require('./../helpers/tools');

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
    'vue-library': path.resolve(__dirname, '../')
  }),
  filesize()
];

// Rollup config
const rollupConf = [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/lib.common.js',
      format: 'cjs',
      name: 'vueLibrary'
    },
    plugins
  }
];

// Match DI and replace require directory to "lib" directory entry point
const re = /^vue-library\/packages\/([a-z]+\/)?([a-z]+\/)([a-z].*js)$/;
const DI = Object.keys(componentsFile).map(value => componentsFile[value]);
const DIObj = {};

Object.keys(componentsFile).forEach(value => {
  const result = componentsFile[value].match(re);
  const cmpConfig = componentConf(result, value);

  // Define alias
  DIObj[componentsFile[value]] = cmpConfig.pathRewrite;

  // Push component config to global config
  rollupConf.push({
    input: cmpConfig.inputFile,
    output: {
      file: cmpConfig.outputFile,
      format: 'cjs',
      name: cmpConfig.cmpName,
      interop: false,
      paths: DIObj
    },
    external: DI,
    plugins
  });
});

const config = rollupConf;

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
