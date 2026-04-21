<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-gray-200 font-[Palatino,serif]">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="text-center bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 mb-10 text-[#f5deb3] shadow-[0_4px_15px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div class="absolute -right-20 -top-20 opacity-10 blur-[2px] pointer-events-none">
          <div class="w-96 h-96 rounded-full border-[10px] border-dashed border-[#f0d467] animate-[spin_20s_linear_infinite]"></div>
        </div>
        <h2 class="text-4xl font-black italic tracking-widest text-[#f0d467] mb-2 drop-shadow-md">NHẬN LẤY SỨC MẠNH!</h2>
        <p class="text-lg tracking-wider">Hàng ngàn lá bài hiếm Quarter Century & Starlight đang chờ đợi các Duelist.</p>
      </div>



      <div class="flex justify-between items-center mb-8 border-b-2 border-[#a2743a] pb-2">
        <h2 class="text-3xl font-black italic tracking-widest flex items-center gap-3 text-[#f0d467] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
           ✦ Sản phẩm mới ✦
        </h2>
        <router-link to="/products" class="text-sm font-bold tracking-widest uppercase text-[#e2c76b] hover:text-white transition bg-[#2c1a10] border border-[#a2743a] px-4 py-2 rounded-sm hover:bg-[#3f2513]">
          Xem tất cả ➜
        </router-link>
      </div>

      <div v-if="loading" class="text-center py-10 text-2xl animate-pulse text-[#e2c76b] tracking-widest">Đang thiết lập Field...</div>
      
      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
        <div 
          v-for="card in newCards" 
          :key="'new-'+card.id" 
          class="bg-[#2c1a10] border-2 border-[#110905] rounded-sm overflow-hidden hover:shadow-[0_0_15px_rgba(240,212,103,0.5)] transition duration-300 group relative flex flex-col"
        >
          <div class="absolute inset-0 border-[3px] border-[#a2743a] opacity-30 m-1 rounded-sm pointer-events-none"></div>

          <router-link :to="'/card/' + card.id" class="flex-grow flex flex-col">
            <div class="aspect-[3/4] overflow-hidden bg-black p-2 relative">
              <img 
                :src="card.image_url" 
                @error="card.imageError = true; $event.target.src='https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg'"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500 border border-[#3f2513]"
              />
              <div v-if="card.imageError" class="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-red-600/95 to-red-900/95 text-white text-[9px] font-black tracking-widest uppercase py-1.5 px-1 rounded-sm border border-[#a2743a] shadow-[0_4px_10px_rgba(0,0,0,1)] text-center z-20 pointer-events-none">
                Chuẩn bị về hàng <br/> Vui lòng chờ
              </div>
            </div>
            <div class="p-4 bg-gradient-to-b from-[#2c180e] to-[#140b06] flex-grow">
              <p class="text-[10px] text-[#e0c675] font-black tracking-widest uppercase mb-1 drop-shadow-md">
                {{ card.pack_name }} | Tồn kho: <span :class="card.stock_quantity > 0 ? 'text-green-400' : 'text-red-500'">{{ card.stock_quantity }}</span>
              </p>
              <h3 class="font-bold text-[#f5deb3] truncate text-lg drop-shadow-md">{{ card.name }}</h3>
              <p class="text-xs text-[#8a7251] font-mono mt-1">{{ card.card_code }} • {{ card.rarity }}</p>
              <p class="text-[#f0d467] font-black text-lg mt-3 tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">{{ formatPrice(card.price) }}</p>
            </div>
          </router-link>

          <div class="p-3 pt-0 bg-[#140b06]">
            <button 
              @click="addToCart(card)"
              :disabled="card.stock_quantity <= 0"
              class="w-full border border-[#a2743a] text-[#f5deb3] py-2.5 rounded-sm text-sm font-black tracking-widest uppercase transition shadow-[0_2px_5px_rgba(0,0,0,0.8)] relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="card.stock_quantity > 0 ? 'bg-gradient-to-r from-[#5c371d] to-[#3f2513] hover:from-[#a2743a] hover:to-[#6b4226] hover:text-white' : 'bg-gray-800 text-gray-500'"
            >
              {{ card.stock_quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết Hàng' }}
            </button>
          </div>
        </div>
      </div>

      <h2 class="text-3xl font-black italic tracking-widest mb-8 flex items-center gap-3 text-[#f0d467] border-b-2 border-[#a2743a] pb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
         ✦ Sản phẩm chính ✦
      </h2>

      <div v-if="!loading">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div 
            v-for="card in paginatedMainCards" 
            :key="'main-'+card.id" 
          class="bg-[#2c1a10] border-2 border-[#110905] rounded-sm overflow-hidden hover:shadow-[0_0_15px_rgba(240,212,103,0.5)] transition duration-300 group relative flex flex-col"
        >
          <div class="absolute inset-0 border-[3px] border-[#a2743a] opacity-30 m-1 rounded-sm pointer-events-none"></div>

          <router-link :to="'/card/' + card.id" class="flex-grow flex flex-col">
            <div class="aspect-[3/4] overflow-hidden bg-black p-2 relative">
              <img 
                :src="card.image_url" 
                @error="card.imageError = true; $event.target.src='https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg'"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500 border border-[#3f2513]"
              />
              <div v-if="card.imageError" class="absolute bottom-3 left-3 right-3 bg-gradient-to-r from-red-600/95 to-red-900/95 text-white text-[9px] font-black tracking-widest uppercase py-1.5 px-1 rounded-sm border border-[#a2743a] shadow-[0_4px_10px_rgba(0,0,0,1)] text-center z-20 pointer-events-none">
                Chuẩn bị về hàng <br/> Vui lòng chờ
              </div>
            </div>
            <div class="p-4 bg-gradient-to-b from-[#2c180e] to-[#140b06] flex-grow">
              <p class="text-[10px] text-[#e0c675] font-black tracking-widest uppercase mb-1 drop-shadow-md">
                {{ card.pack_name }} | Tồn kho: <span :class="card.stock_quantity > 0 ? 'text-green-400' : 'text-red-500'">{{ card.stock_quantity }}</span>
              </p>
              <h3 class="font-bold text-[#f5deb3] truncate text-lg drop-shadow-md">{{ card.name }}</h3>
              <p class="text-xs text-[#8a7251] font-mono mt-1">{{ card.card_code }} • {{ card.rarity }}</p>
              <p class="text-[#f0d467] font-black text-lg mt-3 tracking-widest drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">{{ formatPrice(card.price) }}</p>
            </div>
          </router-link>

          <div class="p-3 pt-0 bg-[#140b06]">
            <button 
              @click="addToCart(card)"
              :disabled="card.stock_quantity <= 0"
              class="w-full border border-[#a2743a] text-[#f5deb3] py-2.5 rounded-sm text-sm font-black tracking-widest uppercase transition shadow-[0_2px_5px_rgba(0,0,0,0.8)] relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="card.stock_quantity > 0 ? 'bg-gradient-to-r from-[#5c371d] to-[#3f2513] hover:from-[#a2743a] hover:to-[#6b4226] hover:text-white' : 'bg-gray-800 text-gray-500'"
            >
              {{ card.stock_quantity > 0 ? 'Thêm vào giỏ hàng' : 'Hết Hàng' }}
            </button>
          </div>
        </div>
        </div>

        <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-10 mb-10 font-bold tracking-widest uppercase text-sm">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-[#2c1a10] border border-[#a2743a] text-[#f0d467] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3f2513] transition"
          >
            Trang Trước
          </button>
          <span class="text-[#f5deb3]">Trang {{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 bg-[#2c1a10] border border-[#a2743a] text-[#f0d467] rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3f2513] transition"
          >
            Trang Sau
          </button>
        </div>
      </div>
    </main>
    <!-- Toast Message -->
    <div v-if="toastMsg" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-[#2c1a10] border border-[#f0d467] px-8 py-4 rounded-sm shadow-[0_5px_20px_rgba(0,0,0,0.8)] z-50 text-[#e2c76b] font-bold tracking-widest uppercase text-sm flex items-center gap-3">
      <span class="text-green-500 text-lg">✓</span> {{ toastMsg }}
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useCartStore } from '../store/cart';
import { useAppStore } from '../store/app';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const cards = ref([]);
const loading = ref(true);
const cartStore = useCartStore();
const appStore = useAppStore();
const toastMsg = ref('');
const itemsPerPage = 4;
const currentPage = ref(1);

const showToast = (msg) => {
  toastMsg.value = msg;
  setTimeout(() => { toastMsg.value = ''; }, 3000);
}

const filteredAll = computed(() => {
  let sorted = [...cards.value].sort((a, b) => b.id - a.id);
  
  if (!appStore.searchQuery) return sorted;
  
  const q = appStore.searchQuery.toLowerCase();
  return sorted.filter(card => 
    card.name.toLowerCase().includes(q) || 
    card.card_code.toLowerCase().includes(q)
  );
});

const newCards = computed(() => filteredAll.value.slice(0, 3));
const mainCards = computed(() => filteredAll.value);

const totalPages = computed(() => {
  return Math.ceil(mainCards.value.length / itemsPerPage);
});

const paginatedMainCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return mainCards.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

const formatPrice = (price) => {
  const num = Number(price) || 0;
  const formatted = num.toLocaleString('vi-VN');
  if (num >= 1000000) {
    const tr = (num / 1000000).toFixed(1).replace('.0', '');
    return `${formatted}đ (${tr}tr)`;
  } else if (num >= 100000) {
    const k = (num / 1000).toFixed(1).replace('.0', '');
    return `${formatted}đ (${k}k)`;
  }
  return `${formatted}đ`;
};

const fetchCards = async () => {
  try {
    const response = await axios.get('/api/cards');
    cards.value = response.data;
  } catch (error) {
    console.error("Lỗi lấy data:", error);
  } finally {
    loading.value = false;
  }
};

const addToCart = (card) => {
  if (card.stock_quantity > 0) {
    cartStore.addToCart(card);
    showToast('Đã thêm thẻ bài vào giỏ hàng!');
  }
};

onMounted(fetchCards);
</script>
