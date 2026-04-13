<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
      <div v-if="loading" class="text-[#e2c76b] animate-pulse font-bold tracking-widest text-lg">Đang tạo ma trận thanh toán...</div>
      
      <div v-else-if="!order" class="text-red-500 font-bold bg-[#2c180e] p-8 border border-red-500 rounded-sm">Không tìm thấy Đơn hàng.</div>

      <div v-else class="w-full max-w-2xl bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] text-center relative overflow-hidden">
        
        <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b-2 border-[#a2743a] inline-block pb-2">CHUYỂN KHOẢN MẬT MÃ</h2>
        <p class="text-[#e2c76b] mb-8 tracking-widest text-sm uppercase">Vui lòng quét Mã Truyền Đạt để hoàn tất giao dịch.</p>

        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
          
          <!-- Mock QR Box -->
          <div class="bg-white p-2 rounded-sm border-4 border-[#d48135] shadow-[0_0_20px_rgba(212,129,53,0.5)] flex-shrink-0 w-64 h-64 relative flex items-center justify-center">
            <img v-if="qrUrl" :src="qrUrl" alt="QR Code" class="w-full h-full object-contain" />
          </div>

          <div class="text-left space-y-4 font-mono text-sm w-full md:w-auto flex-1 opacity-90 hover:opacity-100 transition-opacity">
            <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/50 rounded-sm shadow-inner">
              <p class="text-[#a2743a] uppercase font-sans font-bold text-xs mb-1">Ngân hàng</p>
              <p class="text-[#f5deb3] text-lg font-bold">{{ settings.qr_bank_name || 'Đang chờ Hệ thống...' }}</p>
            </div>
            
            <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/50 rounded-sm shadow-inner">
              <p class="text-[#a2743a] uppercase font-sans font-bold text-xs mb-1">Chủ Tài Khoản / Số Tài Khoản</p>
              <p class="text-[#f0d467] text-xl font-bold uppercase tracking-wider">{{ settings.qr_account_name }}</p>
              <p class="text-[#f5deb3] text-xl tracking-widest font-black mt-1">{{ settings.qr_account_number }}</p>
            </div>
            
            <div class="bg-[#1a0e08] p-4 border border-[#d48135] rounded-sm shadow-inner relative overflow-hidden group">
              <div class="absolute inset-0 bg-gradient-to-r from-[#d48135]/20 to-transparent"></div>
              <p class="text-[#f0d467] uppercase font-sans font-bold text-xs mb-1 relative z-10">Mã Số Giao Ước (Nội dung CK) <span class="text-red-400">*BẮT BUỘC*</span></p>
              <p class="text-white text-lg lg:text-xl font-black relative z-10 break-all select-all leading-relaxed">{{ orderCode }}</p>
            </div>

            <div class="bg-[#1a0e08] p-4 border border-[#a2743a]/50 rounded-sm shadow-inner flex justify-between items-center">
              <div>
                 <p class="text-[#a2743a] uppercase font-sans font-bold text-xs mb-1">Sức Mạnh Yêu Cầu</p>
                 <p class="text-[#d48135] text-2xl font-black drop-shadow-md">{{ formatPrice(order.total_price) }}</p>
              </div>
            </div>
          </div>
        </div>

        <button @click="simulatePayment" :disabled="isConfirming" class="mt-8 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase py-4 px-12 rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.8)] border border-[#f0d467] hover:brightness-110 transition duration-300 transform hover:scale-105 disabled:opacity-50">
           {{ isConfirming ? 'Đang Lắng Nghe Khế Ước...' : 'Đã Chuyển Khoản Mật Mã / Giả Lập Hoàn Tất' }}
        </button>

      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import Header from './Header.vue';
import Footer from './Footer.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const isConfirming = ref(false);
const order = ref(null);
const settings = ref({});
const orderCode = ref('');
const qrUrl = ref('');

const fetchOrderAndSettings = async () => {
  const orderId = route.query.order_id;
  if (!orderId) {
    loading.value = false;
    return;
  }
  try {
    const [orderRes, settingsRes] = await Promise.all([
      axios.get(`/api/orders/${orderId}`),
      axios.get(`/api/admin/settings`)
    ]);
    
    order.value = orderRes.data;
    settings.value = settingsRes.data;
    generateOrderCode();
    
    // Generate actual QR pointing to our network confirm link
    let networkIpRes;
    try {
      networkIpRes = await axios.get('/api/network-ip');
    } catch(e) { /* ignore */ }
    
    // Nếu lấy dc IPv4 từ backend, dùng nó + port của giao diện Vue đang chạy
    let dynamicHost = window.location.origin;
    if (networkIpRes && networkIpRes.data && networkIpRes.data.ip) {
       dynamicHost = `http://${networkIpRes.data.ip}:${window.location.port}`;
    }

    const confirmUrl = `${dynamicHost}/qr-confirm?order_id=${orderId}`;
    qrUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(confirmUrl)}`;
    
  } catch (error) {
    console.error("Lỗi lấy thông tin đơn / QR settings", error);
  } finally {
    loading.value = false;
  }
};

const generateOrderCode = () => {
  // Yêu cầu: "order" + số tiền ở hàng đơn vị (chia 1000) + ddmmyyyyHHMM + username
  const val = Math.floor(order.value.total_price / 1000);
  
  const d = new Date(order.value.created_at);
  const pad = (n) => n.toString().padStart(2, '0');
  const dStr = `${pad(d.getDate())}${pad(d.getMonth()+1)}${d.getFullYear()}${pad(d.getHours())}${pad(d.getMinutes())}`;
  
  const username = authStore.user?.username || 'khach';
  
  orderCode.value = `order${val}${dStr}${username}`;
};

const simulatePayment = async () => {
  isConfirming.value = true;
  try {
    await axios.put(`/api/orders/${order.value.id}/status`, { status: 'paid' });
    setTimeout(() => {
      router.push(`/payment-success?order_id=${order.value.id}`);
    }, 1500);
  } catch (e) {
    console.error(e);
    isConfirming.value = false;
  }
};

const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};

onMounted(() => {
  fetchOrderAndSettings();
});
</script>

<style scoped>
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
</style>
