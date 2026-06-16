<script setup lang="ts">
import { useAuthStore } from '@/app/stores/auth';
import { useRouter, RouterLink } from 'vue-router';
import { LogOut, Home, MapPin, CheckSquare, Users, FileText, Settings, User as UserIcon } from 'lucide-vue-next';

defineOptions({ name: 'DashboardLayout' });

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="h-dvh flex bg-gray-50 font-sans overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div class="h-16 flex items-center px-6 border-b border-gray-200">
        <RouterLink :to="{ name: 'home' }" class="text-xl font-bold text-gray-900">
          IRK Map
        </RouterLink>
      </div>

      <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <RouterLink 
          :to="{ name: 'dashboard-home' }"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition"
          active-class="bg-blue-50 text-blue-700"
          :class="[$route.name === 'dashboard-home' ? '' : 'text-gray-700 hover:bg-gray-100']"
        >
          <Home class="w-5 h-5" />
          Сводка
        </RouterLink>

        <!-- Business Menu -->
        <template v-if="authStore.userRole === 'BUSINESS'">
          <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Объекты</div>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <MapPin class="w-5 h-5" />
            Мои объекты
          </RouterLink>
        </template>

        <!-- Moderator Menu -->
        <template v-if="authStore.userRole === 'MODERATOR'">
          <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Модерация</div>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <CheckSquare class="w-5 h-5" />
            Очередь объектов
          </RouterLink>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <FileText class="w-5 h-5" />
            Бизнес-заявки
          </RouterLink>
        </template>

        <!-- Admin Menu -->
        <template v-if="authStore.userRole === 'ADMIN'">
          <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Система</div>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <Users class="w-5 h-5" />
            Пользователи
          </RouterLink>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <Settings class="w-5 h-5" />
            Категории
          </RouterLink>
        </template>
        
        <!-- User Menu -->
        <template v-if="authStore.userRole === 'USER'">
          <div class="pt-4 pb-2 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Профиль</div>
          <RouterLink to="#" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
            <UserIcon class="w-5 h-5" />
            Мои данные
          </RouterLink>
        </template>
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 mb-4 px-2">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
            {{ authStore.user?.profile?.first_name?.[0] || 'U' }}
          </div>
          <div class="overflow-hidden">
            <div class="text-sm font-bold text-gray-900 truncate">{{ authStore.user?.profile?.first_name }} {{ authStore.user?.profile?.last_name }}</div>
            <div class="text-xs text-gray-500 truncate">{{ authStore.userRole }}</div>
          </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer">
          <LogOut class="w-5 h-5" />
          Выйти
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-10">
        <h1 class="text-xl font-bold text-gray-900">
          <slot name="header">Кабинет</slot>
        </h1>
      </header>
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>
