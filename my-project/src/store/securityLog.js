import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSecurityLogStore = defineStore('securityLog', () => {
  const logs = ref([
    { id: 1, event: 'Đăng ký tài khoản mới', user: 'yugi_muto', ip: '192.168.1.5', time: new Date(Date.now() - 86400000).toLocaleString(), severity: 'low' },
    { id: 2, event: 'Thay đổi mật khẩu', user: 'kaiba_seto', ip: '10.0.0.2', time: new Date(Date.now() - 43200000).toLocaleString(), severity: 'medium' },
    { id: 3, event: 'Đăng nhập thất bại (x5)', user: 'joey_wheeler', ip: '172.16.0.4', time: new Date(Date.now() - 3600000).toLocaleString(), severity: 'high' }
  ]);

  const addSecurityLog = (event, user, severity = 'low') => {
    logs.value.unshift({
      id: Date.now(),
      event,
      user,
      ip: '127.0.0.1', // Mock IP
      time: new Date().toLocaleString(),
      severity
    });
  };

  return { logs, addSecurityLog };
});
