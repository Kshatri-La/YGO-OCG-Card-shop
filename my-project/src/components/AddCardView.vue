<template>
  <div class="h-full font-[Palatino,serif]">
    <div class="max-w-6xl mx-auto bg-gradient-to-br from-[#2c180e] to-[#110905] border-[2px] border-[#a2743a] p-8 rounded-sm shadow-[0_10px_30px_rgba(0,0,0,1)] relative">
      
      <div class="flex justify-between items-center border-b border-[#a2743a]/50 pb-4 mb-6">
        <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] drop-shadow-md uppercase">Kho Lưu Trữ Sản Phẩm</h2>
        <button @click="showAddForm = !showAddForm" class="bg-gradient-to-r from-[#d48135] to-[#85451e] border border-[#f0d467] text-white px-4 py-2 rounded-sm font-bold uppercase hover:brightness-110 shadow-md transition">
          {{ showAddForm ? 'Đóng form thêm thẻ' : '+ Thêm thẻ bài mới' }}
        </button>
      </div>

      <div v-if="showAddForm" class="mb-8 border border-[#a2743a]/50 p-6 bg-[#1a0e08]/60 rounded-sm">
        <h3 class="text-xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md text-center uppercase border-b border-[#a2743a]/50 pb-4">Biểu Mẫu Thêm Thẻ Bài</h3>
        
        <form @submit.prevent="submitCard" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Tên lá bài *</label>
              <input v-model="card.name" required type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="VD: Blue-Eyes White Dragon" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Mã Card *</label>
              <input v-model="card.card_code" required type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="VD: LOB-001" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Giá (VNĐ) *</label>
              <input v-model.number="card.price" required min="0" type="number" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="100000" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Tên Pack</label>
              <input v-model="card.pack_name" type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Legend of Blue Eyes" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Series</label>
              <input v-model="card.series" type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Yu-Gi-Oh!" />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Độ hiếm</label>
              <input v-model="card.rarity" type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Ultra Rare" />
            </div>
            <div class="col-span-1 border-t border-[#a2743a]/30 pt-4 mt-2">
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Tải ảnh lên máy</label>
              <input ref="fileInputRef" type="file" @change="handleImage" accept="image/*" class="w-full bg-[#1a0e08]/80 text-[#a2743a] border border-[#a2743a] rounded-sm px-3 py-1.5 focus:ring-1 focus:ring-[#f0d467] outline-none" />
            </div>
            <div class="col-span-1 border-t border-[#a2743a]/30 pt-4 mt-2">
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Link Ảnh Phụ</label>
              <input v-model="card.image_url" type="text" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="https://..." />
            </div>
            <div>
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Số lượng kho</label>
              <input v-model.number="card.stock_quantity" min="0" type="number" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="10" />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-bold tracking-widest text-[#e2c76b] uppercase mb-1">Hiệu ứng / Mô tả</label>
              <textarea v-model="card.description" rows="3" class="w-full bg-[#1a0e08]/80 text-[#f5deb3] border border-[#a2743a] rounded-sm px-3 py-2 focus:ring-1 focus:ring-[#f0d467] outline-none" placeholder="Nhập hiệu ứng..."></textarea>
            </div>
          </div>
          
          <button type="submit" :disabled="isSubmitting" class="w-full mt-6 bg-gradient-to-r from-[#d48135] via-[#a2743a] to-[#85451e] border border-[#f0d467] text-white py-3 rounded-sm font-black tracking-widest uppercase shadow-[0_4px_10px_rgba(0,0,0,0.8)] hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'ĐANG KHẮC ẤN...' : 'TẠO MÃ BÀI VÀO HỆ THỐNG' }}
          </button>
        </form>
        <p v-if="successMsg" class="mt-4 text-green-400 font-bold text-center">{{ successMsg }}</p>
        <p v-if="errorMsg" class="mt-4 text-red-500 font-bold text-center">{{ errorMsg }}</p>
      </div>

      <!-- Danh Sách Kho -->
      <div class="overflow-x-auto relative">
        <table class="w-full text-left text-sm text-[#f5deb3]">
          <thead class="bg-[#1a0e08] text-[#e2c76b] uppercase text-xs border-y border-[#3f2513]">
            <tr>
              <th class="px-4 py-3 border-r border-[#3f2513] text-center w-16">Ảnh</th>
              <th class="px-4 py-3 border-r border-[#3f2513]">Tên Lá Bài</th>
              <th class="px-4 py-3 border-r border-[#3f2513]">Mã Code</th>
              <th class="px-4 py-3 border-r border-[#3f2513] text-center w-24">Tồn Kho</th>
              <th class="px-4 py-3 border-r border-[#3f2513] text-right">Đơn Giá</th>
              <th class="px-4 py-3 text-center w-24">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#3f2513]">
            <tr v-for="c in cardsList" :key="c.id" class="hover:bg-[#2c1a10] transition-colors">
              <td class="px-4 py-2 border-r border-[#3f2513] text-center">
                <img :src="c.image_url" @error="$event.target.src='https://upload.wikimedia.org/wikipedia/en/2/2b/Yugioh_Card_Back.jpg'" class="w-10 h-14 object-cover inline-block rounded-sm border border-[#a2743a]" />
              </td>
              <td class="px-4 py-2 border-r border-[#3f2513] font-bold text-[#f0d467]">{{ c.name }}</td>
              <td class="px-4 py-2 border-r border-[#3f2513] font-mono text-[#a2743a]">{{ c.card_code }}</td>
              <td class="px-4 py-2 border-r border-[#3f2513] text-center font-bold text-lg" :class="c.stock_quantity > 0 ? 'text-green-400' : 'text-red-500'">{{ c.stock_quantity }}</td>
              <td class="px-4 py-2 border-r border-[#3f2513] text-right text-[#d48135] font-black">{{ formatPrice(c.price) }}</td>
              <td class="px-4 py-2 text-center">
                <button @click="deleteCard(c.id)" class="text-red-500 hover:text-red-400 font-black text-xs uppercase underline drop-shadow-md">Xoá</button>
              </td>
            </tr>
            <tr v-if="cardsList.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-[#8a7251] italic">Kho lưu trữ chưa có thẻ bài nào...</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const showAddForm = ref(false);
const cardsList = ref([]);

const getInitialCardState = () => ({
  name: '',
  card_code: '',
  price: 0,
  pack_name: '',
  series: 'Yu-Gi-Oh!',
  rarity: '',
  image_url: '',
  stock_quantity: 1,
  description: ''
});

const card = ref(getInitialCardState());
const imageFile = ref(null);
const fileInputRef = ref(null);
const successMsg = ref('');
const errorMsg = ref('');
const isSubmitting = ref(false);

const fetchCards = async () => {
  try {
    const res = await axios.get('/api/cards');
    cardsList.value = res.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách kho:", error);
  }
};

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

const deleteCard = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn huỷ bỏ thẻ bài này khỏi hệ thống?")) return;
  try {
    await axios.delete(`/api/admin/cards/${id}`);
    await fetchCards();
  } catch (error) {
    alert("Lỗi khi xoá thẻ bài: " + (error.response?.data?.error || error.message));
  }
};

const handleImage = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    imageFile.value = e.target.files[0];
  } else {
    imageFile.value = null;
  }
};

const submitCard = async () => {
  if (isSubmitting.value) return;
  
  successMsg.value = '';
  errorMsg.value = '';
  isSubmitting.value = true;
  
  try {
    const formData = new FormData();
    Object.keys(card.value).forEach(key => {
      formData.append(key, card.value[key] !== null ? card.value[key] : '');
    });
    
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }

    await axios.post('/api/admin/cards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    successMsg.value = 'Lá bài đã được lưu vào hệ thống dữ liệu thành công!';
    
    // Khôi phục
    card.value = getInitialCardState();
    imageFile.value = null;
    if (fileInputRef.value) {
      fileInputRef.value.value = '';
    }
    
    // Ẩn form và tải lại kho
    showAddForm.value = false;
    await fetchCards();

  } catch (error) {
    errorMsg.value = 'Lỗi lưu bài: ' + (error.response?.data?.error || error.message);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  fetchCards();
});
</script>
