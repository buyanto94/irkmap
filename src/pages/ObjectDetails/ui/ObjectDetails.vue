<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { MapPin, Star, Phone, Globe, Clock, ChevronLeft } from 'lucide-vue-next';
</script>

<template>
  <DefaultLayout>
    <div class="bg-gray-50 flex-grow py-8">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <router-link :to="{ name: 'catalog' }" class="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition">
          <ChevronLeft class="w-4 h-4" />
          Назад в каталог
        </router-link>

        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
          <!-- Галерея -->
          <div class="h-64 sm:h-96 w-full bg-gray-200 relative group cursor-pointer">
            <div class="absolute inset-0 flex items-center justify-center text-gray-400">
               Галерея изображений
            </div>
            <div class="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm font-medium">
              Смотреть все фото
            </div>
          </div>

          <div class="p-8">
            <div class="flex flex-col md:flex-row md:justify-between items-start gap-4 mb-6">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Гостиница</span>
                  <span class="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    <Star class="w-4 h-4 fill-amber-500 text-amber-500" />
                    4.8
                  </span>
                  <span class="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                    <div class="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Открыто
                  </span>
                </div>
                <h1 class="text-3xl font-bold text-gray-900">Гранд Отель Альпийский</h1>
              </div>
            </div>

            <p class="text-gray-600 leading-relaxed mb-8">
              Комфортабельный отель расположен в живописном районе. Идеально подходит для 
              активного отдыха и релаксации. Просторные номера с панорамными видами, SPA-центр 
              и ресторан местной кухни.
            </p>

            <div class="grid sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
              <div class="space-y-4">
                <h3 class="font-bold text-gray-900 mb-2">Контакты</h3>
                <div class="flex items-center gap-3 text-gray-600">
                  <Phone class="w-5 h-5 text-gray-400" />
                  <a href="#" class="hover:text-blue-600 font-medium">+7 (999) 000-00-00</a>
                </div>
                <div class="flex items-center gap-3 text-gray-600">
                  <Globe class="w-5 h-5 text-gray-400" />
                  <a href="#" class="hover:text-blue-600 font-medium">example.com</a>
                </div>
              </div>
              
              <div class="space-y-4">
                <h3 class="font-bold text-gray-900 mb-2">Основное</h3>
                <div class="flex items-start gap-3 text-gray-600">
                  <MapPin class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <span>ул. Курортная, 15, Горняк</span>
                </div>
                <div class="flex items-start gap-3 text-gray-600">
                  <Clock class="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <span>Круглосуточно</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-xl text-gray-900 mb-4">На карте</h3>
              <div class="h-64 rounded-xl bg-gray-200 overflow-hidden relative">
                <div class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 z-0">
                  <MapPin class="w-8 h-8 text-blue-500 mb-2" />
                  <span>Статичная карта проезда</span>
                </div>
                <div class="absolute bottom-4 left-4 z-10">
                  <button class="bg-white text-gray-900 px-4 py-2 text-sm font-medium rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition">
                    Построить маршрут
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>
