// Vendor dependencies
const fs = require('fs');
const { join, sep } = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const core = require('./core');

const initPath = join(__dirname + sep + '..' + sep + 'templates');

// Check if "templates" directory exist
if (!fs.existsSync(initPath)) {
  console.log(chalk.red('Templates directory is not exist !'));
  process.exit(1);
}

console.log(
  chalk.green(
    figlet.textSync('vue library', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })
  )
);

console.log(
  chalk.green('Create your own library for vue.js with rollup + babel')
);
console.log('');
console.log('');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'componentName',
      message: 'What is the kebab-case tag name for your component ?'
    }
  ])
  .then(async answers => {
    console.log('✒️  Registry component in', chalk.yellow('components.json'));
    await core.registryComponent(answers);
    console.log(chalk.green('✔️  component registred'));

    console.log('🚀  Generating files');
    await core.generateTemplate(answers, initPath);
  });
