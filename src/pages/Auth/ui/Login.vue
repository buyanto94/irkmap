<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';
import type { UserRole } from '@/entities/tourism/model/types';
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';

defineOptions({ name: 'LoginView' });

const router = useRouter();
const authStore = useAuthStore();
const email = ref('test@example.com');
const password = ref('password');
const selectedRole = ref<UserRole>('USER');

const handleLogin = () => {
  authStore.login(selectedRole.value, email.value);
  router.push({ name: 'dashboard-home' });
};
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-gray-50">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Вход (Mock)</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Роль для демо</label>
            <select v-model="selectedRole" class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent">
              <option value="USER">Пользователь</option>
              <option value="BUSINESS">Бизнес</option>
              <option value="MODERATOR">Модератор</option>
              <option value="ADMIN">Администратор</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">Выберите роль для имитации входа</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" v-model="email" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" v-model="password" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          
          <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer">
            Войти
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          Нет аккаунта? <RouterLink :to="{ name: 'register' }" class="text-blue-600 font-medium hover:underline">Зарегистрироваться</RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
