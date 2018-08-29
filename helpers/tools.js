const fs = require('fs');
const path = require('path');

const tools = {};

// Pascalify component name
tools.pascalify = str => {
  const camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase());
  return camelized.charAt(0).toUpperCase() + camelized.slice(1);
};

// Helper to ensure directory exists before writing file to it
tools.ensureDirectoryExists = filePath => {
  const dirname = path.dirname(filePath);

  if (fs.existsSync(dirname)) {
    return true;
  }

  tools.ensureDirectoryExists(dirname);
  fs.mkdirSync(dirname);
};

// Export component config for rollup
tools.componentConf = (directory, name) => {
  const cmpName = tools.pascalify(name);
  const inputFile = directory[0].replace('vue-library/', '');
  const outputFile = `lib/${name}.js`;

  let pathRewrite = 'vue-library/lib/';

  if (typeof directory[1] === 'undefined') {
    pathRewrite += directory[2].replace('/', '');
  } else {
    pathRewrite += directory[1] + directory[2].replace('/', '');
  }

  return {
    pathRewrite,
    cmpName,
    inputFile,
    outputFile
  };
};

module.exports = tools;
