// Import vue component
{{#each list}}
import {{pascalify this}} from './../packages/{{ this }}/src/main.vue';  
{{/each}}

const components = {
  {{#each list}}
  {{pascalify this}},
  {{/each}}
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
  version: '{{ version }}',
  install,
  {{#each list}}
  {{pascalify this}},
  {{/each}}
};

module.exports.default = module.exports;
