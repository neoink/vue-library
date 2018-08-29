import Counter from './src/main.vue';

Counter.install = function(Vue) {
  Vue.component(Counter.name, Counter);
};

export default Counter;
