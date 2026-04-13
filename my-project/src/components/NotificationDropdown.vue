<template>
  <div class="absolute right-0 top-12 w-80 bg-[#1a0e08] border-2 border-[#a2743a] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] z-50 font-[Palatino,serif]">
    <!-- Header Dropdown -->
    <div class="bg-gradient-to-r from-[#2c180e] to-[#110905] p-3 border-b border-[#a2743a] flex justify-between items-center rounded-t-sm">
      <h3 class="text-[#f0d467] font-black italic tracking-widest text-sm uppercase drop-shadow-md">Tín Hiệu Thẻ Bài</h3>
      <button @click="$emit('close')" class="text-[#a2743a] hover:text-white transition">✕</button>
    </div>

    <!-- Notification List -->
    <div class="max-h-80 overflow-y-auto custom-scrollbar bg-[#110905]">
      <div v-if="notifications.length === 0" class="p-6 text-center text-[#8a7251] text-xs uppercase tracking-widest italic">
        Không có thông báo mới
      </div>
      
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        class="border-b border-[#3f2513] last:border-0"
      >
        <!-- Tiêu đề Thông báo (Click để mở chi tiết) -->
        <div 
          @click="toggleDetails(notif.id)"
          class="p-3 cursor-pointer hover:bg-[#2c1a10] transition flex flex-col group"
        >
          <div class="flex justify-between items-center mb-1">
            <span class="text-[10px] text-[#e2c76b] uppercase font-bold flex items-center gap-1">
              <span v-if="!notif.read" class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              {{ notif.type }}
            </span>
            <span class="text-[9px] text-[#8a7251]">{{ notif.time }}</span>
          </div>
          <h4 :class="['text-sm font-semibold tracking-wider group-hover:text-[#f0d467] transition', notif.read ? 'text-gray-400' : 'text-[#f5deb3]']">
            {{ notif.title }}
          </h4>
        </div>

        <!-- Chi Tiết Đầy Đủ (Ẩn/Hiện) -->
        <div v-show="notif.showDetails" class="p-3 bg-[#0a0502] border-t border-[#3f2513] text-sm text-gray-300">
          <img v-if="notif.image" :src="notif.image" class="w-full h-32 object-cover rounded-sm border border-[#a2743a] mb-2" />
          <p class="leading-relaxed text-xs">{{ notif.description }}</p>
          <button v-if="notif.actionLink" class="mt-3 w-full bg-[#3f2513] hover:bg-[#5c371d] text-[#f0d467] py-1.5 text-[10px] font-black uppercase tracking-widest border border-[#a2743a] rounded-sm transition">
            Xem ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global defineEmits, defineProps */
const props = defineProps(['notifications']);
const emit = defineEmits(['close', 'mark-read']);

const toggleDetails = (id) => {
  const notif = props.notifications.find(n => n.id === id);
  if (notif) {
    notif.showDetails = !notif.showDetails;
    if (!notif.read) {
      emit('mark-read', id);
    }
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #a2743a; border-radius: 2px; }
</style>
