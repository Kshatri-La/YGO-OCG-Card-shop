<template>
  <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,1)] relative min-h-screen">
    <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4">
      Quản Lý Giao Dịch Đơn Hàng
    </h2>

    <!-- Thông báo Update Status -->
    <div v-if="successMsg" class="mb-4 bg-green-900 border border-green-500 text-white font-bold p-3 text-center uppercase tracking-widest text-sm rounded-sm">{{ successMsg }}</div>
    <div v-if="errorMsg" class="mb-4 bg-red-900 border border-red-500 text-white font-bold p-3 text-center uppercase tracking-widest text-sm rounded-sm">{{ errorMsg }}</div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b-2 border-[#a2743a]/50 text-[#f0d467] uppercase tracking-widest text-sm bg-[#1a0e08]/50">
            <th class="py-3 px-4">Mã Đơn</th>
            <th class="py-3 px-4">Thành Viên</th>
            <th class="py-3 px-4">Số Tiền</th>
            <th class="py-3 px-4">Ngày Tạo</th>
            <th class="py-3 px-4">Tình Trạng (Status)</th>
            <th class="py-3 px-4 text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="orders.length === 0" class="border-b border-[#a2743a]/30">
            <td colspan="6" class="py-8 text-center text-[#e2c76b] italic">Chưa có đơn hàng nào.</td>
          </tr>
          <tr v-for="order in orders" :key="order.id" class="border-b border-[#a2743a]/30 hover:bg-[#3f2513]/50 transition">
            <td class="py-3 px-4 font-bold text-[#f5deb3]">#MSG-{{ order.id }}</td>
            <td class="py-3 px-4 text-[#e2c76b]">{{ order.username }}</td>
            <td class="py-3 px-4 font-black text-[#d48135]">{{ formatPrice(order.total_price) }}</td>
            <td class="py-3 px-4 text-sm text-[#a2743a]">{{ formatDate(order.created_at) }}</td>
            <td class="py-3 px-4">
              <select 
                v-model="order.status" 
                @change="updateStatus(order.id, order.status)"
                :class="{
                  'bg-yellow-900 border-yellow-500 text-white': order.status==='pending', 
                  'bg-green-900 border-green-500 text-white': order.status==='paid', 
                  'bg-blue-900 border-blue-500 text-white': order.status==='shipped',
                  'bg-red-900 border-red-500 text-white': order.status==='cancelled'
                }" 
                class="px-2 py-1 text-xs border rounded-sm tracking-widest font-bold uppercase drop-shadow-md outline-none cursor-pointer"
              >
                <option value="pending" class="bg-[#110905]">PENDING (Chờ Duyệt)</option>
                <option value="paid" class="bg-[#110905]">PAID (Đã Thanh Toán)</option>
                <option value="shipped" class="bg-[#110905]">SHIPPED (Đang Giao)</option>
                <option value="cancelled" class="bg-[#110905]">CANCELLED (Đã Huỷ)</option>
              </select>
            </td>
            <td class="py-3 px-4 text-center">
              <button @click="viewDetails(order)" class="text-[#f0d467] hover:text-white border border-[#a2743a] px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-[#2c1a10] hover:bg-[#3f2513] transition">
                Chi Tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal Chi Tiết Giao Dịch -->
    <div v-if="selectedOrder" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] max-w-md w-full relative">
        <button @click="selectedOrder = null" class="absolute top-4 right-4 text-[#a2743a] hover:text-[#f0d467] text-3xl font-black">&times;</button>
        
        <h3 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-6 uppercase border-b border-[#a2743a]/50 pb-2">Chi Tiết Đơn Hàng</h3>
        
        <div class="space-y-4 mb-8">
          <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/30 rounded-sm shadow-inner">
            <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Mã Đơn Hàng</p>
            <p class="text-[#f5deb3] font-bold tracking-widest text-lg">#MSG-{{ selectedOrder.id }}</p>
          </div>
          
          <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/30 rounded-sm shadow-inner">
            <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Khách Hàng</p>
            <p class="text-[#f5deb3] font-bold tracking-widest text-lg">{{ selectedOrder.username }}</p>
          </div>
          
          <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/30 rounded-sm shadow-inner">
            <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Số Điện Thoại</p>
            <p class="text-[#f5deb3] font-bold tracking-widest">{{ selectedOrder.phone_number || 'Trống' }}</p>
          </div>
          
          <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/30 rounded-sm shadow-inner">
            <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Địa Chỉ Nhận Hàng</p>
            <p class="text-[#f5deb3] font-bold tracking-widest">{{ selectedOrder.shipping_address }}</p>
          </div>
        </div>

        <button @click="selectedOrder = null" class="w-full bg-gradient-to-r from-[#d48135] to-[#85451e] text-white py-3 rounded-sm font-bold uppercase tracking-widest hover:brightness-110 border border-[#f0d467] transition">
          Đóng Màn Hình
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const successMsg = ref('');
const errorMsg = ref('');
const selectedOrder = ref(null);

const fetchOrders = async () => {
  try {
    const res = await axios.get('/api/orders');
    orders.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn hàng:", error);
  }
};

const updateStatus = async (orderId, newStatus) => {
  successMsg.value = '';
  errorMsg.value = '';
  try {
    await axios.put(`/api/orders/${orderId}/status`, { status: newStatus });
    successMsg.value = `Đơn #MSG-${orderId} -> ${newStatus.toUpperCase()}`;
    setTimeout(() => { successMsg.value = ''; }, 3000);
  } catch (err) {
    errorMsg.value = "Chỉnh sửa trạng thái thất bại!";
    setTimeout(() => { errorMsg.value = ''; }, 3000);
    fetchOrders(); // Revert
  }
};

const viewDetails = (order) => {
  selectedOrder.value = order;
};

const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'});
};

onMounted(() => {
  fetchOrders();
});
</script>
