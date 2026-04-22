<template>
  <div class="space-y-8">
    
    <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-6 shadow-[0_10px_30px_rgba(0,0,0,1)] relative">
      <h2 class="text-2xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4 uppercase">
        Cây Phân Nhóm Thẻ
      </h2>
      
      <div class="flex gap-6">
        <!-- Tree Display -->
        <div class="w-1/2 bg-[#110905] border border-[#3f2513] p-4 rounded-sm max-h-96 overflow-y-auto custom-scrollbar">
          <ul class="space-y-2">
            <li v-for="cat in categories" :key="cat.id" class="text-[#f5deb3]">
              <div 
                @click="selectCategory(cat)"
                :class="['font-bold uppercase text-sm flex items-center justify-between gap-2 p-2 rounded cursor-pointer transition group', selectedCategory?.id === cat.id ? 'bg-[#3f2513] text-[#f0d467]' : 'text-[#e2c76b] hover:bg-[#1a0e08]']"
              >
                <div><span>📁</span> {{ cat.name }}</div>
                <button @click.stop="deleteCategory(cat.id)" class="text-red-500 hover:text-white text-xs px-2 py-1 rounded bg-transparent hover:bg-red-800 transition opacity-0 group-hover:opacity-100" title="Xóa nhóm">✖</button>
              </div>
              <ul v-if="cat.children && cat.children.length" class="ml-6 mt-2 space-y-1 border-l border-[#3f2513] pl-3">
                <li v-for="child in cat.children" :key="child.id" class="text-xs text-[#8a7251]">
                  <div 
                    @click="selectCategory(child)"
                    :class="['flex items-center justify-between gap-2 p-2 rounded cursor-pointer transition group', selectedCategory?.id === child.id ? 'bg-[#3f2513] text-[#f0d467] font-bold' : 'hover:bg-[#1a0e08]']"
                  >
                    <div><span class="text-[#3f2513]">↳</span> {{ child.name }}</div>
                    <button @click.stop="deleteCategory(child.id)" class="text-red-500 hover:text-white text-[10px] px-2 py-1 rounded bg-transparent hover:bg-red-800 transition opacity-0 group-hover:opacity-100" title="Xóa nhóm con">✖</button>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          
          <div v-if="categories.length === 0" class="text-center text-[#8a7251] text-xs italic mt-4">
            Chưa có nhóm nào.
          </div>
        </div>

        <!-- Add Category Form -->
        <div class="w-1/2 flex flex-col gap-4">
          <div>
            <label class="block text-xs font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Thêm Nhóm Con / Mới</label>
            <input v-model="newCategoryName" type="text" placeholder="Tên nhóm..." class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#f0d467]" />
          </div>
          <div>
            <label class="block text-xs font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Thuộc Nhóm Cha (Để trống nếu là Nhóm Gốc)</label>
            <select v-model="selectedParent" class="w-full bg-[#1a0e08] text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#f0d467]">
              <option :value="null">-- Nhóm Gốc Mới --</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <button @click="handleAddCategory" class="bg-[#3f2513] hover:bg-[#5c371d] border border-[#a2743a] text-[#f0d467] py-2 font-bold uppercase tracking-widest text-xs transition">Thêm Nhóm</button>
        </div>
      </div>
    </div>

    <!-- Phân Bổ Sản Phẩm -->
    <div v-if="selectedCategory" class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-6 shadow-[0_10px_30px_rgba(0,0,0,1)] relative transition-all">
      <h2 class="text-xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4 uppercase">
        Gán Sản Phẩm Vào: <span class="text-white">{{ selectedCategory.name }}</span>
      </h2>
      
      <div class="flex gap-6">
        <!-- Unassigned Products -->
        <div class="w-1/2">
          <h3 class="text-sm font-bold text-[#e2c76b] uppercase mb-3">Chưa Phân Nhóm ({{ unassignedCards.length }})</h3>
          <div class="bg-[#110905] border border-[#3f2513] rounded-sm h-64 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <div v-for="card in unassignedCards" :key="card.id" class="flex items-center justify-between p-2 bg-[#1a0e08] border border-[#3f2513] hover:border-[#a2743a] rounded-sm group">
              <div class="flex items-center gap-3">
                <img :src="card.image_url || '/placeholder.jpg'" class="w-8 h-8 object-cover rounded-sm border border-[#a2743a]" />
                <div>
                  <div class="text-xs font-bold text-[#f5deb3]">{{ card.name }}</div>
                  <div class="text-[9px] text-[#8a7251]">{{ card.card_code }}</div>
                </div>
              </div>
              <button @click="assignCard(card.id, selectedCategory.id)" class="text-[10px] bg-[#3f2513] hover:bg-[#a2743a] text-white px-3 py-1 rounded-sm uppercase font-bold transition opacity-0 group-hover:opacity-100">
                Gán
              </button>
            </div>
            <div v-if="unassignedCards.length === 0" class="text-center text-[#8a7251] text-xs italic mt-4">Không còn thẻ nào chưa phân nhóm.</div>
          </div>
        </div>

        <!-- Assigned Products -->
        <div class="w-1/2">
          <h3 class="text-sm font-bold text-[#f0d467] uppercase mb-3">Đã Thuộc Nhóm ({{ assignedCards.length }})</h3>
          <div class="bg-[#110905] border border-[#3f2513] rounded-sm h-64 overflow-y-auto custom-scrollbar p-2 space-y-2">
            <div v-for="card in assignedCards" :key="card.id" class="flex items-center justify-between p-2 bg-[#3f2513]/50 border border-[#a2743a]/50 hover:border-[#a2743a] rounded-sm group">
              <div class="flex items-center gap-3">
                <img :src="card.image_url || '/placeholder.jpg'" class="w-8 h-8 object-cover rounded-sm border border-[#a2743a]" />
                <div>
                  <div class="text-xs font-bold text-[#f0d467]">{{ card.name }}</div>
                  <div class="text-[9px] text-[#8a7251]">{{ card.card_code }}</div>
                </div>
              </div>
              <button @click="assignCard(card.id, null)" class="text-[10px] bg-red-900/80 hover:bg-red-700 text-white px-3 py-1 rounded-sm uppercase font-bold transition opacity-0 group-hover:opacity-100">
                Gỡ
              </button>
            </div>
            <div v-if="assignedCards.length === 0" class="text-center text-[#8a7251] text-xs italic mt-4">Nhóm này chưa có thẻ nào.</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Custom Confirm Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div class="bg-[#1a0e08] border-2 border-[#a2743a] rounded-sm p-6 shadow-[0_0_50px_rgba(0,0,0,1)] max-w-md w-full relative">
        <h3 class="text-[#f0d467] font-black tracking-widest uppercase mb-4 text-lg border-b border-[#3f2513] pb-3">Xác nhận xóa</h3>
        <p class="text-[#f5deb3] mb-8 text-sm leading-relaxed">Bạn có chắc chắn muốn xóa nhóm này không? Các sản phẩm trong nhóm sẽ được tự động đưa về trạng thái <strong class="text-[#e2c76b]">Chưa phân nhóm</strong>.</p>
        <div class="flex justify-end gap-4">
          <button @click="showConfirmModal = false" class="px-5 py-2 text-[#a2743a] font-bold uppercase tracking-widest text-xs border border-[#3f2513] hover:bg-[#3f2513] transition rounded-sm">Hủy</button>
          <button @click="executeDeleteCategory" class="bg-gradient-to-b from-red-600 to-red-900 text-white px-5 py-2 font-black uppercase tracking-widest text-xs rounded-sm hover:brightness-110 transition shadow-[0_0_15px_rgba(220,38,38,0.3)] border border-red-500">Xóa Nhóm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAdminLogStore } from '../store/adminLog';
