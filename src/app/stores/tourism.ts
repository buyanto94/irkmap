import { defineStore } from 'pinia';
import { ref } from 'vue';
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
    } catch (e: unknown) {
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
    } catch (e: unknown) {
      console.error(e);
      error.value = 'Failed to fetch objects';
    } finally {
      isLoading.value = false;
    }
  };

  const getCategorySlug = (categoryName: string) => {
    const cat = categories.value.find(c => c.name === categoryName);
    return cat ? cat.slug : 'misc';
  };

  return {
    objects,
    categories,
    isLoading,
    error,
    fetchCategories,
    fetchObjects,
    getCategorySlug
  };
});
