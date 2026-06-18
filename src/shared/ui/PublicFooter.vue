<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <footer class="bg-white border-t border-gray-200 mt-auto shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex flex-col items-center md:items-start">
          <RouterLink :to="{ name: 'home' }" class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mb-2">
            IRK Map
          </RouterLink>
          <p class="text-sm text-gray-500 text-center md:text-left">
            Туристический портал Иркутской области и Байкала
          </p>
        </div>
        
        <nav class="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <RouterLink :to="{ name: 'catalog' }" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Каталог объектов
          </RouterLink>
          <a href="#" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            О проекте
          </a>
          <a href="#" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Для бизнеса
          </a>
        </nav>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>&copy; {{ new Date().getFullYear() }} IRK Map. Все права защищены.</p>
        <p>Сделано с любовью на Байкале</p>
      </div>
    </div>
  </footer>
</template>
