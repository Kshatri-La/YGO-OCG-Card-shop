<template>
  <Header />
  <div class="container mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Giỏ hàng</h1>
    <div v-if="cartStore.items.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4 bg-white p-4 border rounded-xl">
          <img :src="item.image_url" class="w-20 h-28 object-cover rounded" />
          <div class="flex-1">
            <h3 class="font-bold">{{ item.name }}</h3>
            <p class="text-red-600">{{ item.price.toLocaleString() }}đ</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="item.quantity--" class="px-2 border rounded">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="item.quantity++" class="px-2 border rounded">+</button>
          </div>
        </div>
      </div>
      <div class="bg-gray-900 text-white p-6 rounded-xl h-fit">
        <h2 class="text-xl font-bold mb-4">Tổng cộng</h2>
        <p class="text-2xl font-bold text-yellow-400">{{ cartStore.totalPrice.toLocaleString() }}đ</p>
        <button class="w-full bg-white text-black font-bold py-3 mt-6 rounded-lg">THANH TOÁN</button>
      </div>
    </div>
    <div v-else class="text-center py-20 border-2 border-dashed rounded-xl">
      Giỏ hàng trống!
    </div>
  </div>
  <Footer />
</template>

<script setup>
import { useCartStore } from '../store/cart';
import Header from './Header.vue';
import Footer from './Footer.vue';
const cartStore = useCartStore();
</script>