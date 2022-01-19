import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/channel/:channelName',
      name: 'channel',
      component: () => import('./views/Channel.vue'),
    },
  ],
});
