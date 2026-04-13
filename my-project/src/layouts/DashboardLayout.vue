<template>
  <div class="h-screen flex bg-[#140b06] text-[#f5deb3] font-[Palatino,serif] overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-gradient-to-b from-[#2c180e] to-[#110905] border-r border-[#a2743a] flex flex-col shadow-[4px_0_15px_rgba(0,0,0,0.8)]">
      <div class="p-6 border-b border-[#3f2513] text-center relative overflow-hidden">
        <div class="absolute inset-0 bg-[#a2743a]/10 filter blur-xl border-t border-[#f0d467] opacity-20 pointer-events-none"></div>
        <h1 class="text-2xl font-black italic tracking-widest text-[#f0d467] drop-shadow-md z-10 relative">COMMAND<br/><span class="text-white text-lg">CENTER</span></h1>
      </div>
      
      <nav class="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
        <!-- Menu chung Moder & Admin -->
        <div class="text-[10px] text-[#8a7251] uppercase font-bold tracking-widest mb-2 mt-4 ml-2">Trung Tâm Xử Lý</div>
        <router-link to="/dashboard/inventory" class="nav-item">Khố Lưu Trữ (Kho)</router-link>
        <router-link to="/dashboard/orders" class="nav-item flex justify-between items-center">
          Đơn Hàng & Giao Dịch
          <span class="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">2</span>
        </router-link>
        <router-link to="/dashboard/chat" class="nav-item flex justify-between items-center">
          Kênh Chat 
          <span class="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">Mới</span>
        </router-link>
        <router-link to="/dashboard/news" class="nav-item">Viết Trạch Báo (News)</router-link>

        <!-- Menu độc quyền Admin -->
        <template v-if="authStore.isAdmin">
          <div class="text-[10px] text-[#8a7251] uppercase font-bold tracking-widest mb-2 mt-6 ml-2">Quyền Lực Tối Cao</div>
          <router-link to="/dashboard/users" class="nav-item text-[#e2c76b]">Quản Lý Nhân Sự</router-link>
          <router-link to="/dashboard/categories" class="nav-item">Cây Phân Nhom (Categories)</router-link>
          <router-link to="/dashboard/settings" class="nav-item">Cấu Hình Lõi</router-link>
          <router-link to="/dashboard/analytics" class="nav-item">Báo Cáo Mật</router-link>
        </template>
      </nav>

      <div class="p-4 bg-[#110905] border-t border-[#3f2513]">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-[#3f2513] border-2 border-[#a2743a] rounded-sm flex justify-center items-center font-bold text-lg text-[#f0d467]">
            {{ authStore.user?.username.charAt(0).toUpperCase() }}
          </div>
          <div class="truncate">
            <p class="text-sm font-bold text-[#f5deb3] truncate">{{ authStore.user?.full_name }}</p>
            <p class="text-[10px] text-[#e2c76b] uppercase font-bold">{{ authStore.user?.role }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full text-center py-2 bg-red-900/50 hover:bg-red-700/80 border border-red-800 text-[#f5deb3] text-xs font-black uppercase tracking-widest rounded-sm transition">
          Ngắt Kết Nối
        </button>
      </div>
    </aside>

    <!-- Main Workspace -->
    <main class="flex-grow flex flex-col bg-[#110905] relative">
      <header class="h-16 border-b border-[#3f2513] bg-[#1a0e08]/80 backdrop-blur flex justify-between items-center px-8 shadow-md">
        <h2 class="text-xl font-bold tracking-wider text-[#e2c76b] uppercase">Bảng Điều Khiển {{ authStore.isAdmin ? 'Toàn Năng' : 'Điều Hành' }}</h2>
        <router-link to="/" class="text-sm font-bold text-[#a2743a] hover:text-[#f0d467] transition border border-[#a2743a] px-3 py-1.5 rounded-sm">
          ⭯ Xem Web Công Khai
        </router-link>
      </header>
      
      <div class="flex-grow p-8 overflow-y-auto custom-scrollbar">
        <!-- Chứa các view con của Dashboard -->
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.nav-item {
  display: block;
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #d1d5db;
  border-radius: 0.125rem;
  transition-property: all;
  transition-duration: 300ms;
  border: 1px solid transparent;
}
.nav-item:hover {
  background-color: #2c1a10;
  color: #f0d467;
  border-color: #3f2513;
  transform: scale(1.02);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
.router-link-exact-active.nav-item {
  background-image: linear-gradient(to right, #5c371d, #3f2513);
  color: white;
  border-color: #a2743a;
  border-left-width: 4px;
  border-left-color: #f0d467;
  filter: drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07));
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5c371d; border-radius: 3px; }
</style>
