import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useObjectsStore = defineStore('objects', () => {
  const objects = ref<any[]>([]);
  const loading = ref(false);

  const fetchObjects = async () => {
    loading.value = true;
    try {
      // Simulate API call using axios
      await new Promise((resolve) => setTimeout(resolve, 500));
      objects.value = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        name: `Динамический объект ${i + 1}`,
        category: 'Гостиницы',
        description: 'Отличное место.',
        rating: 4.5,
        distance: 10,
        lat: 55.751244 + (Math.random() - 0.5) * 0.1,
        lng: 37.618423 + (Math.random() - 0.5) * 0.1,
      }));
    } finally {
      loading.value = false;
    }
  };

  return { objects, loading, fetchObjects };
});
