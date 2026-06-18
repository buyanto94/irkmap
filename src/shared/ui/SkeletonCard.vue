<script setup lang="ts">
import Skeleton from './Skeleton.vue';
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
    <Skeleton height="192px" class="rounded-none cursor-wait" />
    <div class="p-4 md:p-5 flex flex-col flex-grow">
      <div class="flex justify-between items-start mb-2 gap-4">
        <Skeleton height="24px" width="70%" />
        <Skeleton height="20px" width="48px" />
      </div>
      <Skeleton height="16px" width="100%" class="mb-1" />
      <Skeleton height="16px" width="80%" class="mb-4" />
      <div class="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2">
        <Skeleton height="24px" width="80px" class="rounded-full" />
        <Skeleton height="24px" width="60px" class="rounded-full" />
      </div>
    </div>
  </div>
</template>
