<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'SkeletonBox' });

const props = withDefaults(defineProps<{
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}>(), {
  width: '100%',
  height: '100%',
  circle: false
});

const styles = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
  return {
    width: w,
    height: h,
    borderRadius: props.circle ? '50%' : undefined
  };
});
</script>

<template>
  <div
    class="bg-gray-200 animate-pulse"
    :class="{ 'rounded-full': circle, 'rounded-xl': !circle }"
    :style="styles"
  ></div>
</template>
