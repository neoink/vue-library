export const pascalify = str => {
  const camelized = str.replace(/-([a-z])/g, c => c[1].toUpperCase());
  return camelized.charAt(0).toUpperCase() + camelized.slice(1);
};

export const componentConf = (directory, name) => {
  const cmpName = pascalify(name);
  const inputFile = directory[0].replace('vacalians-ui/', '');
  const outputFile = `lib/${name}.js`;

  let pathRewrite = 'vacalians-ui/lib/';

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
