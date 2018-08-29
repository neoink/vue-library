const fs = require('fs');
const { join, sep } = require('path');
const handlebars = require('handlebars');
const chalk = require('chalk');
const { promisify } = require('util');
const { ensureDirectoryExists } = require('./helpers');

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

// Handlebars Helpers
handlebars.registerHelper('raw-helper', options => options.fn());

const createFile = async (file, from, to, data) => {
  let currentPath;

  if (~to.indexOf('packages')) {
    const directoryPath = to.replace('packages', '');
    currentPath = join(data.componentName, directoryPath, file);
  }

  console.log({ currentPath });

  const source = await readFile(join(from, file), 'utf-8');

  // Handlebars generate template
  const template = handlebars.compile(source);
  const newTemplate = template(data);

  //   ensureDirectoryExists(currentPath, file);
  //   await writeFile(currentPath, newTemplate);

  return currentPath;
};

const core = {};

core.registryComponent = async answers => {
  // Reference component into json
  const componentFile = await readFile(
    join(`${__dirname}${sep}..${sep}components.json`),
    'utf-8'
  );
  const json = JSON.parse(componentFile);

  // If component already exist
  if (typeof json[answers.componentName] !== 'undefined') {
    console.log(
      chalk.red(`Component "${answers.componentName}" is already exist`)
    );
    process.exit(1);
  }

  json[answers.componentName] = `vue-library/packages/${
    answers.componentName
  }/index.js`;

  //   await writeFile('components.json', JSON.stringify(json));
};

core.generateTemplate = (data, directory, to = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const filesOrDirectory = await readDir(directory); // Foreach directories/files

      for (let i = 0, len = filesOrDirectory.length; i < len; i += 1) {
        const currentItem = filesOrDirectory[i];
        const currentPath = directory + sep + currentItem;

        // Verify if current value is directory
        const stats = await lstat(currentPath);
        const isDirectory = stats.isDirectory();

        if (isDirectory) {
          // Directory => recurcise
          let cacheDirectory = currentPath.split(`templates${sep}`)[1];
          await core.generateTemplate(data, currentPath, cacheDirectory);
        } else {
          // Remplace var with Handlebars and write directories/files
          await createFile(currentItem, directory, to, data);
        }
      }

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = core;
