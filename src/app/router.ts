import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';

// Lazy loading route imports
const Home = () => import('@/pages/Home/ui/Home.vue');
const Catalog = () => import('@/pages/Catalog/ui/Catalog.vue');
const ObjectDetails = () => import('@/pages/ObjectDetails/ui/ObjectDetails.vue');

// Auth imports
const Login = () => import('@/pages/Auth/ui/Login.vue');
const Register = () => import('@/pages/Auth/ui/Register.vue');
const RegisterBusiness = () => import('@/pages/Auth/ui/RegisterBusiness.vue');

// Dashboard imports
const DashboardHome = () => import('@/pages/Dashboard/ui/DashboardHome.vue');

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
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
    },
    {
      path: '/register-business',
      name: 'register-business',
      component: RegisterBusiness,
    },
    {
      path: '/dashboard',
      name: 'dashboard-home',
      component: DashboardHome,
      meta: { requiresAuth: true }
    },
    {
      path: '/objects/:slug',
      name: 'object-details-legacy',
      component: ObjectDetails,
    },
    {
      path: '/:categorySlug/:slug',
      name: 'object-details',
      component: ObjectDetails,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