import axios from 'axios';

const adminLogStore = useAdminLogStore();

// State
const categories = ref([]);
const newCategoryName = ref('');
const selectedParent = ref(null);
const selectedCategory = ref(null);

const unassignedCards = ref([]);
const assignedCards = ref([]);

const showConfirmModal = ref(false);
const categoryToDelete = ref(null);

// Fetch
const fetchCategories = async () => {
  try {
    const res = await axios.get('/api/categories', { withCredentials: true });
    categories.value = res.data;
  } catch (err) {
    console.error("Lỗi tải cây thư mục", err);
  }
};

const fetchCardsForCategory = async () => {
  if (!selectedCategory.value) return;
  try {
    const [unassignedRes, assignedRes] = await Promise.all([
      axios.get('/api/categories/cards/unassigned', { withCredentials: true }),
      axios.get(`/api/categories/${selectedCategory.value.id}/cards`, { withCredentials: true })
    ]);
    unassignedCards.value = unassignedRes.data;
    assignedCards.value = assignedRes.data;
  } catch (err) {
    console.error("Lỗi tải danh sách thẻ", err);
  }
};

// Actions
const selectCategory = (cat) => {
  selectedCategory.value = cat;
  fetchCardsForCategory();
};

const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  try {
    await axios.post('/api/categories', {
      name: newCategoryName.value.trim(),
      parent_id: selectedParent.value
    }, { withCredentials: true });
    
    newCategoryName.value = '';
    await fetchCategories();
    adminLogStore.addLog(`Đã thêm danh mục mới`, 'info');
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      adminLogStore.addLog("Phiên đăng nhập đã hết hạn! Đang tải lại trang...", "error");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      console.error("Lỗi thêm thư mục:", err);
      adminLogStore.addLog("Lỗi máy chủ khi thêm nhóm. Vui lòng xem Terminal Backend.", "error");
    }
  }
};

const deleteCategory = (id) => {
  categoryToDelete.value = id;
  showConfirmModal.value = true;
};

const executeDeleteCategory = async () => {
  try {
    await axios.delete(`/api/categories/${categoryToDelete.value}`, { withCredentials: true });
    
    if (selectedCategory.value && selectedCategory.value.id === categoryToDelete.value) {
      selectedCategory.value = null;
    }
    
    await fetchCategories();
    showConfirmModal.value = false;
    adminLogStore.addLog(`Đã xóa danh mục`, 'warning');
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      adminLogStore.addLog("Phiên đăng nhập đã hết hạn! Đang tải lại trang...", "error");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      console.error("Lỗi xóa thư mục:", err);
      adminLogStore.addLog("Không thể xóa nhóm này do lỗi máy chủ.", "error");
    }
    showConfirmModal.value = false;
  }
};

const assignCard = async (cardId, categoryId) => {
  try {
    await axios.put('/api/categories/cards/assign', {
      card_id: cardId,
      category_id: categoryId
    }, { withCredentials: true });
    
    // Refresh lists
    fetchCardsForCategory();
    adminLogStore.addLog(`Đã cập nhật phân nhóm cho thẻ bài`, 'success');
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      adminLogStore.addLog("Phiên đăng nhập đã hết hạn! Đang tải lại trang...", "error");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      console.error("Lỗi gán thẻ:", err);
      adminLogStore.addLog("Lỗi khi cập nhật thẻ bài.", "error");
    }
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #110905; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #5c371d; border-radius: 2px; }
</style>
