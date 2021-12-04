import Vue from "vue";
import Router from "vue-router";
import AR from "./components/AR.vue";
import Forms from "./components/Forms.vue";
import LearnMore from "./components/LearnMore.vue";

export const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
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
    {
      path: "/share",
      component: Forms,
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
