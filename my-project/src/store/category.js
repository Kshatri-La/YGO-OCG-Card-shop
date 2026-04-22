import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([
    { 
      id: 1, 
      name: 'Thẻ Bài YGO', 
      children: [
        { id: 11, name: 'Lẻ (Singles)' },
        { id: 12, name: 'Hộp (Booster Boxes)' },
        { id: 13, name: 'Bộ Khởi Đầu (Structure Decks)' }
      ]
    },
    { 
      id: 2, 
      name: 'Phụ Kiện', 
      children: [
        { id: 21, name: 'Bọc Bài (Sleeves)' },
        { id: 22, name: 'Hộp Đựng (Deckboxes)' },
        { id: 23, name: 'Thảm Đấu (Playmats)' }
      ]
    }
  ]);

  const tags = ref([
    { id: 1, name: 'Meta', color: 'bg-red-900' },
    { id: 2, name: 'Collector', color: 'bg-blue-900' },
    { id: 3, name: 'Ocg', color: 'bg-green-900' }
  ]);

  const addCategory = (parentId, name) => {
    if (!parentId) {
      categories.value.push({ id: Date.now(), name, children: [] });
    } else {
      const parent = categories.value.find(c => c.id === parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push({ id: Date.now(), name });
      }
    }
  };

  const addTag = (tag) => {
    tags.value.push({ id: Date.now(), ...tag });
  };

  const removeTag = (id) => {
    tags.value = tags.value.filter(t => t.id !== id);
  };

  return { categories, tags, addCategory, addTag, removeTag };
});
