<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { Search } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'HomeView' });

const router = useRouter();
const searchQuery = ref('');

const categories = [
  { name: 'Гостиницы', slug: 'hotels', icon: '🛏️' },
  { name: 'Активный отдых', slug: 'active', icon: '🏕️' },
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <!-- Hero Search -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
          Поиск мест для отдыха
        </h1>
        <div class="relative">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск по названию или ключевым словам..."
            class="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg outline-none"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
      </div>

      <!-- Categories -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="cat in categories"
            :key="cat.slug"
            @click="router.push({ name: 'catalog', query: { category: cat.slug } })"
            class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex flex-col items-center text-center transition-shadow"
          >
            <div class="text-4xl mb-3">{{ cat.icon }}</div>
            <div class="font-medium text-gray-900">{{ cat.name }}</div>
          </div>
        </div>
      </div>

      <!-- Popular -->
      <div>
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Популярное / Новое</h2>
        <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow" @click="router.push({ name: 'object-details', params: { slug: 'sample' } })">
            <div class="h-48 bg-gray-200">
               <img :src="`https://picsum.photos/seed/pop${i}/600/400`" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                 <h3 class="text-lg font-bold text-gray-900">Гранд Отель {{ i }}</h3>
                 <span class="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded shrink-0 ml-2">★ 4.8</span>
              </div>
              <p class="text-gray-600 line-clamp-2 text-sm mt-2">Отличное место для отдыха с прекрасным видом. Уютные номера и отличный сервис, который вам запомнится надолго.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
