import Vue from "vue";
import Router from "vue-router";
import AR from "./components/AR.vue";
import LearnMore from "./components/LearnMore.vue";

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "",
      redirect: "memories",
    },
    {
      path: "/info",
      component: LearnMore,
      props: {},
    },
    {
      path: "/memories",
      component: AR,
      props: {},
    },
    { path: "*", redirect: "memories" },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     document.title = to.meta.title;
//   }

// });
