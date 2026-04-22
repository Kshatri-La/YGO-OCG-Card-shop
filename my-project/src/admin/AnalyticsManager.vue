<template>
  <div class="bg-gradient-to-br from-[#2c180e] to-[#110905] border border-[#a2743a] rounded-sm p-8 shadow-[0_10px_30px_rgba(0,0,0,1)] relative max-w-5xl mx-auto">
    <h2 class="text-3xl font-black italic tracking-widest text-[#f0d467] mb-6 drop-shadow-md border-b border-[#a2743a]/50 pb-4 uppercase">
      Báo Cáo Sự Cố & Bảo Mật (Security Logs)
    </h2>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse font-[Palatino,serif]">
        <thead>
          <tr class="bg-[#3f2513] text-[#e2c76b] text-[10px] tracking-widest uppercase font-black border-b-2 border-[#a2743a]">
            <th class="p-3 whitespace-nowrap w-48">Thời Gian</th>
            <th class="p-3">Sự Kiện</th>
            <th class="p-3 w-32 text-center">Tài Khoản</th>
            <th class="p-3 w-32 text-center">Địa Chỉ IP</th>
            <th class="p-3 w-24 text-center">Mức Độ</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          <tr 
            v-for="log in logs" 
            :key="log.id" 
            class="border-b border-[#3f2513] hover:bg-[#1a0e08] transition"
          >
            <td class="p-3 text-[#8a7251] whitespace-nowrap text-[11px]">{{ new Date(log.created_at).toLocaleString() }}</td>
            <td class="p-3 font-semibold text-[#f5deb3]">{{ log.event }}</td>
            <td class="p-3 text-center text-[#e2c76b]"><span v-if="log.username">@{{ log.username }}</span></td>
            <td class="p-3 text-center text-[#a2743a] font-mono text-[11px] tracking-wider">{{ log.ip_address }}</td>
            <td class="p-3 text-center">
              <span :class="getSeverityClass(log.severity)">
                {{ log.severity.toUpperCase() }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="logs.length === 0 && !loading" class="text-center text-[#8a7251] mt-10 italic pb-10">
        Hệ thống hiện tại an toàn, chưa có sự kiện bất thường.
      </div>
      <div v-if="loading" class="text-center text-[#f0d467] mt-10 italic pb-10 animate-pulse">
        Đang tải dữ liệu...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const logs = ref([]);
const loading = ref(false);

const fetchLogs = async () => {
  loading.value = true;
  try {
    const res = await axios.get('http://localhost:8080/api/admin/security-logs', { withCredentials: true });
    logs.value = res.data;
  } catch (error) {
    console.error("Lỗi khi tải log bảo mật:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLogs();
});

const getSeverityClass = (severity) => {
  const baseClass = 'px-2 py-1 rounded-sm text-[9px] font-black tracking-widest uppercase';
  if (severity === 'high') return `${baseClass} bg-red-900 text-white border border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]`;
  if (severity === 'medium') return `${baseClass} bg-yellow-700 text-black border border-[#f0d467]`;
  return `${baseClass} bg-green-900 text-white border border-green-500`;
};
</script>
