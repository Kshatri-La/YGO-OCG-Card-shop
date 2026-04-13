<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow flex items-center justify-center container mx-auto px-4 py-12">
      <div class="bg-gradient-to-b from-[#2c180e] to-[#110905] border-[2px] border-[#f0d467] p-10 max-w-lg w-full rounded-sm shadow-[0_10px_30px_rgba(240,212,103,0.15)] text-center relative overflow-hidden">
        
        <div class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/70/Yugioh_card_back.png')] opacity-5 bg-cover bg-center mix-blend-overlay"></div>

        <div class="w-24 h-24 mx-auto bg-green-900 border-4 border-green-500 rounded-full flex justify-center items-center mb-6 shadow-[0_0_20px_#0f0] relative z-10">
          <span class="text-5xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-white">✓</span>
        </div>
        
        <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-2 drop-shadow-md uppercase relative z-10">Đặt Hàng Thành Công!</h2>
        <p class="text-[#e2c76b] tracking-wider mb-8 text-sm relative z-10">Đơn hàng của bạn đã được ghi nhận và đang chờ xử lý.</p>

        <div class="bg-[#1a0e08] p-4 rounded-sm border border-[#a2743a]/50 text-left mb-8 shadow-inner relative z-10">
          <p class="text-[#a2743a] text-xs font-bold uppercase tracking-widest mb-1">Mã Đơn Hàng</p>
          <p class="text-white font-mono text-xl tracking-widest font-black">#MSG-{{ orderId || 'ERROR' }}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8 relative z-10">
          <router-link to="/profile" class="px-6 py-3 border border-[#a2743a] bg-[#1a0e08] text-[#e2c76b] font-bold tracking-widest uppercase text-sm hover:bg-[#2c180e] hover:text-[#f0d467] transition text-center whitespace-nowrap hidden sm:block">
            Xem Hồ Sơ
          </router-link>
          <router-link to="/" class="px-6 py-3 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] border border-[#f0d467] text-white font-bold tracking-widest uppercase text-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:brightness-110 transition text-center">
            Về Trang Chủ
          </router-link>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from './Header.vue';
import Footer from './Footer.vue';

const route = useRoute();
const orderId = route.query.order_id;
</script>
