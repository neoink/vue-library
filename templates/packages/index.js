import {{ componentNamePascal }} from './src/main.vue';

{{ componentNamePascal }}.install = function(Vue) {
  Vue.component({{ componentNamePascal }}.name, {{ componentNamePascal }});
};

export default {{ componentNamePascal }};
