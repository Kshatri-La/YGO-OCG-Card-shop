<template>
  <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,1)] relative max-w-4xl mx-auto">
    <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4 uppercase">
      Ban Hành Trạch Báo (Thông Báo)
    </h2>
    
    <form @submit.prevent="submitNews" class="space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="col-span-2 md:col-span-1">
          <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Loại Thông Báo *</label>
          <select v-model="form.type" required class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:ring-1 focus:ring-[#f0d467] outline-none">
            <option value="Hệ Thống">Hệ Thống</option>
            <option value="Khuyến Mãi">Khuyến Mãi</option>
            <option value="Sản Phẩm Mới">Sản Phẩm Mới</option>
            <option value="Cảnh Báo">Cảnh Báo</option>
          </select>
        </div>

        <div class="col-span-2 md:col-span-1">
          <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Link Hành Động (Tùy chọn)</label>
          <input v-model="form.actionLink" type="text" class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="/products, /cart,..." />
        </div>
      </div>

      <div>
        <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Tiêu Đề *</label>
        <input v-model="form.title" required type="text" class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Nhập tiêu đề thông báo..." />
      </div>

      <div>
        <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Link Ảnh (Tùy chọn)</label>
        <input v-model="form.image" type="url" class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="https://..." />
      </div>

      <div>
        <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Nội Dung Chi Tiết *</label>
        <textarea v-model="form.description" required rows="5" class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Chi tiết nội dung thông báo..."></textarea>
      </div>

      <button 
        type="submit" 
        class="w-full bg-gradient-to-r from-[#d48135] to-[#85451e] border border-[#f0d467] text-white py-4 rounded-sm font-black tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:brightness-110 transition text-lg"
      >
        Gửi Thông Báo Toàn Server
      </button>

      <p v-if="successMsg" class="text-green-500 font-bold text-center mt-4 text-sm uppercase tracking-widest">{{ successMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNotificationStore } from '../store/notification';
import { useAdminLogStore } from '../store/adminLog';

const notificationStore = useNotificationStore();
const adminLogStore = useAdminLogStore();

const successMsg = ref('');

const form = ref({
  type: 'Hệ Thống',
  title: '',
  description: '',
  image: '',
  actionLink: ''
});

const submitNews = () => {
  // Thêm thông báo
  notificationStore.addNotification({ ...form.value });
  
  // Ghi log admin
  adminLogStore.addLog(`Ban hành thông báo mới: "${form.value.title}"`, 'success');

  successMsg.value = 'Đã gửi thông báo thành công!';
  
  // Reset form
  setTimeout(() => {
    successMsg.value = '';
    form.value = {
      type: 'Hệ Thống',
      title: '',
      description: '',
      image: '',
      actionLink: ''
    };
  }, 3000);
};
</script>
