// External dependencies
const fs = require('fs');
const { join, sep } = require('path');
const handlebars = require('handlebars');
const chalk = require('chalk');
const { promisify } = require('util');
const rimraf = require('rimraf');

// Dependencies
const { ensureDirectoryExists, pascalify } = require('./../helpers/tools');

// Promisify fs functions
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);

// Handlebars Helpers
handlebars.registerHelper('raw-helper', options => options.fn());
handlebars.registerHelper('pascalify', name => pascalify(name));

const core = {};

core.createFile = async (file, from, to, data) => {
  let currentPath = join(to, file);

  if (~to.indexOf('packages')) {
    const directoryPath = to.replace('packages', '');
    currentPath = join('packages', data.componentName, directoryPath, file);
  }

  const source = await readFile(join(from, file), 'utf-8');

  // Handlebars generate template
  const template = handlebars.compile(source);
  const newTemplate = template(data);

  ensureDirectoryExists(currentPath, file);
  await writeFile(currentPath, newTemplate);

  return currentPath;
};

core.registryHandler = async data => {
  // Reference component into json
  const componentFile = await readFile(
    join(`${__dirname}${sep}..${sep}components.json`),
    'utf-8'
  );
  const json = JSON.parse(componentFile);

  if (data.action === 'add') {
    // If component already exist => exit
    if (typeof json[data.componentName] !== 'undefined') {
      console.log(chalk.red(`Component "${data.componentName}" already exist`));
      process.exit(1);
    }

    json[data.componentName] = `vue-library/packages/${
      data.componentName
    }/index.js`;
  } else if (data.action === 'delete') {
    // If component not exist => exit
    if (typeof json[data.componentName] === 'undefined') {
      console.log(chalk.red(`Component "${data.componentName}" not exist`));
      process.exit(1);
    }

    delete json[data.componentName];
  }

  await writeFile('components.json', JSON.stringify(json, null, '\t'));
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
          await core.createFile(currentItem, directory, to, data);
        }
      }

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
};

core.removeFiles = data => {
  rimraf(`packages/${data.componentName}`, () => true);
};

module.exports = core;
