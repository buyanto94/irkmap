<script setup lang="ts">
import { useAuthStore } from '@/app/stores/auth';
import type { UserRole } from '@/entities/tourism/model/types';
import DashboardLayout from '@/shared/ui/DashboardLayout.vue';

defineOptions({ name: 'DashboardHome' });

const authStore = useAuthStore();

const setRole = (role: UserRole) => {
  authStore.switchRole(role);
};
</script>

<template>
  <DashboardLayout>
    <template #header>Сводка</template>
    
    <div class="space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-900 mb-2">Добро пожаловать, {{ authStore.user?.profile?.first_name }}!</h2>
        <p class="text-gray-600">Вы вошли как <span class="font-bold text-blue-600">{{ authStore.userRole }}</span>.</p>
        <p class="text-gray-500 mt-2 text-sm">Это mock-кабинет для демонстрации работы интерфейса под разными ролями.</p>
      </div>

      <div class="bg-blue-50 border border-blue-100 rounded-xl p-5">
        <h3 class="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wider">Переключить роль (Mock)</h3>
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="role in ['USER', 'BUSINESS', 'MODERATOR', 'ADMIN'] as UserRole[]" 
            :key="role"
            @click="setRole(role)"
            class="px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
            :class="authStore.userRole === role ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'"
          >
            {{ role }}
          </button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
