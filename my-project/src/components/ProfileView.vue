<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    
    <div class="flex-grow flex flex-col py-12 px-4 container mx-auto items-center justify-center">
      <div class="w-full max-w-lg bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] relative">
        <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md text-center uppercase border-b border-[#a2743a]/50 pb-4">Hồ Sơ Của Bạn</h2>
        
        <div class="flex items-center gap-4 mb-8">
          <div class="w-16 h-16 bg-[#3f2513] border-2 border-[#a2743a] rounded-sm flex justify-center items-center font-bold text-3xl text-[#f0d467]">
            {{ authStore.user?.username.charAt(0).toUpperCase() }}
          </div>
          <div>
            <h3 class="text-2xl font-bold tracking-widest text-[#e2c76b] uppercase">{{ authStore.user?.full_name || authStore.user?.username }}</h3>
            <span class="text-xs uppercase bg-[#5c371d] px-2 py-0.5 rounded-full text-white">{{ authStore.user?.role }}</span>
          </div>
        </div>

        <form @submit.prevent="updateProfile" class="space-y-4 mb-8">
          <h4 class="font-bold text-[#e2c76b] tracking-wider uppercase mb-2 border-b border-[#a2743a]/30 pb-2">Thông Tin Tài Khoản</h4>
          
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Tên Đăng Nhập</label>
            <input :value="authStore.user?.username" type="text" readonly class="w-full bg-[#110905]/80 text-[#a2743a] border border-[#a2743a]/50 rounded-sm px-3 py-2 outline-none cursor-not-allowed" />
          </div>
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Họ Tên</label>
            <input v-model="profileForm.full_name" type="text" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
          </div>
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Email Liên Hệ</label>
            <input v-model="profileForm.email" type="email" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
          </div>
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Số điện thoại</label>
            <input v-model="profileForm.phone" type="tel" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
          </div>
          
          <button type="submit" :disabled="isUpdatingProfile" class="mt-4 w-full border border-[#f0d467] px-6 py-2 rounded-sm font-black tracking-widest uppercase hover:brightness-110 transition bg-gradient-to-r from-[#85451e] to-[#5c371d] text-[#f0d467] disabled:opacity-50">
            {{ isUpdatingProfile ? 'Đang cập nhật...' : 'Cập Nhật Hồ Sơ' }}
          </button>
          
          <p v-if="profileSuccess" class="text-green-400 font-bold text-sm mt-2 text-center">{{ profileSuccess }}</p>
          <p v-if="profileError" class="text-red-500 font-bold text-sm mt-2 text-center">{{ profileError }}</p>
        </form>

        <form @submit.prevent="changePassword" class="space-y-4 pt-4 border-t border-[#a2743a]/30">
          <h4 class="font-bold text-[#e2c76b] tracking-wider uppercase mb-2">Đổi Mật Khẩu Bảo Mật</h4>
          
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Mật khẩu hiện tại</label>
            <input v-model="passwords.current" type="password" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
          </div>
          <div>
            <label class="block text-sm font-bold tracking-widest text-[#a2743a] uppercase mb-1">Mật khẩu mới</label>
            <input v-model="passwords.new" type="password" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 outline-none focus:border-[#f0d467] shadow-inner" />
          </div>
          
          <button type="submit" :disabled="isChangingPass" class="mt-4 border border-[#f0d467] px-6 py-2 rounded-sm font-black tracking-widest uppercase hover:brightness-110 transition bg-gradient-to-r from-[#d48135] to-[#85451e] text-white disabled:opacity-50">
            {{ isChangingPass ? 'Đang cập nhật...' : 'Xác nhận Đổi' }}
          </button>
          
          <p v-if="successMsg" class="text-green-400 font-bold text-sm mt-2">{{ successMsg }}</p>
          <p v-if="errorMsg" class="text-red-500 font-bold text-sm mt-2">{{ errorMsg }}</p>
        </form>

        <div class="mt-8 pt-6 border-t border-red-900/50 text-center">
          <button @click="handleLogout" class="bg-red-800 border border-red-600 text-white px-6 py-2 rounded-sm font-bold uppercase tracking-widest hover:bg-red-700 transition">
            Đăng Xuất Phiên
          </button>
        </div>
      </div>

      <!-- LỊCH SỬ MUA HÀNG -->
      <div class="w-full max-w-lg bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] mt-8">
         <h2 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b-2 border-[#a2743a] pb-2 uppercase">Lịch sử mua hàng</h2>
         
         <div v-if="loadingOrders" class="text-[#e2c76b] animate-pulse text-sm">Đang tải lịch sử...</div>
         <div v-else-if="myOrders.length === 0" class="text-[#a2743a] italic text-sm">Bạn chưa có đơn đặt hàng nào.</div>
         <div v-else class="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="order in myOrders" :key="order.id" class="bg-[#1a0e08] border border-[#a2743a]/50 p-4 rounded-sm hover:border-[#f0d467] transition">
              <div class="flex justify-between items-start mb-2">
                 <p class="text-[#f0d467] font-black tracking-widest">#MSG-{{ order.id }}</p>
                 <span :class="{
                  'bg-yellow-900 border-yellow-500 text-yellow-200': order.status==='pending', 
                  'bg-green-900 border-green-500 text-green-200': order.status==='paid', 
                  'bg-blue-900 border-blue-500 text-blue-200': order.status==='shipped',
                  'bg-red-900 border-red-500 text-red-200': order.status==='cancelled'
                 }" class="px-2 py-1 text-[10px] border rounded-sm font-bold uppercase tracking-widest">
                    {{ order.status }}
                 </span>
              </div>
              <p class="text-[#e2c76b] text-sm mb-1">Tổng thanh toán: <span class="text-[#d48135] font-bold">{{ order.total_price.toLocaleString('vi-VN') }}đ</span></p>
              <p class="text-[#a2743a] text-xs">Ngày mua: {{ new Date(order.created_at).toLocaleString('vi-VN') }}</p>
            </div>
         </div>
      </div>

    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import Header from './Header.vue';
import Footer from './Footer.vue';

const authStore = useAuthStore();
const router = useRouter();

const isChangingPass = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const passwords = ref({
  current: '',
  new: ''
});

const isUpdatingProfile = ref(false);
const profileSuccess = ref('');
const profileError = ref('');
const profileForm = ref({
  full_name: '',
  email: '',
  phone: ''
});

const myOrders = ref([]);
const loadingOrders = ref(true);

onMounted(() => {
  if (authStore.user) {
    profileForm.value.full_name = authStore.user.full_name || '';
    profileForm.value.email = authStore.user.email || '';
    profileForm.value.phone = authStore.user.phone || '';
  }
  fetchMyOrders();
});

const fetchMyOrders = async () => {
  try {
    const res = await axios.get('/api/orders/my-orders');
    myOrders.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn hàng", error);
  } finally {
    loadingOrders.value = false;
  }
};

const updateProfile = async () => {
  if (isUpdatingProfile.value) return;
  isUpdatingProfile.value = true;
  profileSuccess.value = '';
  profileError.value = '';

  try {
    const res = await axios.put('/api/auth/profile', profileForm.value);
    profileSuccess.value = res.data.message;
    await authStore.fetchSession(); 
  } catch (error) {
    profileError.value = error.response?.data?.error || 'Đã có lỗi xảy ra.';
  } finally {
    isUpdatingProfile.value = false;
  }
};

const changePassword = async () => {
  if (isChangingPass.value) return;
  isChangingPass.value = true;
  successMsg.value = '';
  errorMsg.value = '';

  try {
    const res = await axios.post('/api/auth/change-password', {
      currentPassword: passwords.value.current,
      newPassword: passwords.value.new
    });
    successMsg.value = res.data.message;
    passwords.value.current = '';
    passwords.value.new = '';
  } catch (error) {
    errorMsg.value = error.response?.data?.error || 'Đã có lỗi xảy ra.';
  } finally {
    isChangingPass.value = false;
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
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
