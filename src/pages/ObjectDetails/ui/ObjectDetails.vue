<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { MapPin, Star, Phone, Globe, Clock, ChevronLeft } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import { useTourismStore } from '@/app/stores/tourism';
import { onMounted, watch } from 'vue';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

defineOptions({ name: 'ObjectDetailsView' });

const route = useRoute();
const router = useRouter();
const swiperModules = [Navigation, Pagination];
const tourismStore = useTourismStore();

onMounted(() => {
  if (tourismStore.categories.length === 0) {
    tourismStore.fetchCategories();
  }
  if (tourismStore.objects.length === 0) {
    tourismStore.fetchObjects();
  }
});

const slug = route.params.slug as string;
const obj = tourismStore.getObjectBySlug(slug);

watch(obj, (newObj) => {
  if (newObj && route.name === 'object-details-legacy') {
    const cat = tourismStore.categories.find(c => c.name === newObj.category);
    const categorySlug = cat ? cat.slug : 'misc';
    router.replace({ name: 'object-details', params: { categorySlug, slug: newObj.slug } });
  }
}, { immediate: true });

const showPhone = () => {
  if (obj.value?.contacts?.phone) {
    alert(`Телефон: ${obj.value.contacts.phone}`);
  }
};

const goToWebsite = () => {
  if (obj.value?.contacts?.website) {
    let url = obj.value.contacts.website;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
};

const openGallery = (index: number) => {
  if (!obj.value?.photos) return;
  const images = obj.value.photos.map(src => ({ src, type: 'image' }));
  Fancybox.show(images, {
    startIndex: index,
  });
};
</script>

<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      
      <div v-if="!obj && tourismStore.isLoading" class="text-center py-12">
        <span class="text-gray-500 text-sm">Загрузка...</span>
      </div>

      <template v-else-if="obj">
        <!-- Fullscreen/Swiper Gallery -->
        <div v-if="obj.photos && obj.photos.length" class="rounded-xl overflow-hidden mb-8 h-[250px] sm:h-[400px] border border-gray-200">
          <swiper :modules="swiperModules" navigation pagination :loop="true" class="h-full w-full">
            <swiper-slide v-for="(photo, i) in obj.photos" :key="i" @click="openGallery(i)" class="cursor-pointer">
              <img :src="photo" alt="Gallery" class="w-full h-full object-cover" />
            </swiper-slide>
          </swiper>
        </div>

        <div class="flex flex-col gap-8">
          <!-- Main Info -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span class="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded">{{ obj.category }}</span>
              <span :class="['text-[10px] uppercase font-bold px-2 py-0.5 rounded', obj.isOpen ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100']">
                {{ obj.isOpen ? 'Работает' : 'Закрыто' }}
              </span>
              <span class="flex items-center gap-1 text-sm font-medium text-gray-600">
                <Star class="w-4 h-4 text-gray-400" />
                {{ obj.rating }}
              </span>
            </div>
            
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{{ obj.name }}</h1>

            <div class="text-gray-700 space-y-4 text-base">
              <p>{{ obj.description }}</p>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="border-t border-gray-200 pt-8 flex flex-col gap-4">
            <h3 class="font-bold text-lg text-gray-900 mb-2">Контакты</h3>
            <div class="flex items-center gap-3 text-gray-700 mb-1" v-if="obj.contacts?.hours">
              <Clock class="w-5 h-5 text-gray-400" />
              <span>{{ obj.contacts.hours }}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 mt-2" v-if="obj.contacts">
               <button v-if="obj.contacts.phone" @click="showPhone" class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition cursor-pointer flex-grow">
                 <Phone class="w-5 h-5" />
                 Показать телефон
               </button>
               <button v-if="obj.contacts.website" @click="goToWebsite" class="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl font-medium transition cursor-pointer flex-grow">
                 <Globe class="w-5 h-5" />
                 Перейти на сайт владельца
               </button>
            </div>
          </div>

          <!-- Map & Location -->
          <div class="border-t border-gray-200 pt-8 flex flex-col gap-4">
            <h3 class="font-bold text-lg text-gray-900 mb-2">Расположение</h3>
            <p v-if="obj.contacts?.address" class="text-gray-700 flex items-start gap-2 mb-2">
              <MapPin class="w-5 h-5 text-gray-400 shrink-0" />
              {{ obj.contacts.address }}
            </p>
            <div class="h-48 bg-gray-100 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-sm font-medium text-gray-500 border border-gray-200">
              <MapPin class="w-6 h-6 text-gray-400 mb-1" />
              Статичная карта 
            </div>
            <button class="w-full mt-2 bg-gray-100 border border-gray-200 text-gray-900 py-3 rounded-xl font-medium cursor-pointer hover:bg-gray-200 transition">
              Построить маршрут
            </button>
          </div>
        </div>
      </template>
      
      <div v-else class="text-center py-12">
        <span class="text-red-500 text-sm">Объект не найден</span>
      </div>
      
    </div>
  </DefaultLayout>
</template>
