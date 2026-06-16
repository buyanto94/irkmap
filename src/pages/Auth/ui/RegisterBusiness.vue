<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/app/stores/auth';
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { Upload } from 'lucide-vue-next';

defineOptions({ name: 'RegisterBusinessView' });

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const companyName = ref('');
const inn = ref('');
const contactPerson = ref('');
const files = ref<File[]>([]);

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);
    if (files.value.length + newFiles.length > 5) {
      alert('Максимальное количество документов - 5');
      return;
    }
    files.value.push(...newFiles);
  }
};

const handleRegister = () => {
  // Mock switching role to BUSINESS and logging in to demonstrate dashboard
  authStore.login('BUSINESS', email.value);
  router.push({ name: 'dashboard-home' });
};
</script>

<template>
  <DefaultLayout>
    <div class="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4 bg-gray-50 pb-16 pt-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-lg">
        <h1 class="text-2xl font-bold text-gray-900 mb-2 text-center">Регистрация бизнеса</h1>
        <p class="text-gray-500 text-sm text-center mb-8">Подайте заявку на размещение ваших объектов на портале</p>
        
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Название компании</label>
            <input type="text" v-model="companyName" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ИНН</label>
            <input type="text" v-model="inn" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Контактное лицо</label>
            <input type="text" v-model="contactPerson" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" v-model="email" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
            <input type="password" v-model="password" required class="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>

          <div class="pt-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Документы (до 5 файлов)</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
               <input type="file" multiple @change="handleFileChange" accept="image/*,.pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               <Upload class="w-8 h-8 text-gray-400 mb-2" />
               <span class="text-sm font-medium text-gray-600">Нажмите или перетащите файлы</span>
            </div>
            <ul v-if="files.length" class="mt-4 space-y-2">
              <li v-for="(f, i) in files" :key="i" class="text-sm text-gray-600 flex justify-between bg-gray-50 p-2 rounded border border-gray-100">
                <span class="truncate">{{ f.name }}</span>
                <button type="button" @click="files.splice(i, 1)" class="text-red-500 hover:underline">Удалить</button>
              </li>
            </ul>
          </div>
          
          <div class="pt-4">
            <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition cursor-pointer">
              Отправить заявку
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          Обычный пользователь? <RouterLink :to="{ name: 'register' }" class="text-blue-600 font-medium hover:underline">Стандартная регистрация</RouterLink>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
