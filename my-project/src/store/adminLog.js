import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminLogStore = defineStore('adminLog', () => {
  const logs = ref([
    { id: 1, action: 'Đăng nhập hệ thống', time: new Date(Date.now() - 3600000).toLocaleString(), type: 'info' },
    { id: 2, action: 'Cập nhật kho hàng: Thêm 50 thẻ mới', time: new Date(Date.now() - 1800000).toLocaleString(), type: 'success' }
  ]);

  const addLog = (action, type = 'info') => {
    logs.value.unshift({
      id: Date.now(),
      action,
      time: new Date().toLocaleString(),
      type
    });
    // Giữ lại 50 log gần nhất
    if (logs.value.length > 50) {
      logs.value.pop();
    }
  };

  return { logs, addLog };
});
