<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Stat Box -->
    <div v-for="(stat, idx) in stats" :key="idx" class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-6 shadow-lg relative group overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 text-6xl transform translate-x-4 -translate-y-4 group-hover:scale-125 transition duration-500">{{ stat.icon }}</div>
      <p class="text-[#8a7251] text-[10px] font-black uppercase tracking-widest mb-2">{{ stat.title }}</p>
      <h3 class="text-3xl font-black text-[#f0d467] drop-shadow-md">{{ stat.value }}</h3>
      <p :class="['text-xs font-bold mt-3', stat.up ? 'text-green-500' : 'text-red-500']">
        {{ stat.up ? '▲' : '▼' }} {{ stat.percent }}% so với tháng trước
      </p>
    </div>
  </div>

  <div class="bg-[#1a0e08] border border-[#3f2513] rounded-sm p-6 shadow-lg">
    <h3 class="text-[#e2c76b] font-bold tracking-wider uppercase mb-6 border-b border-[#3f2513] pb-3">Phân tích Hệ thống Tức Thời</h3>
    <div class="h-64 flex items-center justify-center border-2 border-dashed border-[#3f2513] text-[#8a7251] text-sm uppercase tracking-widest bg-[#110905]">
      (Khu vực đồ thị Chart.js sẽ được nhúng vào đây)
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const stats = ref([
  { title: 'Doanh thu Tháng', value: '45,210,000đ', icon: '💰', up: true, percent: 12.5 },
  { title: 'Lá bài Tồn Kho', value: '1,432', icon: '🃏', up: false, percent: 3.2 },
  { title: 'Đơn Đặt Mới', value: '24', icon: '📦', up: true, percent: 28.0 },
  { title: 'Khách Chờ Chat', value: '3', icon: '💬', up: true, percent: 50.0 },
]);
</script>
