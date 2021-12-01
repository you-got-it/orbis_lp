import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

function errorHandler(err: any) {
  console.log(err);
  console.log(err.response);
  console.log(err.toJSON());
}

Vue.use(Vuex);

const state = () => ({
  state: {
    page: "index",
  },
  forms: {
    title: "",
    description: "",
    first_name: "",
    last_name: "",
    email: "",
  },
});

const getters = {
  state: (state: any) => state.state,
};

const mutations = {
  // setTopProp(state, obj) {
  //   Vue.set(state.table, "top", obj);
  // },
  // setBaseProp(state, obj) {
  //   Vue.set(state.table, "base", { ...obj });
  // },
  setForms(state, obj) {
    Vue.set(state, "forms", { ...obj });
  },
  // setFormsProp(state, obj) {
  //   Vue.set(state.forms, obj.prop, obj.value);
  // },
  // setMenuProp(state, obj) {
  //   Vue.set(state.menu, obj.prop, obj.data);
  // },
};

const actions = {
  submitForm: ({ getters, commit }) => {
    //commit("setMenuProp", { prop: "formsDisabled", data: true });
    const url = `https://script.google.com/macros/s/AKfycbweZMoAig9_fGpZ5aFhe8Hd_Upj8t6L8ch_HNxkphZLPNrcC83v_VA_rXyIo8gzUzvT7g/exec`;

    const data = JSON.stringify(getters.forms);
    console.log(data);
    // if (process.env.NODE_ENV === "development") {
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //       console.log("done");
    //       commit("setMenuProp", { prop: "thankActive", data: true });
    //       commit("setMenuProp", { prop: "formsDisabled", data: false });
    //       resolve();
    //     }, 1000);
    //   });
    // }
    return axios
      .get(url, {
        params: getters.forms,
      })
      .then((result) => {
        console.log("submit", result);
      })
      .catch((err) => {
        //commit("setMenuProp", { prop: "formsDisabled", data: false });
        errorHandler(err);
      });
  },
  // submitForm2: ({ getters, commit }, image) => {
  //   commit("setMenuProp", { prop: "formsDisabled", data: true });
  //   const url = `https://${window.location.host}/umbraco/api/configuratortool/submitquote`;
  //   const top = getters.table.top;
  //   const base = getters.table.base;
  //   const materials: any[] = [];
  //   const data = {
  //     image: image,
  //     fomr: getters.forms,
  //     top: {
  //       depth: top.depth,
  //       length: top.length,
  //       thickness: top.thickness,
  //       radius: top.radius,
  //       shape: top.shape,
  //       edge: dataJSON.top.edges.find((e) => e.id === top.edge).name,
  //       material: materials.find((m) => m.id === top.texture).name,
  //       oversize: top.oversize,
  //     },
  //     base: {
  //       name: dataJSON.bases.find((b) => b.id === base.id).name,
  //       material: base.stone
  //         ? materials.find((m) => m.id === base.texture).name
  //         : base.material,
  //       color: base.color?.hex,
  //       step: base.step,
  //       twopillars: base.twopillars,
  //       height: base.height,
  //     },
  //   };
  //   console.log(data);
  //   if (process.env.NODE_ENV === "development") {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         console.log("done");
  //         commit("setMenuProp", { prop: "thankActive", data: true });
  //         commit("setMenuProp", { prop: "formsDisabled", data: false });
  //         resolve();
  //       }, 1000);
  //     });
  //   }
  //   return axios
  //     .post(url, data)
  //     .then((result) => {
  //       console.log("submit", result);
  //       commit("setMenuProp", { prop: "thankActive", data: true });
  //       commit("setMenuProp", { prop: "formsDisabled", data: false });
  //       if (result && result.data) {
  //         // commit("setProp", {
  //         //   prop: "dataRaw.user.mile",
  //         //   value: result.data.balance
  //         // });
  //       }
  //     })
  //     .catch((err) => {
  //       commit("setMenuProp", { prop: "formsDisabled", data: false });
  //       errorHandler(err);
  //     });
  // },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});
