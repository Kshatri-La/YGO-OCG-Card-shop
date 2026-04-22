<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <!-- Stat Box -->
    <div v-for="(stat, idx) in stats" :key="idx" class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-6 shadow-lg relative group overflow-hidden">
      <div class="absolute right-0 top-0 opacity-10 text-6xl transform translate-x-4 -translate-y-4 group-hover:scale-125 transition duration-500">{{ stat.icon }}</div>
      <p class="text-[#8a7251] text-[10px] font-black uppercase tracking-widest mb-2">{{ stat.title }}</p>
      <h3 class="text-3xl font-black text-[#f0d467] drop-shadow-md">{{ stat.value }}</h3>
    </div>
  </div>

  <div class="bg-[#1a0e08] border border-[#3f2513] rounded-sm p-6 shadow-lg">
    <h3 class="text-[#e2c76b] font-bold tracking-wider uppercase mb-6 border-b border-[#3f2513] pb-3">Log Hoạt Động Của Admin</h3>
    <div class="h-64 overflow-y-auto custom-scrollbar pr-2">
      <div v-if="adminLogStore.logs.length === 0" class="text-center text-[#8a7251] mt-10 italic">
        Chưa có log hoạt động nào.
      </div>
      <div v-else class="space-y-3">
        <div v-for="log in adminLogStore.logs" :key="log.id" class="flex items-start gap-4 p-3 bg-[#110905] border-l-2 border-[#a2743a] rounded-sm">
          <span class="text-[10px] text-[#8a7251] whitespace-nowrap">{{ log.time }}</span>
          <span :class="['text-sm font-semibold flex-grow', log.type === 'success' ? 'text-green-500' : 'text-[#f5deb3]']">
            {{ log.action }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminLogStore } from '../store/adminLog';
import axios from 'axios';

const adminLogStore = useAdminLogStore();

const pendingChatsCount = ref(0);

const fetchChatsCount = async () => {
  try {
    const res = await axios.get('http://localhost:8080/api/chat/conversations', { withCredentials: true });
    pendingChatsCount.value = res.data.length;
  } catch (err) {
    console.error("Lỗi đếm số lượng chat:", err);
  }
};

onMounted(() => {
  fetchChatsCount();
});

const stats = ref([
  { title: 'Doanh thu Tháng', value: '45,210,000đ', icon: '💰' },
  { title: 'Lá bài Tồn Kho', value: '1,432', icon: '🃏' },
  { title: 'Đơn Đặt Mới', value: '24', icon: '📦' },
  { title: 'Khách Đã Chat', value: pendingChatsCount, icon: '💬' },
]);
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5c371d; border-radius: 3px; }
</style>
