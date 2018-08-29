// External dependencies
const fs = require('fs');
const { join, sep } = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

// Dependencies
const core = require('./../cli/core');
const { pascalify } = require('./../helpers/tools');
const componentsFile = require('./../components.json'); // Load libraries DI
const { version, description } = require('./../package.json');

const initPath = join(`${__dirname}${sep}..${sep}templates`);

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  console.log(chalk.red('Templates directory is not exist !'));
  process.exit(1);
}

// Figlet
console.log(
  chalk.green(
    figlet.textSync('vue library', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(chalk.green(`version : ${version}`));
console.log(chalk.green(description));
console.log('');
console.log('');

// Questions & treatments
inquirer
  .prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the kebab-case tag name for your component ?'
    }
  ])
  .then(async data => {
    let spinner;

    const indexVar = Object.keys(componentsFile).map(keys => {
      return keys;
    });
    indexVar.push(data.componentName);

    data.list = indexVar;
    data.componentNamePascal = pascalify(data.componentName);
    data.version = version;

    console.log('✒️  Registry component in', chalk.yellow('components.json'));
    spinner = ora('Generating templates...').start();
    await core.registryComponent(data);
    spinner.succeed(chalk.green('Component registred'));

    console.log('🚀  Generating files');
    spinner = ora('Generating files...').start();
    await core.generateTemplate(data, initPath);
    spinner.succeed(chalk.green('Files generated'));
  });
