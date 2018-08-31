// Libraries
import path from 'path';
import merge from 'deepmerge';
import cleaner from 'rollup-plugin-cleaner';
import minimist from 'minimist';

// Import Plugins config
import plugins from './rollup.plugins';

// Helpers
const { componentConf } = require('./../helpers/tools');

const argv = minimist(process.argv.slice(2)); // Get cli arguments
const componentsFile = require('./../components.json'); // Load libraries DI

// Delete "lib" directory before generate library
const mainPlugins = merge(
  [
    cleaner({
      targets: ['lib']
    })
  ],
  plugins
);

// Rollup config
const rollupConf = [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/lib.common.js',
      format: 'cjs',
      name: 'vueLibrary'
    },
    plugins: mainPlugins
  }
];

// Match DI and replace require directory to "lib" directory entry point
const re = /^vue-library\/packages\/([a-z-]+\/)?([a-z-]+\/)([a-z-].*js)$/;
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

export default config;
