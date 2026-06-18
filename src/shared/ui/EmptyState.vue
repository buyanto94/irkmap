<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: 'Ничего не найдено',
  description: 'По вашему запросу нет результатов. Попробуйте изменить параметры поиска или фильтры.'
});
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 text-center h-full w-full">
    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <slot name="icon">
        <Inbox class="w-8 h-8 text-gray-400" />
      </slot>
    </div>
    <h3 class="text-lg font-bold text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 text-sm max-w-sm">{{ description }}</p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action"></slot>
    </div>
  </div>
</template>
