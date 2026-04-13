<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-[#f5deb3] font-[Palatino,serif]">
    <Header />
    
    <div class="flex-grow flex flex-col py-12 px-4 container mx-auto">
      <button @click="$router.push('/')" class="mb-12 text-[#f0d467] hover:text-white uppercase font-bold tracking-widest flex items-center gap-2 border border-[#a2743a] px-4 py-2 rounded-sm w-max bg-[#2c1a10] hover:bg-[#3f2513] transition drop-shadow-md mx-auto md:mx-0">← Về Cửa Hàng</button>
      <div class="flex-grow flex items-center justify-center">
        <div class="max-w-md w-full bg-gradient-to-b from-[#2c180e] to-[#110905] border-[4px] border-[#110905] rounded-sm p-1 shadow-[0_10px_30px_rgba(0,0,0,1)] relative mt-[-80px]">
        <!-- Magic Inner Border -->
        <div class="absolute inset-1 border-[2px] border-[#a2743a] rounded-sm pointer-events-none opacity-50"></div>
        
        <div class="p-8 relative z-10 text-center">
          <h2 class="text-4xl font-black italic tracking-widest text-[#f0d467] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-8 uppercase">Đăng Ký</h2>
          
          <p v-if="errorMessage" class="mb-4 text-red-500 font-bold bg-black/50 p-2 border border-red-800 rounded-sm">{{ errorMessage }}</p>
          <p v-if="successMessage" class="mb-4 text-green-500 font-bold bg-black/50 p-2 border border-green-800 rounded-sm">{{ successMessage }}</p>

          <form @submit.prevent="handleRegister" class="space-y-6 text-left">
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Tên Duelist (ID) *</label>
              <input type="text" v-model="form.username" required minlength="4" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467]" placeholder="Ví dụ: kaiba2026" />
            </div>

            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Họ Tên Thật *</label>
              <input type="text" v-model="form.full_name" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467]" placeholder="Nhập họ tên thật..." />
            </div>

            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Email *</label>
              <input type="email" v-model="form.email" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467]" placeholder="email@example.com" />
            </div>
            
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Mật Khẩu *</label>
              <input type="password" v-model="form.password" required minlength="6" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467]" placeholder="Ít nhất 6 ký tự" />
            </div>
            
            <button :disabled="isLoading" type="submit" class="w-full mt-4 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase text-lg py-3 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-2 border-[#e2c76b] hover:brightness-110 transition duration-300 disabled:opacity-50">
              {{ isLoading ? 'Đang Đăng Ký...' : 'Tạo Khế Ước' }}
            </button>
            
            <div class="mt-4 text-center text-sm font-bold tracking-wider text-[#8a7251] uppercase">
              Đã có tài khoản? <router-link to="/login" class="text-[#f0d467] hover:underline">Đăng Nhập Ngay</router-link>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import Header from './Header.vue';
import Footer from './Footer.vue';

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  username: '',
  full_name: '',
  email: '',
  password: ''
});

const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  
  const result = await authStore.register(form.value);
  
  if (result.success) {
    successMessage.value = 'Tạo tài khoản thành công! Phân trang sau 2 giây...';
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  } else {
    errorMessage.value = result.message;
  }
  
  isLoading.value = false;
};
</script>
