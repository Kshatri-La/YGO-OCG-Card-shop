<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    <main class="flex-grow container mx-auto px-4 py-8 max-w-4xl">
      <button @click="$router.back()" class="mb-6 text-[#f0d467] hover:text-white uppercase font-bold tracking-widest flex items-center gap-2 border border-[#a2743a] px-4 py-2 rounded-sm w-max bg-[#2c1a10] hover:bg-[#3f2513] transition drop-shadow-md">← Quay Lại Giỏ</button>
      
      <h1 class="text-4xl font-black italic tracking-widest text-[#f0d467] mb-8 border-b-2 border-[#a2743a] pb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase text-center">XÁC NHẬN THANH TOÁN</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Cột form -->
        <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)]">
          <h2 class="text-xl font-bold text-[#e2c76b] tracking-wider uppercase mb-6 border-b border-[#a2743a]/30 pb-2">Thông tin nhận hàng</h2>
          
          <form @submit.prevent="handleCheckout" class="space-y-4">
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Họ và tên người nhận *</label>
              <input v-model="form.name" required type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467]" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Số điện thoại *</label>
              <input v-model="form.phone" required type="tel" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467]" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Địa chỉ giao hàng (Chi tiết) *</label>
              <textarea v-model="form.address" required rows="3" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] resize-none"></textarea>
            </div>
            
            <div class="pt-4 border-t border-[#a2743a]/30">
              <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-3">Hình Thức Thanh Toán</label>
              <div class="space-y-2">
                <label class="flex items-center gap-3 cursor-pointer p-3 border border-[#a2743a]/50 rounded-sm hover:bg-[#3f2513]/40 transition" :class="{'bg-[#3f2513]/60 border-[#f0d467]': form.payment_method === 'COD'}">
                  <input type="radio" value="COD" v-model="form.payment_method" class="accent-[#d48135] w-4 h-4" />
                  <span class="font-bold tracking-widest text-[#e2c76b] uppercase">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer p-3 border border-[#a2743a]/50 rounded-sm hover:bg-[#3f2513]/40 transition" :class="{'bg-[#3f2513]/60 border-[#f0d467]': form.payment_method === 'QR'}">
                  <input type="radio" value="QR" v-model="form.payment_method" class="accent-[#d48135] w-4 h-4" />
                  <span class="font-bold tracking-widest text-[#e2c76b] uppercase">Chuyển khoản QR Code</span>
                </label>
              </div>
            </div>

            <button type="submit" :disabled="isProcessing" class="w-full mt-6 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase py-3 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border border-[#f0d467] hover:brightness-110 transition duration-300 disabled:opacity-50">
              {{ isProcessing ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG' }}
            </button>
            <p v-if="errorMsg" class="mt-4 text-red-500 font-bold tracking-widest text-sm text-center uppercase">{{ errorMsg }}</p>
          </form>
        </div>

        <!-- Cột tóm tắt -->
        <div>
          <div class="bg-gradient-to-b from-[#2c180e] to-[#110905] border border-[#a2743a] p-6 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] sticky top-32">
            <h2 class="text-xl font-bold text-[#e2c76b] tracking-wider uppercase mb-6 border-b border-[#a2743a]/30 pb-2">Tóm tắt đơn hàng</h2>
            <div class="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
                <img :src="item.image_url" class="w-12 h-16 object-cover border border-[#a2743a] rounded-xs" />
                <div class="flex-1">
                  <p class="font-bold text-[#f5deb3] text-sm">{{ item.name }}</p>
                  <p class="text-xs text-[#a2743a]">x{{ item.quantity }}</p>
                </div>
                <p class="font-bold text-[#e2c76b]">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
            
            <div class="border-t border-[#a2743a]/50 pt-4 flex justify-between font-black text-xl">
              <span class="uppercase tracking-widest">Tổng thanh toán</span>
              <span class="text-[#d48135]">{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cart';
import { useAuthStore } from '../store/auth';
import axios from 'axios';
import Header from './Header.vue';
import Footer from './Footer.vue';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const isProcessing = ref(false);
const errorMsg = ref('');
const form = ref({
  name: '',
  phone: '',
  address: '',
  payment_method: 'COD'
});

onMounted(() => {
  if (cartStore.items.length === 0) {
    router.push('/cart');
  }
  if (authStore.user) {
    form.value.name = authStore.user.full_name || authStore.user.username;
    form.value.phone = authStore.user.phone || '';
  }
});

const handleCheckout = async () => {
  if (cartStore.items.length === 0) return;
  isProcessing.value = true;
  errorMsg.value = '';

  try {
    const payload = {
      total_price: cartStore.totalPrice,
      shipping_address: form.value.address,
      phone_number: form.value.phone,
      payment_method: form.value.payment_method,
      items: cartStore.items
    };

    const res = await axios.post('/api/orders', payload);
    const orderId = res.data.order_id;
    
    cartStore.items = [];

    if (form.value.payment_method === 'QR') {
      router.push(`/checkout/qr-payment?order_id=${orderId}`);
    } else {
      router.push(`/payment-success?order_id=${orderId}`);
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Tạo đơn hàng thất bại.';
  } finally {
    isProcessing.value = false;
  }
};

const formatPrice = (price) => {
  const num = Number(price) || 0;
  return num.toLocaleString('vi-VN') + 'đ';
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #110905; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #a2743a; 
  border-radius: 4px;
}
</style>
