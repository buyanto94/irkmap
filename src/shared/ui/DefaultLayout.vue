<script setup lang="ts">
import { User, LogIn } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';
</script>
<template>
  <div class="min-h-dvh bg-gray-50 flex flex-col font-sans">
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
            <span class="text-xl font-bold text-gray-900">Logo</span>
          </RouterLink>
          <nav class="hidden md:flex space-x-8">
            <RouterLink :to="{ name: 'catalog' }" class="text-gray-600 hover:text-gray-900 font-medium">Каталог</RouterLink>
          </nav>
          <div class="flex items-center gap-4">
            <button class="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
              <LogIn class="w-5 h-5" />
              <span class="hidden sm:inline">Войти</span>
            </button>
            <button class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
              <User class="w-5 h-5" />
              <span class="hidden sm:inline">Регистрация</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow w-full flex flex-col items-center">
      <slot />
    </main>
  </div>
</template>
