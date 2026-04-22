import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  let id = 0;

  const addToast = (message, type = 'info') => {
    const toastId = id++;
    toasts.value.push({ id: toastId, message, type });
    setTimeout(() => {
      removeToast(toastId);
    }, 4000);
  };

  const removeToast = (toastId) => {
    toasts.value = toasts.value.filter(t => t.id !== toastId);
  };

  return { toasts, addToast, removeToast };
});
