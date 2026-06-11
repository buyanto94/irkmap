<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');

const categories = [
  { name: 'Гостиницы', slug: 'hotels', icon: '🏨' },
  { name: 'Активный отдых', slug: 'active', icon: '⛺' },
  { name: 'Культура', slug: 'culture', icon: '🏛️' },
  { name: 'Рестораны', slug: 'food', icon: '🍽️' },
];

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'catalog', query: { q: searchQuery.value } });
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Header & Search -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
          Откройте лучшие места для отдыха
        </h1>
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск мест, отелей, ресторанов..."
            class="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg outline-none"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.slug"
            :to="{ name: 'catalog', query: { category: cat.slug } }"
            class="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
          >
            <span class="text-4xl mb-4 group-hover:-translate-y-1 transition-transform">{{ cat.icon }}</span>
            <span class="font-medium text-gray-900">{{ cat.name }}</span>
          </router-link>
        </div>
      </div>

      <!-- Popular -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Популярное</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" @click="router.push({ name: 'object-details', params: { slug: 'sample' } })">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-6">
              <div class="text-sm text-blue-600 font-medium mb-1">Гостиницы</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Гранд Отель {{ i }}</h3>
              <p class="text-gray-600 line-clamp-2">Отличное место для отдыха с прекрасным видом на город. Уютные номера и отличный сервис.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
