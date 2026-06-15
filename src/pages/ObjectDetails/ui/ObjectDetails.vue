<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { MapPin, Star, Phone, Globe, Clock, ChevronLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

defineOptions({ name: 'ObjectDetailsView' });

const router = useRouter();
const swiperModules = [Navigation, Pagination];
</script>

<template>
  <DefaultLayout>
    <div class="max-w-3xl mx-auto px-4 py-8 w-full">
      
      <button @click="router.back()" class="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
        <ChevronLeft class="w-4 h-4" />
        Назад в каталог
      </button>

      <!-- Fullscreen/Swiper Gallery -->
      <div class="rounded-xl overflow-hidden mb-8 h-[250px] sm:h-[400px] border border-gray-200">
        <swiper :modules="swiperModules" navigation pagination :loop="true" class="h-full w-full">
          <swiper-slide v-for="i in 3" :key="i">
            <img :src="`https://placehold.jp/3d405b/ffffff/1200x600.png?text=Объект+1+Фото+${i}`" alt="Gallery" class="w-full h-full object-cover" />
          </swiper-slide>
        </swiper>
      </div>

      <div class="flex flex-col gap-8">
        <!-- Main Info -->
        <div>
          <div class="flex items-center gap-3 mb-3">
            <span class="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded">Гостиница</span>
            <span class="text-[10px] uppercase font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">Работает</span>
            <span class="flex items-center gap-1 text-sm font-medium text-gray-600">
              <Star class="w-4 h-4 text-gray-400" />
              4.8
            </span>
          </div>
          
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Объект 1</h1>

          <div class="text-gray-700 space-y-4 text-base">
            <p>
              Рыба текст. Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Вдали от всех живут они в буквенных домах на берегу Семантики огромного языкового океана.
            </p>
            <p>
              Маленький ручеек Даль журчит по всей стране и обеспечивает ее всеми необходимыми правилами. Эта парадигматическая страна, в которой жареные члены предложения залетают прямо в рот.
            </p>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="border-t border-gray-200 pt-8 flex flex-col gap-4">
          <h3 class="font-bold text-lg text-gray-900 mb-2">Контакты</h3>
          <div class="flex items-center gap-3 text-gray-700 mb-1">
            <Clock class="w-5 h-5 text-gray-400" />
            <span>Круглосуточно</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-3 mt-2">
             <button class="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition flex-grow">
               <Phone class="w-5 h-5" />
               Показать телефон
             </button>
             <button class="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 px-6 rounded-xl font-medium transition flex-grow">
               <Globe class="w-5 h-5" />
               Перейти на сайт владельца
             </button>
          </div>
        </div>

        <!-- Map & Location -->
        <div class="border-t border-gray-200 pt-8 flex flex-col gap-4">
          <h3 class="font-bold text-lg text-gray-900 mb-2">Расположение</h3>
          <p class="text-gray-700 flex items-start gap-2 mb-2">
            <MapPin class="w-5 h-5 text-gray-400 shrink-0" />
            ул. Курортная, 15, Горняк
          </p>
          <div class="h-48 bg-gray-100 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-sm font-medium text-gray-500 border border-gray-200">
            <MapPin class="w-6 h-6 text-gray-400 mb-1" />
            Место на карте 
          </div>
          <button class="w-full mt-2 bg-gray-100 border border-gray-200 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 transition">
            Построить маршрут
          </button>
        </div>
      </div>
      
    </div>
  </DefaultLayout>
</template>
