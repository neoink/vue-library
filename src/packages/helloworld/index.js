import HelloWorld from './src/main.vue';

HelloWorld.install = function(Vue) {
  Vue.component(HelloWorld.name, HelloWorld);
};

export default HelloWorld;
