// rollup.config.js
import path from 'path';
import vue from 'rollup-plugin-vue';
import uglify from 'rollup-plugin-uglify-es';
import babel from 'rollup-plugin-babel';
import alias from 'rollup-plugin-alias';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const componentsFile = require('./../components.json');

const externals = [];
Object.keys(componentsFile).forEach(function(key) {
  externals[`vacalians-ui/src/packages/${key}`] = `vacalians-ui/lib/${key}`;
});

console.log(externals);

// Load library DI
const DI = Object.keys(componentsFile).map(value => {  
  return path.resolve(__dirname, `../${componentsFile[value]}`);
});

console.log(DI);


// externals["vacalians-ui/src/packages/options/index.js"] = 'vacalians-ui/lib/options';

const plugins = [
  vue({
    css: true,
    compileTemplate: true,
    template: { optimizeSSR: true },
  }),
  babel({
    exclude: 'node_modules/**',
  }),
  alias({
    'vacalians-ui': path.resolve(__dirname, '../'),
  }),
];

const config = [
  {
    input: 'src/index.js',
    output: {
      file: 'lib/lib.common.js',
      format: 'cjs',
      name: 'vacaliansUi',
    },
    plugins,
  },
  {
    input: 'src/packages/options/index.js',
    output: {
      file: 'lib/options.js',
      format: 'cjs',
      name: 'Options',      
    },    
    plugins,
  },
  {
    input: 'src/packages/counter/index.js',
    output: {
      file: 'lib/counter.js',
      format: 'cjs',
      name: 'Counter',
      interop: false,
    },
    external: DI,
    plugins,
  },
  {
    input: 'src/packages/helloworld/index.js',
    output: {
      file: 'lib/hello-world.js',
      format: 'cjs',
      name: 'HelloWorld',
      interop: false,
    },
    external: externals,
    plugins,
  },
];

// Only minify browser (iife) version
if (argv.format === 'iife') {
  config.plugins.push(uglify());
}

export default config;
