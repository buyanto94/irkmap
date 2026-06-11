import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading route imports
const Home = () => import('@/pages/Home/ui/Home.vue');
const Catalog = () => import('@/pages/Catalog/ui/Catalog.vue');
const ObjectDetails = () => import('@/pages/ObjectDetails/ui/ObjectDetails.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: Catalog,
    },
    {
      path: '/objects/:slug',
      name: 'object-details',
      component: ObjectDetails,
    },
  ],
});

export default router;
