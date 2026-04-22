<template>
  <div class="fixed top-5 right-5 z-[10000] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id"
        class="min-w-[250px] max-w-sm p-4 rounded-sm shadow-xl border pointer-events-auto transform transition-all duration-300 relative overflow-hidden"
        :class="{
          'bg-[#1a0e08]/95 border-[#f0d467] text-[#f0d467]': toast.type === 'success',
          'bg-red-900/95 border-red-500 text-white': toast.type === 'error',
          'bg-[#2c180e]/95 border-[#a2743a] text-[#f5deb3]': toast.type === 'info' || toast.type === 'warning'
        }"
      >
        <div class="flex justify-between items-start gap-4">
          <p class="font-bold text-sm tracking-wider uppercase">{{ toast.message }}</p>
          <button @click="toastStore.removeToast(toast.id)" class="text-white/50 hover:text-white mt-[-2px]">✕</button>
        </div>
        <!-- Progress bar -->
        <div class="absolute bottom-0 left-0 h-1 bg-white/30 animate-[shrink_4s_linear_forwards]"></div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '../store/toast';
const toastStore = useToastStore();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
.animate-\[shrink_4s_linear_forwards\] {
  animation: shrink 4s linear forwards;
}
</style>
