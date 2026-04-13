<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8 min-h-[60vh]">
      <button @click="$router.back()" class="mb-6 text-[#f0d467] hover:text-white uppercase font-bold tracking-widest flex items-center gap-2 border border-[#a2743a] px-4 py-2 rounded-sm w-max bg-[#2c1a10] hover:bg-[#3f2513] transition drop-shadow-md">← Quay Lại</button>
      <h1 class="text-4xl font-black italic tracking-widest text-[#f0d467] mb-8 border-b-2 border-[#a2743a] pb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase inline-block">BỘ BÀI CỦA BẠN</h1>

      <div v-if="cartStore.items.length > 0" class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1 space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" class="flex items-center bg-gradient-to-r from-[#2c180e] to-[#1a0e08] p-4 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border border-[#a2743a]/50 relative overflow-hidden group">
            <div class="absolute inset-0 border-[2px] border-[#a2743a] opacity-0 group-hover:opacity-30 transition pointer-events-none rounded-sm"></div>
            <div class="relative shrink-0">
              <img :src="item.image_url" @error="item.imageError = true; $event.target.src='https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg'" class="w-20 h-28 object-cover rounded-sm shadow-[0_2px_8px_rgba(0,0,0,1)] border border-[#3f2513]" />
              <div v-if="item.imageError" class="absolute bottom-1 left-1 right-1 bg-red-700/95 text-white text-[7px] font-black tracking-wider uppercase py-0.5 px-0.5 rounded-sm border border-[#a2743a] text-center pointer-events-none leading-tight drop-shadow-md">
                ĐANG<br/>CHỜ HÀNG
              </div>
            </div>
            <div class="ml-6 flex-1 relative z-10">
              <h3 class="font-bold text-xl text-[#f0d467] drop-shadow-md">{{ item.name }}</h3>
              <p class="text-sm text-[#e2c76b] font-mono tracking-widest mt-1">{{ item.card_code }} | {{ item.rarity }}</p>
              <p class="text-[#d48135] font-black mt-2 text-lg">{{ formatPrice(item.price) }}</p>
            </div>
            
            <div class="flex items-center gap-4 relative z-10">
              <div class="flex items-center border border-[#a2743a] rounded-sm overflow-hidden bg-[#110905]">
                <button @click="item.quantity > 1 ? item.quantity-- : null" class="px-4 py-2 hover:bg-[#2c180e] text-[#f0d467] font-bold border-r border-[#a2743a]/50">-</button>
                <span class="px-4 font-bold min-w-[40px] text-center text-white">{{ item.quantity }}</span>
                <button @click="item.quantity < item.stock_quantity ? item.quantity++ : null" class="px-4 py-2 hover:bg-[#2c180e] text-[#f0d467] font-bold border-l border-[#a2743a]/50" :class="{'opacity-50 cursor-not-allowed': item.quantity >= item.stock_quantity}">+</button>
              </div>
              <button @click="cartStore.removeFromCart(item.id)" class="text-[#85451e] hover:text-red-500 transition drop-shadow-md p-2">
                <span class="text-3xl font-black">×</span>
              </button>
            </div>
          </div>
        </div>

        <div class="w-full lg:w-1/3">
          <div class="bg-gradient-to-b from-[#2c180e] to-[#110905] text-[#f5deb3] p-6 rounded-sm shadow-[0_8px_20px_rgba(0,0,0,1)] border border-[#a2743a] sticky top-32">
            <h2 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-6 border-b border-[#a2743a]/50 pb-4 uppercase">Hiến tế & Triệu hồi</h2>
            <div class="flex justify-between mb-4 text-[#e2c76b] font-bold tracking-widest">
              <span>Số lượng ({{ cartStore.items.length }} lá)</span>
              <span>{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <div class="flex justify-between mb-8 pt-4 border-t border-[#a2743a]/50 text-2xl font-black">
              <span class="uppercase tracking-widest">Tổng cộng</span>
              <span class="text-[#d48135] drop-shadow-md">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
            <router-link to="/checkout" class="block w-full text-center bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase py-4 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border border-[#f0d467] hover:brightness-110 transition duration-300">
              XÁC NHẬN GIAO DỊCH
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 bg-[#1a0e08]/60 rounded-sm border-2 border-dashed border-[#a2743a]/50 shadow-inner">
        <div class="text-7xl mb-6 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🎴</div>
        <p class="text-[#e2c76b] mb-8 text-xl font-bold tracking-widest uppercase">Bộ bài của bạn trống rỗng.</p>
        <router-link to="/" class="bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] border border-[#f0d467] text-white px-10 py-4 rounded-sm font-black tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:brightness-110 inline-block transition">
          Săn Card Ngay
        </router-link>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useCartStore } from '../store/cart';
import Header from './Header.vue';
import Footer from './Footer.vue';

const cartStore = useCartStore();

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
</script>