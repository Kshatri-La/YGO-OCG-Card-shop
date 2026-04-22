import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([
    {
      id: 1,
      type: 'Khuyến Mãi',
      time: '1 giờ trước',
      title: 'Khuyến mãi tháng vàng! Giảm giá 20% toàn bộ phụ kiện',
      description: 'Cơ hội tuyệt vời để trang bị Sleeves và Deckbox bảo vệ bài của bạn. Chương trình áp dụng đến hết tuần này.',
      read: false,
      showDetails: false,
      image: '',
      actionLink: '/products'
    },
    {
      id: 2,
      type: 'Hệ Thống',
      time: 'Hôm qua',
      title: 'Bảo trì server Định Dạng Mới vào đêm nay',
      description: 'Hệ thống sẽ tạm ngừng giao dịch từ 2:00 AM đến 4:00 AM để cập nhật cấu trúc database chuẩn bị cho format mới.',
      read: true,
      showDetails: false,
      image: '',
      actionLink: ''
    }
  ]);

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length);

  const addNotification = (notif) => {
    notifications.value.unshift({
      id: Date.now(),
      time: 'Vừa xong',
      read: false,
      showDetails: false,
      ...notif
    });
  };

  const markAsRead = (id) => {
    const notif = notifications.value.find(n => n.id === id);
    if (notif) notif.read = true;
  };

  return { notifications, unreadCount, addNotification, markAsRead };
});
