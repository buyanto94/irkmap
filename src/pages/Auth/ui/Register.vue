<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';

defineOptions({ name: 'RegisterView' });

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const name = ref('');

const handleRegister = () => {
  authStore.register();
  router.push({ name: 'dashboard-home' });
};
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-gray-50">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
        <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Регистрация</h1>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input type="text" v-model="name" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
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
            Создать аккаунт
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600 flex flex-col gap-2">
          <span>
            Уже есть аккаунт? <RouterLink :to="{ name: 'login' }" class="text-blue-600 font-medium hover:underline">Войти</RouterLink>
          </span>
          <span class="pt-2 border-t border-gray-100">
            Для партнеров: <RouterLink :to="{ name: 'register-business' }" class="text-blue-600 font-medium hover:underline">Зарегистрировать бизнес</RouterLink>
          </span>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
