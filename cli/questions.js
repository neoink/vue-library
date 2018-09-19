const componentsFile = require('./../components.json'); // Load libraries DI

module.exports = [
  {
    type: 'list',
    name: 'action',
    message: 'What do you want to do ?',
    choices: [
      { name: 'Add component', value: 'add' },
      { name: 'Delete component', value: 'delete' }
    ]
  },
  {
    when: answer => {
      if (answer.action === 'add') {
        return true;
      }
    },
    type: 'input',
    name: 'componentName',
    message: 'What is the tag name for your component ?'
  },
  {
    when: answer => {
      if (answer.action === 'delete') {
        return true;
      }
    },
    type: 'list',
    name: 'componentName',
    message: 'What is the component you want to delete ?',
    default: false,
    choices: () => {
      const list = Object.keys(componentsFile).map(keys => {
        return keys;
      });

      return list;
    }
  },
  {
    when: answer => {
      if (
        answer.action === 'delete' &&
        typeof answer.componentName !== 'undefined'
      ) {
        return true;
      }
    },
    type: 'confirm',
    name: 'deleteConfirmation',
    message: answer => {
      return `Are you sure to delete "${answer.componentName}" component ?`;
    }
  }
];
