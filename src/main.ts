import Vue from "vue";
import App from "./App.vue";
import store from "./store/index";
// import Router from 'vue-router';
// import { router } from './router';

import "@/assets/scss/app.scss";

//Vue.use(Router);

Vue.config.productionTip = false;
new Vue({
  store,
  render: (h) => h(App),
}).$mount("#app");
