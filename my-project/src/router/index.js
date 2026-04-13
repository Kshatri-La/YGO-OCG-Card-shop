import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import DetailView from '../components/DetailView.vue';
import CartView from '../components/CartView.vue';
import LoginView from '../components/LoginView.vue';

import RegisterView from '../components/RegisterView.vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import DashboardHome from '../admin/DashboardHome.vue';
import AddCardView from '../components/AddCardView.vue';
import ProfileView from '../components/ProfileView.vue';
import CheckoutView from '../components/CheckoutView.vue';
import QrPayment from '../components/QrPayment.vue';
import PaymentSuccess from '../components/PaymentSuccess.vue';
import QrConfirm from '../components/QrConfirm.vue';
import { useAuthStore } from '../store/auth';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/card/:id', name: 'detail', component: DetailView },
  { path: '/cart', name: 'cart', component: CartView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/checkout/qr-payment', name: 'qr-payment', component: QrPayment, meta: { requiresAuth: true } },
  { path: '/payment-success', name: 'payment-success', component: PaymentSuccess, meta: { requiresAuth: true } },
  { path: '/qr-confirm', name: 'qr-confirm', component: QrConfirm },
  
  
  // Dashboard Tuyến tính cho Admin và Moder
  { 
    path: '/admin',
    redirect: '/dashboard'
  },
  { 
    path: '/moder',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresModer: true }, // Cho phép Admin VÀ Moder vào layout tổng
    children: [
      { path: '', name: 'dashboard-home', component: DashboardHome },
      { path: 'inventory', name: 'inventory', component: AddCardView },
      { path: 'orders', name: 'orders', component: () => import('../admin/OrderManager.vue') },
      { path: 'chat', name: 'chat', component: () => import('../admin/ChatManager.vue') },
      { path: 'news', name: 'news', component: () => import('../admin/NewsManager.vue') },
      
      // Độc quyền Admin
      { path: 'users', name: 'users', component: () => import('../admin/UserManager.vue') },
      { path: 'categories', name: 'categories', component: () => import('../admin/CategoryManager.vue') },
      { path: 'settings', name: 'settings', component: () => import('../admin/SettingsManager.vue') },
      { path: 'analytics', name: 'analytics', component: () => import('../admin/AnalyticsManager.vue') }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Middleware Bảo vệ giao diện khách
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next('/login');
  }
  
  if (to.meta.requiresModer && !authStore.isAdmin && !authStore.isModer) {
    return next('/login');
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  next();
});

export default router;
