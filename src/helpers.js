export const componentPath = directory => {
  let pathResult = 'vacalians-ui/lib/';
  if (directory[3] === '') {
    pathResult += directory[2].replace('/', '');
  } else {
    pathResult += directory[2].split('/')[0] + directory[3];
  }

  return pathResult;
};
