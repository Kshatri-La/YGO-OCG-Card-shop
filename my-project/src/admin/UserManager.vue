<template>
  <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,1)] relative min-h-screen">
    <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4">
      Quản Lý Tài Khoản (Nhân Sự)
    </h2>
    
    <div class="mb-6 flex gap-4">
      <input 
        v-model="searchQuery" 
        @keydown.enter="fetchUsers"
        type="text" 
        placeholder="Tìm kiếm username, email, họ tên..." 
        class="flex-1 bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-2 outline-none focus:border-[#f0d467]"
      />
      <button 
        @click="fetchUsers" 
        class="bg-gradient-to-r from-[#d48135] to-[#85451e] border border-[#f0d467] px-6 py-2 rounded-sm text-white font-bold uppercase tracking-widest hover:brightness-110 transition shrink-0"
      >
        Tìm Kiếm
      </button>
    </div>

    <!-- Thông báo Update Role -->
    <div v-if="successMsg" class="mb-4 bg-green-900 border border-green-500 text-white font-bold p-3 text-center uppercase tracking-widest text-sm rounded-sm">{{ successMsg }}</div>
    <div v-if="errorMsg" class="mb-4 bg-red-900 border border-red-500 text-white font-bold p-3 text-center uppercase tracking-widest text-sm rounded-sm">{{ errorMsg }}</div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b-2 border-[#a2743a]/50 text-[#f0d467] uppercase tracking-widest text-sm bg-[#1a0e08]/50">
            <th class="py-3 px-4">Tài Khoản</th>
            <th class="py-3 px-4">Họ Tên</th>
            <th class="py-3 px-4">Email</th>
            <th class="py-3 px-4">SĐT</th>
            <th class="py-3 px-4">Vai Trò (Role)</th>
            <th class="py-3 px-4">Ngày Tham Gia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="users.length === 0" class="border-b border-[#a2743a]/30">
            <td colspan="6" class="py-8 text-center text-[#e2c76b] italic">Không có người dùng nào được tìm thấy.</td>
          </tr>
          <tr v-for="user in users" :key="user.id" class="border-b border-[#a2743a]/30 hover:bg-[#3f2513]/50 transition">
            <td class="py-3 px-4 font-bold text-[#f5deb3]">{{ user.username }}</td>
            <td class="py-3 px-4">{{ user.full_name }}</td>
            <td class="py-3 px-4 text-[#e2c76b]">{{ user.email }}</td>
            <td class="py-3 px-4">{{ user.phone || 'N/A' }}</td>
            <td class="py-3 px-4">
              <select 
                v-model="user.role" 
                @change="updateRole(user.id, user.role)"
                :class="{
                  'bg-red-900 border-red-500 text-white': user.role==='admin', 
                  'bg-blue-900 border-blue-500 text-white': user.role==='moder', 
                  'bg-green-900 border-green-500 text-white': user.role==='customer'
                }" 
                class="px-2 py-1 text-xs border rounded-sm tracking-widest font-bold uppercase drop-shadow-md outline-none cursor-pointer"
              >
                <option value="admin" class="bg-[#110905]">ADMIN</option>
                <option value="moder" class="bg-[#110905]">MODER</option>
                <option value="customer" class="bg-[#110905]">CUSTOMER</option>
              </select>
            </td>
            <td class="py-3 px-4 text-sm text-[#a2743a]">{{ formatDate(user.created_at) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const searchQuery = ref('');
const successMsg = ref('');
const errorMsg = ref('');

const fetchUsers = async () => {
  try {
    const res = await axios.get(`/api/admin/users?search=${searchQuery.value}`);
    users.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách user:", error);
  }
};

const updateRole = async (userId, newRole) => {
  successMsg.value = '';
  errorMsg.value = '';
  try {
    const res = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
    successMsg.value = res.data.message || "Cập nhật phân quyền thành công.";
    setTimeout(() => { successMsg.value = ''; }, 3000);
  } catch (err) {
    errorMsg.value = "Không thể cập nhật phân quyền cho tài khoản này!";
    setTimeout(() => { errorMsg.value = ''; }, 3000);
    fetchUsers(); // Revert back
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  fetchUsers();
});
</script>
