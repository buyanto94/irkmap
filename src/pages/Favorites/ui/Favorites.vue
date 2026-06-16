<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { HeartCrack } from 'lucide-vue-next';

defineOptions({ name: 'FavoritesView' });
</script>

<template>
  <DefaultLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[calc(100vh-64px)]">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Избранное</h1>
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <HeartCrack class="w-8 h-8 text-gray-400" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Здесь пока пусто</h2>
        <p class="text-gray-500 max-w-sm">Добавляйте объекты в избранное, чтобы быстро возвращаться к ним в будущем.</p>
      </div>
    </div>
  </DefaultLayout>
</template>
