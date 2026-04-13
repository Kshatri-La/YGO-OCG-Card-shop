import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart_items')) || []
  }),
  actions: {
    addToCart(card) {
      const existing = this.items.find(i => i.id === card.id);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...card, quantity: 1 });
      }
      this.saveCart();
    },
    removeFromCart(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.saveCart();
    },
    saveCart() {
      localStorage.setItem('cart_items', JSON.stringify(this.items));
    }
  },
  getters: {
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }
});