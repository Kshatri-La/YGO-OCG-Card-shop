<template>
  <nav class="sticky top-0 z-50 w-full p-2 bg-[#2c180e]">
    <div class="h-full w-full rounded-sm border-[4px] border-[#110905] bg-gradient-to-b from-[#5c371d] to-[#3f2513] p-1 shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
      <div class="h-full w-full rounded-sm border-[2px] border-[#0a0502] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d48135] via-[#85451e] to-[#26150b] p-3 text-white">
        
        <div class="container mx-auto flex justify-between items-center">
          <div class="md:w-1/4 flex items-center justify-start">
            <router-link to="/" class="flex flex-col items-center justify-center">
              <div class="font-[Palatino,serif] text-2xl md:text-3xl font-black italic tracking-widest text-[#f0d467] drop-shadow-[0_2px_2px_rgba(0,0,0,1)] uppercase">
                TCG<span class="text-white text-lg md:text-xl">SHOP</span>
              </div>
              <div class="text-[8px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-[#e0c675] shadow-black drop-shadow-md">
                Yu-Gi-Oh! OCG/TCG
              </div>
            </router-link>
          </div>

          <div class="hidden md:block w-2/4 px-4">
            <input 
              :value="appStore.searchQuery"
              @input="appStore.searchQuery = $event.target.value"
              type="text" 
              placeholder="Tìm kiếm 'vd: Dark magicican' hoặc 'vd: ABC-JP001'" 
              class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#f0d467] placeholder-[#a2743a] font-bold tracking-widest uppercase transition" 
            />
          </div>

          <div class="flex items-center justify-end gap-4 md:gap-6 font-[Palatino,serif] uppercase tracking-wider font-bold md:w-1/4">
            
            <!-- Chat Button -->
            <div class="relative">
              <button @click="toggleChat" class="relative group block">
                <span class="text-2xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] hover:scale-110 transition inline-block">💬</span>
                <span v-if="unreadChatCount > 0 && authStore.isAuthenticated" class="absolute -top-1 -right-2 bg-red-700 border border-[#f0d467] text-[#f0d467] text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{{ unreadChatCount }}</span>
              </button>
              <ChatDropdown v-if="showChat" @close="showChat = false" />
            </div>

            <!-- Notifications Button -->
            <div class="relative">
              <button @click="toggleNotif" class="relative group block">
                <span class="text-2xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] hover:scale-110 transition inline-block">🔔</span>
                <span v-if="unreadNotifCount > 0 && authStore.isAuthenticated" class="absolute -top-1 -right-2 bg-red-700 border border-[#f0d467] text-[#f0d467] text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{{ unreadNotifCount }}</span>
              </button>
              <NotificationDropdown 
                v-if="showNotif" 
                :notifications="notifications" 
                @close="showNotif = false"
                @mark-read="markNotifRead"
              />
            </div>

            <div v-if="authStore.isAuthenticated" class="relative">
              <button @click="showProfileMenu = !showProfileMenu" class="flex items-center gap-2 cursor-pointer border border-[#a2743a] px-3 py-1 rounded-sm bg-[#1a0e08] hover:bg-[#2c1a10] transition w-full md:w-auto">
                <div class="w-6 h-6 bg-[#3f2513] border border-[#a2743a] flex justify-center items-center text-[#f0d467] font-black text-xs rounded-sm">
                  {{ authStore.user?.username.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs text-[#f5deb3]">{{ authStore.user?.username }}</span>
                <span class="text-[10px] transform transition-transform" :class="showProfileMenu ? 'rotate-180' : ''">▼</span>
              </button>
              
              <div v-if="showProfileMenu" class="absolute right-0 top-full mt-2 w-40 bg-[#1a0e08] border border-[#a2743a] shadow-[0_10px_30px_rgba(0,0,0,1)] rounded-sm overflow-hidden z-50">
                <router-link v-if="authStore.isAdmin" to="/dashboard" @click="showProfileMenu = false" class="block px-4 py-2 text-xs text-[#e2c76b] hover:bg-[#2c1a10] border-b border-[#3f2513] uppercase font-bold tracking-widest">Bảng Điều Khiển</router-link>
                <router-link to="/profile" @click="showProfileMenu = false" class="block px-4 py-2 text-xs text-[#e2c76b] hover:bg-[#2c1a10] border-b border-[#3f2513] uppercase font-bold tracking-widest">Hồ Sơ (Profile)</router-link>
                <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-[#2c1a10]">Đăng Xuất</button>
              </div>
            </div>
            <router-link v-else to="/login" class="text-[#e2c76b] text-sm hover:text-white transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Đăng nhập</router-link>
            
            <!-- Cart Button -->
            <router-link v-if="!authStore.isAdmin && !authStore.isModer" to="/cart" class="relative group block">
              <span class="text-2xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] hover:scale-110 transition inline-block">🛒</span>
              <span class="absolute -top-1 -right-2 bg-red-700 border border-[#f0d467] text-[#f0d467] text-[11px] font-black px-1.5 py-0.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {{ cartStore.items.length }}
              </span>
            </router-link>

          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useCartStore } from '../store/cart';
import { useAppStore } from '../store/app';
import { useAuthStore } from '../store/auth';
import ChatDropdown from './ChatDropdown.vue';
import NotificationDropdown from './NotificationDropdown.vue';

const cartStore = useCartStore();
const appStore = useAppStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showChat = ref(false);
const showNotif = ref(false);
const showProfileMenu = ref(false);
const unreadChatCount = ref(5); // Có 5 tin mới chưa đọc


const toggleChat = () => {
  showChat.value = !showChat.value;
  if (showChat.value) {
    showNotif.value = false;
    unreadChatCount.value = 0; // Tắt huy hiệu khi đã mở chat
  }
};

const notifications = ref([
  {
    id: 1, type: 'RESTOCK HÀNG HIẾM', title: 'Blue-Eyes White Dragon vừa về hàng!',
    description: 'Thẻ Rồng Trắng Mắt Xanh (Secret Rare) vừa cập bến kho. Số lượng cực kỳ có hạn, nhanh tay săn ngay.',
    image: 'https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg',
    time: '2 phút trước', read: false, showDetails: false, actionLink: '/card/1'
  },
  {
    id: 2, type: 'HỆ THỐNG', title: 'Bảo trì máy chủ V2',
    description: 'Bảo trì thành công hệ thống lên chuẩn V2. Server port 8080 bắt đầu đi vào hoạt động trơn tru.',
    time: '1 giờ trước', read: true, showDetails: false
  }
]);

const unreadNotifCount = computed(() => notifications.value.filter(n => !n.read).length);

const toggleNotif = () => {
  showNotif.value = !showNotif.value;
  if (showNotif.value) showChat.value = false;
};

const handleLogout = async () => {
  showProfileMenu.value = false;
  await authStore.logout();
  router.push('/login');
};

const markNotifRead = (id) => {
  const notif = notifications.value.find(n => n.id === id);
  if (notif) notif.read = true;
};

watch(() => appStore.searchQuery, (newVal) => {
  if (newVal && route.path !== '/') {
    router.push('/');
  }
});
</script>