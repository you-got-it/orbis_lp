import Vue from 'vue';
import Router from 'vue-router';
import AR from './components/AR.vue';
import HintScreen from './components/HintScreen.vue';


export const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '',
      redirect: 'start',
    },  
    {
      path: '/start',
      component: HintScreen,
      props: {

      },
    },   
    {
      path: '/ar',
      component: AR,
      props: {

      },
    },   
    { path: '*', redirect: 'start' },
  ],
});

// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     document.title = to.meta.title;
//   }

// });
