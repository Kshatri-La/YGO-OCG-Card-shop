<template>
  <div class="min-h-screen flex flex-col bg-[#140f0c] text-gray-200 font-[Palatino,serif]">
    <Header />

    <main class="flex-grow container mx-auto px-4 py-8">
      <h2 class="text-3xl font-black italic tracking-widest flex items-center gap-3 text-[#f0d467] border-b-2 border-[#a2743a] pb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
         ✦ Tất cả Thẻ bài ✦
      </h2>

      <!-- Category Filter Dropdown -->
      <div class="flex items-center gap-3 mb-8 mt-6">
        <label class="text-[#e2c76b] font-bold text-sm tracking-widest uppercase whitespace-nowrap">Bộ lọc Nhóm:</label>
        <div class="relative w-64">
          <select 
            v-model="selectedCategory" 
            @change="currentPage = 1"
            class="w-full appearance-none bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-4 py-2 pr-8 text-sm font-bold tracking-widest uppercase focus:outline-none focus:border-[#f0d467] cursor-pointer shadow-[0_2px_5px_rgba(0,0,0,0.5)] transition"
          >
            <option :value="null">-- TẤT CẢ SẢN PHẨM --</option>
            <option v-for="cat in flatCategories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#a2743a]">
            ▼
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-10 text-2xl animate-pulse text-[#e2c76b] tracking-widest">Đang tải Dữ liệu...</div>
      
      <div v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div 
            v-for="card in paginatedCards" 
            :key="card.id" 
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

        <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-10 font-bold tracking-widest uppercase text-sm">
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useCartStore } from '../store/cart';
import { useAppStore } from '../store/app';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const cards = ref([]);
const flatCategories = ref([]);
const selectedCategory = ref(null);
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

const filteredCards = computed(() => {
  // Sắp xếp ID giảm dần (Mới nhất trước)
  let sorted = [...cards.value].sort((a, b) => b.id - a.id);
  
  // Filter theo Category
  if (selectedCategory.value !== null) {
    sorted = sorted.filter(card => {
      // Nếu category được chọn là cha, thì lấy cả con của nó
      const selectedCat = flatCategories.value.find(c => c.id === selectedCategory.value);
      if (selectedCat && selectedCat.childrenIds) {
        return card.category_id === selectedCategory.value || selectedCat.childrenIds.includes(card.category_id);
      }
      return card.category_id === selectedCategory.value;
    });
  }

  if (appStore.searchQuery) {
    const q = appStore.searchQuery.toLowerCase();
    sorted = sorted.filter(card => 
      card.name.toLowerCase().includes(q) || 
      card.card_code.toLowerCase().includes(q)
    );
  }
  return sorted;
});

const totalPages = computed(() => {
  return Math.ceil(filteredCards.value.length / itemsPerPage);
});

const paginatedCards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredCards.value.slice(start, end);
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
    const [cardsRes, catsRes] = await Promise.all([
      axios.get('/api/cards'),
      axios.get('/api/categories', { withCredentials: true })
    ]);
    cards.value = cardsRes.data;
    
    // Đổ phẳng cây category để làm nút filter dễ dàng (chỉ lấy root và gộp các ID con)
    const flats = [];
    catsRes.data.forEach(rootCat => {
      const childrenIds = rootCat.children ? rootCat.children.map(c => c.id) : [];
      flats.push({ ...rootCat, childrenIds });
      if (rootCat.children) {
        rootCat.children.forEach(child => {
           flats.push({ ...child, name: `↳ ${child.name}` });
        });
      }
    });
    flatCategories.value = flats;
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
