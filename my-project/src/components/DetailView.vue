<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8" v-if="card">
      <button @click="$router.back()" class="mb-6 text-[#f0d467] hover:text-white uppercase font-bold tracking-widest flex items-center gap-2 border border-[#a2743a] px-4 py-2 rounded-sm w-max bg-[#2c1a10] hover:bg-[#3f2513] transition drop-shadow-md">← Quay Lại</button>
      <div class="flex flex-col md:flex-row gap-8 bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] relative">
        <!-- Magic Inner Border effect -->
        <div class="absolute inset-2 border border-[#f0d467] opacity-20 pointer-events-none rounded-sm"></div>
        
        <div class="w-full md:w-1/3 relative z-10">
          <div class="p-2 border-2 border-[#110905] bg-[#0a0502] shadow-[0_4px_15px_rgba(0,0,0,0.8)] rounded-sm relative">
            <img :src="card.image_url" @error="card.imageError = true; $event.target.src='https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg'" class="w-full rounded-sm border-[3px] border-[#a2743a]" />
            <div v-if="card.imageError" class="absolute bottom-6 left-6 right-6 bg-gradient-to-r from-red-600/95 to-red-900/95 text-white text-xs font-black tracking-[0.2em] uppercase py-2 px-3 rounded-sm border border-[#a2743a] shadow-[0_6px_15px_rgba(0,0,0,1)] text-center z-20 pointer-events-none">
              Chuẩn bị về hàng, <br/> Vui lòng chờ
            </div>
          </div>
        </div>
        
        <div class="flex-1 relative z-10">
          <h1 class="text-4xl font-black italic tracking-widest text-[#f0d467] mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase">{{ card.name }}</h1>
          <p class="text-[#e2c76b] font-bold tracking-widest uppercase mb-4">{{ card.series }} | Tồn kho: <span :class="card.stock_quantity > 0 ? 'text-green-400' : 'text-red-500'">{{ card.stock_quantity }}</span></p>
          <p class="text-3xl text-[#d48135] font-black mb-6 drop-shadow-md">{{ formatPrice(card.price) }}</p>
          
          <div class="space-y-4 border-t-2 border-[#a2743a]/50 pt-6">
            <p><strong>Mã Card:</strong> <span class="font-mono text-[#e0c675]">{{ card.card_code }}</span></p>
            <p><strong>Pack:</strong> <span class="text-[#e0c675]">{{ card.pack_name }}</span></p>
            <p><strong>Độ hiếm:</strong> <span class="text-[#e0c675]">{{ card.rarity }}</span></p>
            
            <div class="bg-[#1a0e08] border border-[#a2743a]/30 p-4 rounded-sm italic text-[#d1b894] shadow-inner mt-4">
              "{{ card.description }}"
            </div>
          </div>

          <div v-if="!authStore.isAdmin && !authStore.isModer">
            <div class="flex flex-col md:flex-row gap-4 mt-8">
              <button 
                @click="handleOrderClick(card)" 
                :disabled="card.stock_quantity <= 0"
                class="flex-1 border border-[#f0d467] px-8 py-4 rounded-sm font-black tracking-widest uppercase hover:brightness-110 hover:shadow-[0_0_15px_rgba(240,212,103,0.5)] transition duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                :class="card.stock_quantity > 0 ? 'bg-[#1a0e08] text-[#f0d467] hover:bg-[#2c1a10]' : 'bg-gray-800 text-gray-500'"
              >
                {{ card.stock_quantity > 0 ? 'Thêm vào giỏ' : 'Đã Hết Hàng' }}
              </button>
              <button 
                @click="buyNow(card)" 
                :disabled="card.stock_quantity <= 0"
                class="flex-1 border border-[#f0d467] px-8 py-4 rounded-sm font-black tracking-widest uppercase hover:brightness-110 hover:shadow-[0_0_15px_rgba(240,212,103,0.5)] transition duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.8)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                :class="card.stock_quantity > 0 ? 'bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white' : 'bg-gray-800 text-gray-500'"
              >
                {{ card.stock_quantity > 0 ? 'Mua Ngay' : 'Hết Hàng' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Login Prompt Modal -->
      <div v-if="showLoginPrompt" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border-2 border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] max-w-sm w-full text-center">
          <h3 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-4 uppercase">Yêu cầu quyền hạn</h3>
          <p class="text-[#e2c76b] mb-6">Bạn phải đăng nhập với tư cách Duelist để có thể tiến hành giao dịch.</p>
          <div class="flex flex-col gap-3">
            <button @click="$router.push('/login')" class="w-full bg-gradient-to-r from-[#d48135] to-[#85451e] text-white py-2 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 border border-[#f0d467]">
              Đi đến Đăng nhập
            </button>
            <button @click="showLoginPrompt = false" class="w-full bg-transparent text-[#a2743a] py-2 rounded-sm font-bold uppercase tracking-widest hover:text-white transition">
              Đóng
            </button>
          </div>
        </div>
      </div>

      <!-- Toast Message -->
      <div v-if="toastMsg" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#2c1a10] border border-[#f0d467] px-8 py-4 rounded-sm shadow-[0_5px_20px_rgba(0,0,0,0.8)] z-50 text-[#e2c76b] font-bold tracking-widest uppercase text-sm flex items-center gap-3">
        <span class="text-green-500 text-lg">✓</span> {{ toastMsg }}
      </div>

    </main>
    <div v-else class="flex-grow flex items-center justify-center bg-[#140f0c]">
      <div class="text-2xl animate-pulse text-[#e2c76b] tracking-widest font-[Palatino,serif]">Đang hiển thị Bài phép...</div>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import Header from './Header.vue';
import Footer from './Footer.vue';

const route = useRoute();
const router = useRouter();
const card = ref(null);
const cartStore = useCartStore();
const authStore = useAuthStore();
const showLoginPrompt = ref(false);
const toastMsg = ref('');

const showToast = (msg) => {
  toastMsg.value = msg;
  setTimeout(() => { toastMsg.value = ''; }, 3000);
}

const formatPrice = (price) => {
  const num = Number(price) || 0;
  const formatted = num.toLocaleString('vi-VN');
  if (num >= 1000000) {
    const tr = (num / 1000000).toFixed(1).replace('.0', '');
    return `${formatted}đ (${tr}tr)`;
  } else if (num >= 100000) {
    const k = (num / 1000).toFixed(1).replace('.0', '');
    return `${formatted}đ (${k}k)`;
  }
  return `${formatted}đ`;
};

const handleOrderClick = (cardItem) => {
  if (!authStore.isAuthenticated) {
    showLoginPrompt.value = true;
    return;
  }
  if (cardItem.stock_quantity > 0) {
    cartStore.addToCart(cardItem);
    showToast('Đã thêm thẻ bài vào giỏ hàng!');
  }
};

const buyNow = (cardItem) => {
  if (!authStore.isAuthenticated) {
    showLoginPrompt.value = true;
    return;
  }
  if (cardItem.stock_quantity > 0) {
    cartStore.addToCart(cardItem);
    router.push('/checkout');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`/api/cards/${route.params.id}`);
    card.value = response.data;
  } catch (error) {
    console.error("Lỗi lấy data:", error);
  }
});
</script>
