<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next';

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: 'Произошла ошибка',
  description: 'Не удалось загрузить данные. Попробуйте обновить страницу.'
});

defineEmits<{
  (e: 'retry'): void
}>();
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center h-full w-full">
    <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
      <AlertCircle class="w-8 h-8 text-red-500" />
    </div>
    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 text-sm max-w-sm mb-6">{{ description }}</p>
    <button
      @click="$emit('retry')"
      class="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      Повторить попытку
    </button>
  </div>
</template>
