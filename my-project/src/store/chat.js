import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAuthStore } from './auth';

export const useChatStore = defineStore('chat', () => {
  const authStore = useAuthStore();
  
  // Danh sách các cuộc hội thoại. Key là username của khách, Value là mảng tin nhắn
  const conversations = ref({
    'duelist_yugi': [
      { id: 1, text: 'Shop ơi cho mình hỏi còn card Blue-Eyes White Dragon không?', sender: 'duelist_yugi', timestamp: new Date(Date.now() - 100000).toISOString() },
      { id: 2, text: 'Chào bạn, hiện tại shop đang hết hàng lá này rồi ạ.', sender: 'admin', timestamp: new Date(Date.now() - 80000).toISOString() }
    ],
    'kaiba_corp': [
      { id: 3, text: 'Tôi muốn mua đứt toàn bộ shop của các cậu.', sender: 'kaiba_corp', timestamp: new Date(Date.now() - 500000).toISOString() }
    ]
  });

  // Gửi tin nhắn
  const sendMessage = (text, toUser = null) => {
    const sender = authStore.user?.username || 'guest';
    const msg = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date().toISOString()
    };

    if (authStore.isAdmin || authStore.isModer) {
      // Admin gửi cho user
      if (toUser && conversations.value[toUser]) {
        conversations.value[toUser].push(msg);
      }
    } else {
      // User gửi cho admin
      if (!conversations.value[sender]) {
        conversations.value[sender] = [];
      }
      conversations.value[sender].push(msg);
    }
  };

  return { conversations, sendMessage };
});
