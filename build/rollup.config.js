// Libraries
import merge from 'deepmerge';
import minimist from 'minimist';
import cleaner from 'rollup-plugin-cleaner';
import visualizer from 'rollup-plugin-visualizer';

// Import Plugins config
import plugins from './rollup.plugins';

// Helpers
const { componentConf } = require('./../helpers/tools');

const argv = minimist(process.argv.slice(2)); // Get cli arguments
const componentsFile = require('./../components.json'); // Load libraries DI

// Add specifics plugins for main bundle
const mainPlugins = merge(
  [
    cleaner({
      targets: ['lib']
    })
    // visualizer({
    //   // sourcemap: true,
    //   open: true,
    //   title: 'Library visualizer'
    // })
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
      name: 'vueLibrary',
      sourcemap: true
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
      sourcemap: true,
      interop: false,
      paths: DIObj
    },
    external: DI,
    plugins
  });
});

const config = rollupConf;

export default config;
