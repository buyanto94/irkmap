<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { Search } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTourismStore } from '@/app/stores/tourism';
import type { TourismObject } from '@/entities/tourism';
import { useMeta } from '@/shared/composables/useMeta';
import SkeletonCard from '@/shared/ui/SkeletonCard.vue';
import Skeleton from '@/shared/ui/Skeleton.vue';
import ErrorState from '@/shared/ui/ErrorState.vue';

defineOptions({ name: 'HomeView' });

useMeta(() => ({}));

const router = useRouter();
const searchQuery = ref('');
const tourismStore = useTourismStore();

onMounted(() => {
  tourismStore.fetchCategories();
  tourismStore.fetchObjects();
});

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'catalog', query: { q: searchQuery.value } });
  }
};

const goToObject = (obj: TourismObject) => {
  const categorySlug = tourismStore.getCategorySlug(obj.category);
  router.push({ name: 'object-details', params: { categorySlug, slug: obj.slug } });
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
            class="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg outline-none"
          />
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        </div>
      </div>

      <div v-if="tourismStore.isLoading">
        <div class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <Skeleton circle :width="64" :height="64" class="mb-4" />
              <Skeleton height="20px" width="70%" />
            </div>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Популярное / Новое</h2>
          <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <SkeletonCard v-for="i in 3" :key="i" />
          </div>
        </div>
      </div>

      <div v-else-if="tourismStore.error">
        <ErrorState :description="tourismStore.error" @retry="tourismStore.fetchCategories(); tourismStore.fetchObjects();" />
      </div>

      <template v-else>
        <!-- Categories -->
        <div v-if="tourismStore.categories.length" class="mb-16">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Категории</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="cat in tourismStore.categories"
              :key="cat.slug"
              @click="router.push({ name: 'catalog', query: { category: cat.slug } })"
              class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex flex-col items-center text-center transition-shadow"
            >
              <div class="w-16 h-16 rounded-full overflow-hidden mb-4 shrink-0 bg-gray-100">
                <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover" loading="lazy" />
              </div>
              <div class="font-medium text-gray-900">{{ cat.name }}</div>
            </div>
          </div>
        </div>

        <!-- Popular -->
        <div v-if="tourismStore.objects.length">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Популярное / Новое</h2>
          <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div v-for="obj in tourismStore.objects.slice(0, 3)" :key="obj.id" class="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition flex flex-col" @click="goToObject(obj)">
              <div class="h-48 bg-gray-200 shrink-0">
                 <img :src="obj.image" class="w-full h-full object-cover" loading="lazy" />
              </div>
              <div class="p-5 flex flex-col flex-grow">
                <div class="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">{{ obj.category }}</div>
                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-2">{{ obj.name }}</h3>
                <p class="text-gray-600 line-clamp-2 text-sm mb-4">{{ obj.description }}</p>
                <div class="mt-auto flex items-center justify-between">
                  <div class="flex items-center gap-1 text-sm font-bold text-amber-500">
                    <span class="text-base leading-none">★</span> {{ obj.rating }}
                  </div>
                  <button @click.stop="router.push({ name: 'catalog', query: { q: obj.name } })" class="text-sm text-blue-600 font-medium hover:underline">
                    Показать на карте
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </DefaultLayout>
</template>
