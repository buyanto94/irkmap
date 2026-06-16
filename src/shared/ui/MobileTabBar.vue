<script setup lang="ts">
import { Home, Map, Heart, User } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';

const authStore = useAuthStore();
</script>

<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center z-50 pb-[env(safe-area-inset-bottom)] h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
    <RouterLink :to="{ name: 'home' }" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition" active-class="text-blue-600 font-medium">
      <Home class="w-6 h-6 mb-1" />
      <span class="text-[10px]">Главная</span>
    </RouterLink>
    <RouterLink :to="{ name: 'catalog' }" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition" active-class="text-blue-600 font-medium">
      <Map class="w-6 h-6 mb-1" />
      <span class="text-[10px]">Карта</span>
    </RouterLink>
    <RouterLink :to="{ name: 'favorites' }" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition" active-class="text-blue-600 font-medium">
      <Heart class="w-6 h-6 mb-1" />
      <span class="text-[10px]">Избранное</span>
    </RouterLink>
    <RouterLink :to="{ name: authStore.isAuthenticated ? 'dashboard-home' : 'login' }" class="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition" active-class="text-blue-600 font-medium">
      <User class="w-6 h-6 mb-1" />
      <span class="text-[10px]">Кабинет</span>
    </RouterLink>
  </nav>
</template>
