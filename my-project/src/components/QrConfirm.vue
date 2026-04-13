<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
      <div v-if="loading" class="text-[#e2c76b] animate-pulse font-bold tracking-widest text-lg text-center">Đang tải thông tin đơn hàng...</div>
      
      <div v-else-if="!order" class="text-red-500 font-bold bg-[#2c180e] p-8 border border-red-500 rounded-sm text-center">Không tìm thấy mã đơn hàng hợp lệ.</div>

      <div v-else class="w-full max-w-md bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        
        <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b-2 border-[#a2743a] inline-block pb-2">XÁC NHẬN THANH TOÁN</h2>
        <p class="text-[#e2c76b] mb-6 tracking-widest text-xs uppercase opacity-80">Quét mã thành công! Xác nhận hành động này trên thiết bị di động của bạn.</p>

        <div class="bg-[#1a0e08] p-5 border border-[#a2743a] rounded-sm text-left mb-6 shadow-inner relative overflow-hidden">
             <!-- Background pattern -->
             <div class="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/70/Yugioh_card_back.png')] opacity-10 bg-cover bg-center"></div>
             
             <div class="relative z-10 mb-4 pb-4 border-b border-[#a2743a]/50">
                <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Mã Khoản Thanh Toán</p>
                <p class="text-[#f0d467] text-xl font-bold tracking-widest">#MSG-{{ order.id }}</p>
             </div>

             <div class="relative z-10 mb-4 pb-4 border-b border-[#a2743a]/50">
                <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Trạng Thái Hiện Tại</p>
                <p class="text-white text-lg font-bold uppercase tracking-widest">{{ order.status }}</p>
             </div>

             <div class="relative z-10">
                <p class="text-[#a2743a] text-xs font-bold uppercase mb-1">Số Tiền Thanh Toán</p>
                <p class="text-[#d48135] text-3xl font-black drop-shadow-md">{{ formatPrice(order.total_price) }}</p>
             </div>
        </div>

        <p v-if="successMsg" class="mb-4 text-green-400 font-bold bg-green-900/50 border border-green-500 p-3 rounded-sm uppercase tracking-widest">{{ successMsg }}</p>
        <p v-if="errorMsg" class="mb-4 text-red-400 font-bold bg-red-900/50 border border-red-500 p-3 rounded-sm uppercase tracking-widest">{{ errorMsg }}</p>

        <button v-if="order.status === 'pending'" @click="confirmPayment" :disabled="isConfirming" class="w-full bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase py-4 px-6 rounded-sm shadow-[0_4px_15px_rgba(212,129,53,0.5)] border border-[#f0d467] hover:brightness-110 transition duration-300 transform hover:scale-105 disabled:opacity-50">
           {{ isConfirming ? 'Đang xử lý...' : 'XÁC NHẬN ĐÃ THANH TOÁN' }}
        </button>
        
        <button v-else disabled class="w-full bg-[#1a0e08] text-gray-400 font-bold tracking-widest uppercase py-4 px-6 rounded-sm border border-gray-600 opacity-80 cursor-not-allowed">
           Đơn hàng đã được duyệt
        </button>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import Header from './Header.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const isConfirming = ref(false);
const order = ref(null);
const successMsg = ref('');
const errorMsg = ref('');

const fetchOrderDetails = async () => {
  const orderId = route.query.order_id;
  if (!orderId) {
    loading.value = false;
    return;
  }
  try {
    const orderRes = await axios.get(`/api/orders/${orderId}`);
    order.value = orderRes.data;
  } catch (error) {
    console.error("Lỗi lấy thông tin đơn xác nhận", error);
  } finally {
    loading.value = false;
  }
};

const confirmPayment = async () => {
  isConfirming.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  try {
    await axios.put(`/api/orders/${order.value.id}/status`, { status: 'paid' });
    order.value.status = 'paid';
    successMsg.value = 'Xác Nhận Thành Công! Sẽ được chuyển hướng về trang chủ.';
    // Redirect to home after 3s
    setTimeout(() => {
        router.push(`/`);
    }, 3000);
  } catch (e) {
    console.error(e);
    errorMsg.value = 'Đã có lỗi xảy ra!';
  } finally {
    isConfirming.value = false;
  }
};

const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};

onMounted(() => {
  fetchOrderDetails();
});
</script>
