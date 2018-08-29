// Import vue component
import Counter from './../packages/counter/src/main.vue';
import HelloWorld from './../packages/helloworld/src/main.vue';

const components = {
  Counter,
  HelloWorld
};

// install function executed by Vue.use()
export function install(Vue) {
  if (install.installed) return;
  install.installed = true;

  Object.keys(components).forEach(name => {
    Vue.component(name, components[name]);
  });
}

if (typeof window !== 'undefined' && window.Vue) install(window.Vue);

module.exports = {
  version = '0.1.0',
  install,
  Counter,
  HelloWorld
};

module.exports.default = module.exports;
