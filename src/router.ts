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
      path: '/search',
      name: 'search',
      component: () => import('./views/Search.vue'),
    },
    {
      path: '/channel/:channelId',
      name: 'channel',
      component: () => import('./views/Channel.vue'),
    },
    ...(process.env.NODE_ENV === 'development'
      ? [
        {
          path: '/deidentify',
          name: 'deidentify',
          component: () => import('./views/Deidentify.vue'),
        },
      ]
      : []),
  ],
});
