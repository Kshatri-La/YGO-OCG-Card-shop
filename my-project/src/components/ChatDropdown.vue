<template>
  <div class="absolute right-0 top-12 w-80 bg-[#1a0e08] border-2 border-[#a2743a] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] z-50 flex flex-col font-[Palatino,serif]">
    <!-- Header Dropdown -->
    <div class="bg-gradient-to-r from-[#5c371d] to-[#2c180e] p-3 border-b border-[#a2743a] flex justify-between items-center rounded-t-sm">
      <h3 class="text-[#f0d467] font-black italic tracking-widest text-sm uppercase drop-shadow-md">Kênh Truyền Tin</h3>
      <button @click="$emit('close')" class="text-[#a2743a] hover:text-white transition">✕</button>
    </div>

    <!-- Message List or Login Required -->
    <div v-if="!authStore.isAuthenticated" class="flex-grow p-6 flex flex-col items-center justify-center text-center bg-[#110905]">
      <span class="text-4xl filter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">💬</span>
      <p class="text-[#e2c76b] text-sm mb-4 font-bold">Vui lòng đăng nhập để mở kênh liên lạc mã hoá với Bảng Điều Hành.</p>
      <button @click="$router.push('/login'); $emit('close')" class="w-full bg-gradient-to-r from-[#d48135] to-[#85451e] text-white py-2 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 border border-[#f0d467]">
        Mở Đăng Nhập
      </button>
    </div>
    
    <div v-else class="flex-grow p-4 space-y-4 max-h-64 overflow-y-auto custom-scrollbar bg-[#110905]">
      <!-- Hiện thông báo chào mừng nếu chưa có tin -->
      <div v-if="!myMessages || myMessages.length === 0" class="text-center text-[#8a7251] text-xs italic mt-4">
        Hãy bắt đầu trò chuyện với TCG Shop. Admin sẽ phản hồi bạn sớm nhất!
      </div>
      
      <div v-for="msg in myMessages" :key="msg.id" :class="['flex flex-col', msg.sender_username === 'admin' ? 'items-start' : 'items-end']">
        <span class="text-[10px] text-[#a2743a] uppercase font-bold mb-1">{{ msg.sender_username === 'admin' ? 'TCG Shop' : 'Bạn' }}</span>
        <div :class="[
          'max-w-[85%] p-2 rounded-sm text-sm break-words',
          msg.sender_username === 'admin' ? 'bg-[#2c1a10] border border-[#a2743a] text-[#f5deb3]' : 'bg-[#a2743a] text-black font-semibold'
        ]">
          {{ msg.text }}
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div v-if="authStore.isAuthenticated" class="p-3 bg-[#1a0e08] border-t border-[#a2743a] flex gap-2">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage"
        type="text" 
        placeholder="Gửi yêu cầu..." 
        class="flex-grow bg-[#110905] text-[#f5deb3] text-sm border border-[#3f2513] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] placeholder-[#5c371d]"
      />
      <button 
        @click="sendMessage"
        class="bg-gradient-to-b from-[#d48135] to-[#85451e] border border-[#f0d467] text-white px-3 shadow-md hover:brightness-110 active:scale-95 transition"
      >
        ➤
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import axios from 'axios';

/* global defineEmits */
defineEmits(['close']);

const authStore = useAuthStore();
const newMessage = ref('');
const myMessages = ref([]);
let pollInterval = null;

const fetchMessages = async () => {
  if (!authStore.isAuthenticated || authStore.isAdmin || authStore.isModer) return;
  const username = authStore.user?.username;
  try {
    const res = await axios.get(`/api/chat/messages/${username}`, { withCredentials: true });
    myMessages.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy tin nhắn:", err);
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim()) return;
  try {
    await axios.post('/api/chat/send', { 
      text: newMessage.value.trim() 
    }, { withCredentials: true });
    newMessage.value = '';
    fetchMessages(); // Lấy tin mới ngay sau khi gửi
  } catch (err) {
    console.error("Lỗi gửi tin nhắn:", err);
  }
};

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.isAdmin && !authStore.isModer) {
    fetchMessages();
    pollInterval = setInterval(fetchMessages, 3000); // Polling mỗi 3 giây
  }
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

watch(() => authStore.isAuthenticated, (newVal) => {
  if (newVal && !authStore.isAdmin && !authStore.isModer) {
    fetchMessages();
    if (!pollInterval) pollInterval = setInterval(fetchMessages, 3000);
  } else {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #a2743a; border-radius: 2px; }
</style>
