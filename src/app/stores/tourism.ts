import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { axiosClient } from '@/shared/api/axiosClient';
import type { TourismObject, Category, CategoriesResponse, ObjectsResponse } from '@/entities/tourism';

export const useTourismStore = defineStore('tourism', () => {
  const objects = ref<TourismObject[]>([]);
  const categories = ref<Category[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const fetchCategories = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await axiosClient.get<CategoriesResponse>('/categories.json');
      if (data.success) {
        categories.value = data.data.sort((a, b) => a.sortIndex - b.sortIndex);
      }
    } catch (e: any) {
      console.error(e);
      error.value = 'Failed to fetch categories';
    } finally {
      isLoading.value = false;
    }
  };

  const fetchObjects = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const { data } = await axiosClient.get<ObjectsResponse>('/objects.json');
      if (data.success) {
        objects.value = data.data;
      }
    } catch (e: any) {
      console.error(e);
      error.value = 'Failed to fetch objects';
    } finally {
      isLoading.value = false;
    }
  };

  const getObjectBySlug = (slug: string) => {
    return computed(() => objects.value.find((obj) => obj.slug === slug));
  };

  return {
    objects,
    categories,
    isLoading,
    error,
    fetchCategories,
    fetchObjects,
    getObjectBySlug
  };
});
