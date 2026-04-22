<template>
  <div class="relative min-h-screen font-[Palatino,serif]">
    <ToastNotification />
    <router-view/>
    
    <!-- Floating Bubble -->
    <button 
      v-if="!authStore.isAdmin && !authStore.isModer"
      @click="showOrderForm = true" 
      class="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white p-4 rounded-full shadow-[0_4px_15px_rgba(240,212,103,0.4)] border-2 border-[#f0d467] hover:scale-110 transition-transform duration-300 z-40 group flex items-center justify-center animate-bounce-slow"
      title="Gửi Order Kanj"
    >
      <span class="text-2xl drop-shadow-md">📦</span>
      <span class="absolute right-full mr-4 bg-[#110905]/95 border border-[#a2743a] text-[#f0d467] text-sm font-black tracking-widest uppercase px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none drop-shadow-md">
        Gửi Nhờ Đặt Hàng
      </span>
      
      <!-- Auto Tooltip (Chỉ hiện 3s) -->
      <span 
        v-if="showAutoTooltip"
        class="absolute bottom-full mb-3 right-0 bg-gradient-to-r from-red-700 to-red-900 border-2 border-[#f0d467] text-white text-xs font-black tracking-widest uppercase px-4 py-2 rounded-md shadow-[0_4px_10px_rgba(0,0,0,1)] whitespace-nowrap animate-bounce z-50 pointer-events-none before:content-[''] before:absolute before:-bottom-[7px] before:right-4 before:w-3 before:h-3 before:bg-red-900 before:border-b-2 before:border-r-2 before:border-[#f0d467] before:transform before:rotate-45"
      >
        YÊU CẦU ĐẶT HÀNG!
      </span>
    </button>

    <!-- Modal Form -->
    <div v-if="showOrderForm" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border-[3px] border-[#a2743a] p-8 w-full max-w-md rounded-sm shadow-[0_10px_40px_rgba(0,0,0,1)] relative font-[Palatino,serif]">
        
        <!-- Nút Tắt -->
        <button 
          @click="showOrderForm = false" 
          class="absolute top-2 right-3 text-[#a2743a] hover:text-[#f0d467] text-2xl font-black transition"
        >
          ✕
        </button>

        <h3 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-6 uppercase text-center border-b border-[#a2743a]/50 pb-4 drop-shadow-md">
           Thỏa Thuận Giao Dịch
        </h3>

        <form @submit.prevent="submitOrder" class="space-y-4">
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Tên Duelist *</label>
            <input v-model="form.name" required type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2.5 focus:ring-1 focus:ring-[#f0d467] outline-none shadow-inner" placeholder="Nhập tên của bạn..." />
          </div>

          <div>
            <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Số điện thoại *</label>
            <input v-model="form.phone" required type="tel" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2.5 focus:ring-1 focus:ring-[#f0d467] outline-none shadow-inner" placeholder="09xx..." />
          </div>

          <div>
            <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Link thẻ bài muốn đặt *</label>
            <textarea v-model="form.link" required rows="3" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2.5 focus:ring-1 focus:ring-[#f0d467] outline-none shadow-inner" placeholder="Dán link sản phẩm (eBay, web Nhật,...) vào đây..."></textarea>
          </div>

          <button 
            type="submit" 
            :disabled="isSubmitting"
            class="w-full mt-6 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] border border-[#f0d467] text-white py-3 rounded-sm font-black tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'ĐANG KÝ GIAO ƯỚC...' : 'XÁC NHẬN GỬI YÊU CẦU' }}
          </button>
          
          <p v-if="successMsg" class="mt-4 text-green-400 font-bold text-center tracking-widest text-sm uppercase">{{ successMsg }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import ToastNotification from './components/ToastNotification.vue';
import { useAuthStore } from './store/auth';

const authStore = useAuthStore();
const showOrderForm = ref(false);
const showAutoTooltip = ref(false);
const route = useRoute();
let tooltipTimer = null;
let tooltipHideTimer = null;

const triggerTooltip = () => {
  if (tooltipTimer) clearTimeout(tooltipTimer);
  if (tooltipHideTimer) clearTimeout(tooltipHideTimer);
  showAutoTooltip.value = false;

  // Không hiển thị tooltip ở Login và Cart
  if (route.path === '/login' || route.path === '/cart') return;

  tooltipTimer = setTimeout(() => {
    if (route.path === '/login' || route.path === '/cart') return;
    showAutoTooltip.value = true;
    
    tooltipHideTimer = setTimeout(() => {
      showAutoTooltip.value = false;
    }, 3000);
  }, 3000);
};

watch(() => route.path, () => {
  triggerTooltip();
});

onMounted(() => {
  triggerTooltip();
});
const isSubmitting = ref(false);
const successMsg = ref('');

const form = ref({
  name: '',
  phone: '',
  link: ''
});

const submitOrder = () => {
  isSubmitting.value = true;
  successMsg.value = '';
  
  // Fake API submission for the order since backend doesn't exist yet
  setTimeout(() => {
    console.log('Order Data:', form.value);
    successMsg.value = 'Đã gửi khế ước thành công!';
    isSubmitting.value = false;
    
    setTimeout(() => {
      showOrderForm.value = false;
      successMsg.value = '';
      form.value = { name: '', phone: '', link: '' };
    }, 2000);
  }, 1000);
};
</script>

<style>
/* Bubble bounce animation */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-8%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 2.5s infinite;
}
</style>
