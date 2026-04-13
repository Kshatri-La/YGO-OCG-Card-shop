<template>
  <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,1)] relative">
    <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4">
      Cấu Hình Thanh Toán & Chuyển Khoản
    </h2>
    
    <div v-if="loading" class="flex items-center justify-center h-64 border-2 border-dashed border-[#a2743a]/30">
      <p class="text-[#e2c76b] animate-pulse font-bold tracking-widest text-lg">Đang tải cấu hình...</p>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Tên Ngân Hàng</label>
          <input v-model="settings.qr_bank_name" type="text" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
        </div>
        <div>
          <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Tên Chủ Tài Khoản</label>
          <input v-model="settings.qr_account_name" type="text" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner uppercase" />
        </div>
        <div>
          <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Số Tài Khoản</label>
          <input v-model="settings.qr_account_number" type="text" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner font-mono tracking-widest" />
        </div>
        <div>
          <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Số điện thoại Hotline</label>
          <input v-model="settings.qr_phone" type="tel" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
        </div>
      </div>

      <button type="submit" :disabled="isSaving" class="mt-8 border border-[#f0d467] px-8 py-3 rounded-sm font-black tracking-widest uppercase hover:brightness-110 transition bg-gradient-to-r from-[#d48135] to-[#85451e] text-white disabled:opacity-50">
        {{ isSaving ? 'Đang lưu...' : 'LƯU CẤU HÌNH' }}
      </button>

      <p v-if="successMsg" class="mt-4 text-green-400 font-bold tracking-widest text-sm uppercase">{{ successMsg }}</p>
      <p v-if="errorMsg" class="mt-4 text-red-500 font-bold tracking-widest text-sm uppercase">{{ errorMsg }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const loading = ref(true);
const isSaving = ref(false);
const settings = ref({
  qr_bank_name: '',
  qr_account_name: '',
  qr_account_number: '',
  qr_phone: ''
});
const successMsg = ref('');
const errorMsg = ref('');

const fetchSettings = async () => {
  try {
    const res = await axios.get('/api/admin/settings');
    settings.value = { ...settings.value, ...res.data };
  } catch (error) {
    console.error("Lỗi lấy cấu hình:", error);
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  isSaving.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  try {
    const res = await axios.put('/api/admin/settings', settings.value);
    successMsg.value = res.data.message;
  } catch (error) {
    errorMsg.value = 'Lỗi truy xuất cấu hình hệ thống.';
  } finally {
    isSaving.value = false;
  }
};

onMounted(() => {
  fetchSettings();
});
</script>
