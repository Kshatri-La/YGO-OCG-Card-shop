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
          <h2 class="text-4xl font-black italic tracking-widest text-[#f0d467] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] mb-8 uppercase">Đăng nhập</h2>
          
          <p v-if="errorMessage" class="mb-4 text-red-500 font-bold bg-black/50 p-2 border border-red-800 rounded-sm">{{ errorMessage }}</p>

          <form v-if="!showForgotPassword" @submit.prevent="handleLogin" class="space-y-6 text-left">
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Tên Đăng Nhập</label>
              <input type="text" v-model="username" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467] placeholder-[#8a7251]" placeholder="Nhập tên..." />
            </div>
            
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Mật Khẩu</label>
              <input type="password" v-model="password" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467] placeholder-[#8a7251]" placeholder="Nhập mật khẩu..." />
            </div>
            
            <button :disabled="isLoading" type="submit" class="w-full mt-4 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase text-lg py-3 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-2 border-[#e2c76b] hover:brightness-110 transition duration-300 disabled:opacity-50">
              {{ isLoading ? 'Đang xác thực...' : 'Kết nối hệ thống' }}
            </button>
            
            <div class="mt-4 text-center text-sm font-bold tracking-wider text-[#8a7251] uppercase">
              <button @click.prevent="showForgotPassword = true" class="text-[#f0d467] hover:underline px-2">Quên mật khẩu?</button> | 
              <router-link to="/register" class="text-[#f0d467] hover:underline px-2">Đăng Ký Mới</router-link>
            </div>
          </form>

          <form v-else @submit.prevent="handleResetPassword" class="space-y-6 text-left">
            <h3 class="text-xl text-[#f0d467] font-black italic mb-4 uppercase text-center">Khôi phục Token Truy Cập</h3>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Tên Đăng Nhập Của Bạn</label>
              <input type="text" v-model="resetUsername" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467] placeholder-[#8a7251]" placeholder="Nhập tài khoản cần khôi phục..." />
            </div>
            
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-2">Mật Khẩu Tiên Phong Mới</label>
              <input type="password" v-model="resetPassword" required class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#f0d467] placeholder-[#8a7251]" placeholder="Thiết lập mật khẩu mới..." />
            </div>
            
            <button :disabled="isLoading" type="submit" class="w-full mt-4 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] text-white font-black tracking-widest uppercase py-3 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.8)] border-2 border-[#e2c76b] hover:brightness-110 transition duration-300 disabled:opacity-50">
              {{ isLoading ? 'Đang Thiết Lập...' : 'Khởi Tạo Mật Khẩu' }}
            </button>
            <div class="mt-4 text-center text-sm font-bold tracking-wider text-[#8a7251] uppercase">
              <button @click.prevent="showForgotPassword = false; errorMessage = ''" class="text-[#f0d467] hover:underline px-2">← Trở về Đăng Nhập</button>
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
import axios from 'axios';
import { useAuthStore } from '../store/auth';
import { useToastStore } from '../store/toast';
import Header from './Header.vue';
import Footer from './Footer.vue';

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const showForgotPassword = ref(false);
const resetUsername = ref('');
const resetPassword = ref('');

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  const result = await authStore.login(username.value, password.value);
  
  if (result.success) {
    // Check role and redirect
    if (authStore.isAdmin) {
      router.push('/admin');
    } else if (authStore.isModer) {
      router.push('/moder');
    } else {
      router.push('/');
    }
  } else {
    errorMessage.value = result.message;
  }
  
  isLoading.value = false;
};

const handleResetPassword = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const response = await axios.post('/api/auth/reset-password', {
      username: resetUsername.value,
      newPassword: resetPassword.value
    });
    toastStore.addToast(response.data.message, 'success');
    showForgotPassword.value = false;
    resetUsername.value = '';
    resetPassword.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Lỗi đặt lại mật khẩu.';
  } finally {
    isLoading.value = false;
  }
};
</script>
