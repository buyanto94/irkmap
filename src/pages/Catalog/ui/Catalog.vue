<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { Search, MapPin, Star } from 'lucide-vue-next';
import InteractiveMap from '@/shared/ui/InteractiveMap.vue';

const route = useRoute();
const searchQuery = ref(route.query.q || '');
const categories = ['Гостиницы', 'Активный отдых', 'Культура', 'Рестораны'];
const selectedCategories = ref<string[]>([]);

const objects = ref(Array.from({ length: 6 }).map((_, i) => ({
  id: i,
  name: `Тестовый объект ${i + 1}`,
  category: categories[i % categories.length],
  description: 'Краткое описание данного объекта. Отличное место для посещения.',
  rating: (4 + Math.random()).toFixed(1),
  distance: Math.floor(Math.random() * 20),
  lat: 55.751244 + (Math.random() - 0.5) * 0.1,
  lng: 37.618423 + (Math.random() - 0.5) * 0.1,
})));

const mapCenter = ref<[number, number]>([55.751244, 37.618423]);

const handleMarkerClick = (id: number) => {
  console.log('Marker clicked', id);
  // Optionally highlight card
};
</script>

<template>
  <DefaultLayout>
    <div class="flex-grow flex flex-col md:flex-row bg-gray-50">
      <!-- Слева Фильтры -->
      <aside class="w-full md:w-64 bg-white border-r border-gray-200 p-6 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto z-10">
        <div class="mb-6">
          <h3 class="font-bold text-gray-900 mb-4">Поиск</h3>
          <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Название..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 outline-none" />
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-gray-900 mb-4">Категории</h3>
          <div class="space-y-3">
            <label v-for="cat in categories" :key="cat" class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" :value="cat" v-model="selectedCategories" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span class="text-sm text-gray-700">{{ cat }}</span>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-bold text-gray-900 mb-4">Удаленность</h3>
          <select class="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-blue-500 outline-none bg-white">
            <option>Любая</option>
            <option>До 10 км</option>
            <option>До 50 км</option>
            <option>До 100 км</option>
          </select>
        </div>
      </aside>

      <!-- В центре Список -->
      <div class="flex-grow flex flex-col relative z-0">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">Результаты поиска</h1>
            <select class="border border-gray-300 rounded-lg text-sm bg-white py-2 px-3 outline-none">
              <option>По рейтингу</option>
              <option>Сначала новые</option>
            </select>
          </div>

          <div class="grid xl:grid-cols-2 gap-6">
            <div v-for="obj in objects" :key="obj.id" class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row">
              <div class="h-48 sm:h-auto sm:w-48 shrink-0 bg-gray-200 relative">
                 <div class="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                   {{ obj.distance }} км
                 </div>
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <div class="text-xs font-medium text-blue-600 mb-1 max-w-max bg-blue-50 px-2 py-0.5 rounded">{{ obj.category }}</div>
                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-2">
                  <router-link :to="{ name: 'object-details', params: { slug: 'sample' } }" class="hover:text-blue-600">
                    {{ obj.name }}
                  </router-link>
                </h3>
                <p class="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">{{ obj.description }}</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div class="flex items-center gap-1 text-sm font-medium">
                    <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
                    {{ obj.rating }}
                  </div>
                  <button class="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1" @click="mapCenter = [obj.lat, obj.lng]">
                    <MapPin class="w-4 h-4" />
                    На карте
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Снизу Карта (desktop flex, bottom height static or resizable) -->
        <div class="h-[400px] border-t border-gray-200 relative mt-auto sticky bottom-0">
          <InteractiveMap 
             :markers="objects.map(o => ({ id: o.id, lat: o.lat, lng: o.lng, title: o.name }))"
             :center="mapCenter"
             :zoom="10"
             @marker-click="handleMarkerClick"
          />
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
