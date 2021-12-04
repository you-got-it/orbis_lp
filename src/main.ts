import Vue from "vue";
import App from "./App.vue";
import createStore from "./store/index";
import Vuex from "vuex";
import Router from "vue-router";
import { router } from "./router";
Vue.use(Vuex);
const store = createStore();
import "@/assets/scss/app.scss";
Vue.use(Router);
//Vue.use(Router);
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
