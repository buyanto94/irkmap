<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { MapPin, Star, Phone, Globe, Clock, ChevronLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

defineOptions({ name: 'ObjectDetailsView' });

const router = useRouter();
</script>

<template>
  <DefaultLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      
      <button @click="router.back()" class="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition">
        <ChevronLeft class="w-4 h-4" />
        Назад в каталог
      </button>

      <!-- Gallery -->
      <div class="bg-gray-200 rounded-3xl overflow-hidden mb-10 h-[300px] sm:h-[500px] relative">
        <img src="https://picsum.photos/seed/details/1200/600" alt="Gallery" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition duration-300 bg-black/30 backdrop-blur-sm">
           <button class="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg pointer-events-auto hover:bg-gray-50 transition transform hover:scale-105 active:scale-95">
             Смотреть фотогалерею
           </button>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Main Info -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-3 mb-4 flex-wrap">
            <span class="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full uppercase tracking-wide">Гостиница</span>
            <span class="flex items-center gap-1 text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
              4.8
            </span>
          </div>
          
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">Гранд Отель Альпийский</h1>

          <div class="prose prose-lg max-w-none text-gray-600 leading-relaxed">
            <p>
              Комфортабельный отель расположен в живописном районе. Идеально подходит для 
              активного отдыха и релаксации. Просторные номера с панорамными видами, SPA-центр 
              и ресторан местной кухни.
            </p>
            <p>
              В отеле предоставляются услуги высокого класса, включая крытый бассейн, тренажерный зал и бесплатный Wi-Fi на всей территории. Завтрак по системе "шведский стол" включен в стоимость проживания. Мы гарантируем, что ваш отдых будет незабываемым.
            </p>
          </div>
        </div>

        <!-- Sidebar Contact Info & Map -->
        <div class="space-y-6">
          <div class="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm">
             <h3 class="font-bold text-xl text-gray-900 mb-6 font-display">Контакты</h3>
             <div class="space-y-5">
               <div class="flex items-start gap-4 text-gray-700">
                 <Phone class="w-6 h-6 text-blue-600 shrink-0" />
                 <a href="tel:+79990000000" class="hover:text-blue-600 font-medium text-lg transition">+7 (999) 000-00-00</a>
               </div>
               <div class="flex items-start gap-4 text-gray-700">
                 <Globe class="w-6 h-6 text-blue-600 shrink-0" />
                 <a href="#" class="hover:text-blue-600 font-medium transition text-lg truncate">alps-hotel.example.com</a>
               </div>
               <div class="flex items-start gap-4 text-gray-700">
                 <Clock class="w-6 h-6 text-blue-600 shrink-0" />
                 <span class="text-lg">Круглосуточно</span>
               </div>
             </div>
          </div>

          <div class="bg-gray-50 rounded-3xl border border-gray-200 p-2 overflow-hidden shadow-sm">
             <div class="p-4 sm:p-6 pb-4">
                <h3 class="font-bold text-lg text-gray-900">Расположение</h3>
                <p class="text-gray-600 mt-2 flex items-start gap-2">
                  <MapPin class="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  ул. Курортная, 15, Горняк
                </p>
             </div>
             <div class="h-48 sm:h-64 bg-gray-200 rounded-2xl relative overflow-hidden border border-gray-300">
                <img src="https://picsum.photos/seed/map/400/300" class="w-full h-full object-cover opacity-60" />
                <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-800 font-bold bg-white/40 backdrop-blur-sm">
                  <MapPin class="w-8 h-8 text-blue-600 mb-2" />
                  Статичная карта
                </div>
             </div>
             <button class="w-full mt-4 bg-white border border-gray-300 shadow-sm text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition active:scale-[0.98]">
               Построить маршрут
             </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
