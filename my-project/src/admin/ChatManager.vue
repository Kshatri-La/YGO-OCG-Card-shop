<template>
  <div class="h-full flex gap-6">
    <!-- Danh sách khách hàng -->
    <div class="w-1/3 bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] flex flex-col">
      <div class="p-4 border-b border-[#3f2513]">
        <h3 class="text-[#f0d467] font-black italic tracking-widest uppercase">Khách Chờ Xử Lý</h3>
      </div>
      <div class="flex-grow overflow-y-auto custom-scrollbar p-2 space-y-2">
        <div 
          v-for="user in users" 
          :key="user"
          @click="selectUser(user)"
          :class="[
            'p-3 cursor-pointer rounded-sm border transition',
            selectedUser === user ? 'bg-[#3f2513] border-[#f0d467]' : 'bg-[#1a0e08] border-[#3f2513] hover:border-[#a2743a]'
          ]"
        >
          <div class="flex justify-between items-center mb-1">
            <span class="text-[#f5deb3] font-bold text-sm">@{{ user }}</span>
          </div>
          <p class="text-[10px] text-[#8a7251]">Nhấp để xem chat</p>
        </div>
      </div>
    </div>

    <!-- Khung Chat -->
    <div class="w-2/3 bg-gradient-to-br from-[#1a0e08] to-[#110905] border border-[#a2743a] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] flex flex-col">
      <div v-if="!selectedUser" class="flex-grow flex items-center justify-center text-[#8a7251] italic text-sm">
        Vui lòng chọn một khách hàng để bắt đầu chat.
      </div>
      <template v-else>
        <!-- Header -->
        <div class="p-4 border-b border-[#3f2513] flex justify-between items-center bg-[#2c180e]">
          <h3 class="text-[#f0d467] font-bold tracking-widest uppercase text-sm">Đang chat với: @{{ selectedUser }}</h3>
          <button @click="deleteConversation" class="text-red-500 hover:text-white border border-red-500 hover:bg-red-800 px-3 py-1 text-xs uppercase font-bold tracking-widest rounded transition shadow-md">
            🗑 Xóa Trò Chuyện
          </button>
        </div>
        
        <!-- Nội dung tin nhắn -->
        <div class="flex-grow overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div v-for="msg in messages" :key="msg.id" :class="['flex flex-col', msg.sender_username === 'admin' ? 'items-end' : 'items-start']">
            <span class="text-[10px] text-[#a2743a] uppercase font-bold mb-1">{{ msg.sender_username === 'admin' ? 'Shop (Bạn)' : msg.sender_username }}</span>
            <div :class="[
              'max-w-[80%] p-3 rounded-sm text-sm',
              msg.sender_username === 'admin' ? 'bg-[#5c371d] text-[#f5deb3] border border-[#a2743a]' : 'bg-[#2c1a10] text-[#e2c76b] border border-[#3f2513]'
            ]">
              {{ msg.text }}
            </div>
            <span class="text-[9px] text-[#8a7251] mt-1">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
          </div>
        </div>

        <!-- Khung nhập -->
        <div class="p-4 bg-[#110905] border-t border-[#3f2513] flex gap-3">
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            type="text" 
            class="flex-grow bg-[#1a0e08] border border-[#a2743a] text-[#f5deb3] rounded-sm px-4 py-2 focus:outline-none focus:border-[#f0d467]"
            placeholder="Nhập tin nhắn trả lời..."
          />
          <button 
            @click="sendMessage"
            class="bg-gradient-to-b from-[#d48135] to-[#85451e] text-white px-6 py-2 rounded-sm font-black tracking-widest uppercase shadow-md hover:brightness-110"
          >
            Gửi
          </button>
        </div>
      </template>
    </div>

    <!-- Custom Confirm Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div class="bg-[#1a0e08] border-2 border-[#a2743a] rounded-sm p-6 shadow-[0_0_50px_rgba(0,0,0,1)] max-w-md w-full relative">
        <h3 class="text-[#f0d467] font-black tracking-widest uppercase mb-4 text-lg border-b border-[#3f2513] pb-3">Xác nhận xóa</h3>
        <p class="text-[#f5deb3] mb-8 text-sm leading-relaxed">Bạn có chắc chắn muốn xóa vĩnh viễn toàn bộ lịch sử trò chuyện với <strong class="text-[#e2c76b]">@{{ userToDelete }}</strong> không? Hành động này không thể hoàn tác.</p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmModal = false" class="px-5 py-2 text-[#a2743a] font-bold uppercase tracking-widest text-xs border border-[#3f2513] hover:bg-[#3f2513] transition rounded-sm">Hủy</button>
          <button @click="executeDeleteConversation" class="bg-gradient-to-b from-red-600 to-red-900 text-white px-5 py-2 font-black uppercase tracking-widest text-xs rounded-sm hover:brightness-110 transition shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-500">Xóa Vĩnh Viễn</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import { useAdminLogStore } from '../store/adminLog';

const adminLogStore = useAdminLogStore();
const users = ref([]);
const messages = ref([]);
const selectedUser = ref(null);
const newMessage = ref('');
let pollInterval = null;

const showConfirmModal = ref(false);
const userToDelete = ref(null);

const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/chat/conversations', { withCredentials: true });
    users.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách user:", err);
  }
};

const fetchMessages = async () => {
  if (!selectedUser.value) return;
  try {
    const res = await axios.get(`/api/chat/messages/${selectedUser.value}`, { withCredentials: true });
    messages.value = res.data;
  } catch (err) {
    console.error("Lỗi lấy tin nhắn:", err);
  }
};

const selectUser = (user) => {
  selectedUser.value = user;
  fetchMessages();
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return;
  try {
    await axios.post('/api/chat/send', { 
      targetUser: selectedUser.value,
      text: newMessage.value.trim() 
    }, { withCredentials: true });
    newMessage.value = '';
    fetchMessages();
  } catch (err) {
    if (err.response && err.response.status === 401) {
      adminLogStore.addLog("Phiên đăng nhập đã hết hạn! Đang tải lại trang...", "error");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      adminLogStore.addLog("Không thể gửi tin nhắn do lỗi máy chủ.", "error");
      console.error("Lỗi gửi tin nhắn:", err);
    }
  }
};

const pollAll = () => {
  fetchUsers();
  if (selectedUser.value) fetchMessages();
};

const deleteConversation = () => {
  if (!selectedUser.value) return;
  userToDelete.value = selectedUser.value;
  showConfirmModal.value = true;
};

const executeDeleteConversation = async () => {
  try {
    await axios.delete(`/api/chat/conversations/${userToDelete.value}`, { withCredentials: true });
    
    adminLogStore.addLog(`Đã xóa vĩnh viễn đoạn chat với @${userToDelete.value}`, "warning");
    
    selectedUser.value = null;
    messages.value = [];
    showConfirmModal.value = false;
    fetchUsers();
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      adminLogStore.addLog("Phiên đăng nhập đã hết hạn! Đang tải lại trang...", "error");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      adminLogStore.addLog("Không thể xóa đoạn chat do lỗi máy chủ.", "error");
      console.error("Lỗi xóa cuộc trò chuyện:", err);
    }
    showConfirmModal.value = false;
  }
};

onMounted(() => {
  fetchUsers();
  pollInterval = setInterval(pollAll, 3000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5c371d; border-radius: 3px; }
</style>
