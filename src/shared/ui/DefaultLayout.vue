<script setup lang="ts">
import { User, LogIn, LayoutDashboard, LogOut } from 'lucide-vue-next';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' });
};
</script>
<template>
  <div class="h-dvh bg-gray-50 flex flex-col font-sans overflow-hidden">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shrink-0">
      <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
            <span class="text-xl font-bold text-gray-900">IRK Map</span>
          </RouterLink>
          <nav class="hidden md:flex space-x-8">
            <RouterLink :to="{ name: 'catalog' }" class="text-gray-600 hover:text-gray-900 font-medium">Каталог</RouterLink>
          </nav>
          <div class="flex items-center gap-4 text-sm font-medium">
            <template v-if="!authStore.isAuthenticated">
              <RouterLink :to="{ name: 'login' }" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <LogIn class="w-5 h-5" />
                <span class="hidden sm:inline">Войти</span>
              </RouterLink>
              <RouterLink :to="{ name: 'register' }" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                <User class="w-5 h-5" />
                <span class="hidden sm:inline">Регистрация</span>
              </RouterLink>
            </template>
            <template v-else>
              <RouterLink :to="{ name: 'dashboard-home' }" class="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <LayoutDashboard class="w-5 h-5" />
                <span class="hidden sm:inline">Кабинет ({{ authStore.userRole }})</span>
              </RouterLink>
              <button @click="handleLogout" class="text-red-500 hover:text-red-700 flex items-center gap-2 cursor-pointer transition-colors ml-2">
                <LogOut class="w-5 h-5" />
                <span class="hidden sm:inline">Выйти</span>
              </button>
            </template>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 w-full min-h-0 relative overflow-y-auto flex flex-col">
      <slot />
    </main>
  </div>
</template>
