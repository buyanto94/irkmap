<script setup lang="ts">
import { User, LogIn, LayoutDashboard, LogOut, Map } from 'lucide-vue-next';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';
import MobileTabBar from '@/shared/ui/MobileTabBar.vue';
import PublicFooter from '@/shared/ui/PublicFooter.vue';
import { computed } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' });
};

const showFooter = computed(() => route.name !== 'catalog');
</script>
<template>
  <div class="h-dvh bg-gray-50 flex flex-col font-sans overflow-hidden">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shrink-0">
      <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg rounded-tl-none rounded-bl-none p-1 -ml-1">
            <div class="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
              <Map class="w-5 h-5" />
            </div>
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">IRK Map</span>
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

    <main class="flex-1 w-full min-h-0 relative overflow-y-auto flex flex-col md:pb-0">
      <div class="flex-1 w-full pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 flex flex-col">
        <slot />
        <PublicFooter v-if="showFooter" />
      </div>
    </main>
    <MobileTabBar />
  </div>
</template>
