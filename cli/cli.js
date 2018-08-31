// External dependencies
const fs = require('fs');
const { join, sep } = require('path');
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');

// Dependencies
const core = require('./core');
const questions = require('./questions');
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
inquirer.prompt(questions).then(async data => {
  let spinner;
  const indexVar = Object.keys(componentsFile).map(keys => {
    return keys;
  });

  data.list = indexVar;
  data.componentNamePascal = pascalify(
    data.componentName || data.componentNameDel
  );
  data.version = version;

  // ** Add component **
  if (data.action === 'add') {
    data.list.push(data.componentName);

    // Editing registry
    console.log('✒️  Registry component in', chalk.yellow('components.json'));
    spinner = ora('Editing Registry...').start();
    await core.registryHandler(data);
    spinner.succeed(chalk.green('Component registred'));

    // Generating files
    console.log('🚀  Generating files');
    spinner = ora('Generating files...').start();
    await core.generateTemplate(data, initPath);
    spinner.succeed(chalk.green('Files generated'));
  }
  // ** Delete component **
  else if (data.action === 'delete') {
    if (data.deleteConfirmation === 'no') {
      console.log(chalk.green('Deleting component aborted'));
      process.exit(0);
    }

    delete data.list[data.componentName];

    // Editing registry
    console.log(
      `✒️  Remove ${chalk.yellow(
        data.componentNameDel
      )} component's registry in`,
      chalk.yellow('components.json')
    );
    spinner = ora('Editing Registry...').start();
    await core.registryHandler(data);
    spinner.succeed(chalk.green("Component's registry removed"));

    // Removing files & editing index.js for main library
    console.log('✒️  Remove files');
    spinner = ora('Files removing...').start();
    await core.removeFiles(data);
    await core.generateTemplate(data, join(initPath, 'src'));
    spinner.succeed(chalk.green('Files deleted'));
  }
});
