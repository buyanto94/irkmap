<script setup lang="ts">
import DefaultLayout from '@/shared/ui/DefaultLayout.vue';
import { ref, watch, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Star, Search as SearchIcon, Filter, Map, List } from 'lucide-vue-next';
import InteractiveMap from '@/shared/ui/InteractiveMap.vue';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { useTourismStore } from '@/app/stores/tourism';

defineOptions({ name: 'CatalogView' });

const route = useRoute();
const router = useRouter();
const tourismStore = useTourismStore();

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '');
const selectedCategory = ref(typeof route.query.category === 'string' ? route.query.category : '');

onMounted(() => {
  tourismStore.fetchCategories();
  tourismStore.fetchObjects();
});

const isSyncWithMap = ref(false);
const isFiltersOpen = ref(false);

const sheetHeight = ref(0);
const isDragging = ref(false);
const startY = ref(0);
const startHeight = ref(0);

const onTouchStart = (e: TouchEvent) => {
  isDragging.value = true;
  startY.value = e.touches?.[0]?.clientY ?? 0;
  startHeight.value = sheetHeight.value;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const clientY = e.touches?.[0]?.clientY ?? 0;
  const deltaY = startY.value - clientY;
  const containerHeight = window.innerHeight - 64; // height without header
  const deltaPct = (deltaY / containerHeight) * 100;
  let newHeight = startHeight.value + deltaPct;
  if (newHeight > 100) newHeight = 100;
  if (newHeight < 0) newHeight = 0;
  sheetHeight.value = newHeight;
};

const onTouchEnd = () => {
  isDragging.value = false;
  if (sheetHeight.value < 20) {
    sheetHeight.value = 0;
  } else if (sheetHeight.value < 65) {
    sheetHeight.value = 50;
  } else {
    sheetHeight.value = 100;
  }
};

const filteredObjects = computed(() => {
  let result = tourismStore.objects;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(o => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }
  if (selectedCategory.value) {
    const catObj = tourismStore.categories.find(c => c.slug === selectedCategory.value);
    if (catObj) {
      result = result.filter(o => o.category === catObj.name);
    }
  }
  return result;
});

const mapCenter = ref<[number, number]>([55.751244, 37.618423]);

const handleMarkerClick = (id: number) => {
  console.log('Marker clicked', id);
};

const centerOnMap = (obj: { lat: number, lng: number }) => {
  mapCenter.value = [obj.lat, obj.lng];
  if (window.innerWidth < 768) {
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const onMapMoved = () => {
  if (isSyncWithMap.value) {
    console.log('Map moved, fetching new data...');
  }
};

const toggleCategory = (slug: string) => {
  if (selectedCategory.value === slug) {
    selectedCategory.value = '';
  } else {
    selectedCategory.value = slug;
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="w-full flex flex-col md:flex-row h-[calc(100dvh-64px)] bg-gray-50 overflow-hidden">
      
      <!-- Desktop Sidebar: Filters ONLY -->
      <div class="hidden md:flex flex-col w-[300px] shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-5">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Фильтры</h2>
        
        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Поиск</h3>
          <div class="relative">
             <input v-model="searchQuery" type="text" placeholder="Название..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
             <SearchIcon class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Категории</h3>
          <div class="space-y-3">
            <label v-for="cat in tourismStore.categories" :key="cat.slug" class="flex items-center gap-3 cursor-pointer group" @click.prevent="toggleCategory(cat.slug)">
              <input type="checkbox" :checked="selectedCategory === cat.slug" readonly class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none" />
              <span class="text-sm text-gray-700 group-hover:text-gray-900">{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Удаленность</h3>
          <select class="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option>Любая</option>
            <option>До 10 км</option>
            <option>До 50 км</option>
            <option>До 100 км</option>
          </select>
        </div>

        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Сортировка</h3>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span class="text-sm text-gray-700 group-hover:text-gray-900">По рейтингу</span>
          </label>
        </div>
      </div>
      
      <!-- Right Side / Mobile Main -->
      <div class="flex-grow flex flex-col min-w-0 min-h-0 relative h-full overflow-hidden">
        
        <!-- Desktop List / Mobile Sheet -->
        <div 
          class="mobile-sheet w-full z-30 bg-white md:bg-gray-50 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none rounded-t-[24px] md:rounded-none flex flex-col md:border-b md:border-gray-200 shrink-0 absolute bottom-0 left-0 md:static"
          :class="sheetHeight === 0 ? 'translate-y-0' : 'translate-y-0'"
          :style="{ '--mobile-h': sheetHeight === 0 ? '96px' : `max(96px, ${sheetHeight}%)`, transition: isDragging ? 'none !important' : '' }"
        >
           <!-- Mobile Handle -->
           <div 
             class="md:hidden flex items-center justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing shrink-0"
             @touchstart="onTouchStart"
             @touchmove.prevent="onTouchMove"
             @touchend="onTouchEnd"
           >
             <div class="w-12 h-1.5 bg-gray-300 rounded-full"></div>
           </div>

           <!-- Mobile Search & Filters -->
           <div class="md:hidden px-4 pb-3 shrink-0">
             <div class="flex items-center justify-between">
                <div class="relative flex-grow mr-2">
                  <input v-model="searchQuery" type="text" placeholder="Поиск..." class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 focus:bg-white transition-all shadow-sm" />
                  <SearchIcon class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
                <button @click="isFiltersOpen = true" class="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-gray-600 bg-white shadow-sm">
                  <Filter class="w-5 h-5" />
                </button>
             </div>
           </div>

           <!-- Content -->
           <div class="flex-grow overflow-y-auto px-4 md:px-6 pb-28 pt-1 md:pt-6 md:pb-6 relative z-10 overscroll-contain transition-opacity duration-200"
                :class="sheetHeight === 0 ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto mt-4 md:mt-0' : 'opacity-100'">
              <div class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{{ filteredObjects.length }} объектов найдено</div>
              
              <!-- Cards Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="obj in filteredObjects" :key="obj.id" class="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md cursor-pointer flex gap-4 p-3 transition" @click="router.push({ name: 'object-details', params: { slug: obj.slug } })">
                   <div class="w-24 h-24 shrink-0 bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
                     <img :src="obj.image" class="w-full h-full object-cover" loading="lazy" />
                   </div>
                   <div class="flex flex-col flex-grow min-w-0">
                      <div class="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">{{ obj.category }}</div>
                      <h3 class="font-bold text-gray-900 leading-tight mb-1 truncate text-sm">{{ obj.name }}</h3>
                      <p class="text-xs text-gray-500 line-clamp-2 mb-2 w-full">{{ obj.description }}</p>
                      <div class="mt-auto flex items-center justify-between">
                        <div class="flex items-center gap-1 text-xs font-bold text-amber-500">
                          <Star class="w-3.5 h-3.5 fill-amber-500" />
                          {{ obj.rating }}
                        </div>
                        <button @click.stop="centerOnMap(obj); sheetHeight = 0;" class="text-xs text-blue-600 font-medium hover:underline transition">
                          Показать на карте
                        </button>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
        
        <!-- Map View -->
        <div class="flex-grow relative bg-gray-200 w-full z-0 h-full absolute inset-0 md:static">
           <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
             <label class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-700 cursor-pointer border border-gray-100 hover:bg-gray-50 transition whitespace-nowrap">
               <input type="checkbox" v-model="isSyncWithMap" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
               <span>Искать в этом районе</span>
             </label>
           </div>
           <InteractiveMap 
              :markers="filteredObjects.map(o => ({ id: o.id, lat: o.lat, lng: o.lng, title: o.name }))"
              :center="mapCenter"
              :zoom="12"
              @marker-click="handleMarkerClick"
              @bounds-changed="onMapMoved"
           />
        </div>
        
        <!-- Mobile Floating Toggle Button -->
        <div class="md:hidden absolute left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-auto flex justify-center w-max"
             :style="{ bottom: sheetHeight === 0 ? '112px' : `min(calc(100% - 80px), calc(max(96px, ${sheetHeight}%) + 20px))` }"
        >
          <button v-if="sheetHeight > 0" @click="sheetHeight = 0" class="bg-gray-900 text-white px-5 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 active:scale-95 transition-transform whitespace-nowrap">
            <Map class="w-5 h-5" />
            <span class="text-sm">Посмотреть на карте</span>
          </button>
          <button v-else @click="sheetHeight = 40" class="bg-gray-900 text-white px-5 py-3 rounded-full font-medium shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center gap-2 active:scale-95 transition-transform whitespace-nowrap">
            <List class="w-5 h-5" />
            <span class="text-sm">Посмотреть список</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Filters Dialog (HeadlessUI) -->
    <Dialog :open="isFiltersOpen" @close="isFiltersOpen = false" class="relative z-50 md:hidden">
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel class="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl">
          <DialogTitle class="text-[19px] font-bold text-gray-900 mb-6">Фильтры</DialogTitle>
          
          <div class="mb-6">
            <h3 class="font-medium text-gray-900 mb-3 block text-sm">Категории</h3>
            <div class="space-y-3">
              <label v-for="cat in tourismStore.categories" :key="cat.slug" class="flex items-center gap-3" @click.prevent="toggleCategory(cat.slug)">
                <input type="checkbox" :checked="selectedCategory === cat.slug" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none" />
                <span class="text-gray-700 text-base">{{ cat.name }}</span>
              </label>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="font-medium text-gray-900 mb-3 block text-sm">Удаленность</h3>
            <select class="w-full border border-gray-300 rounded-lg py-3 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white">
              <option>Любая</option>
              <option>До 10 км</option>
              <option>До 50 км</option>
              <option>До 100 км</option>
            </select>
          </div>

          <div class="mb-8">
            <h3 class="font-medium text-gray-900 mb-3 block text-sm">Сортировка</h3>
            <label class="flex items-center gap-3">
              <input type="checkbox" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span class="text-gray-700 text-base">По рейтингу</span>
            </label>
          </div>

          <button class="w-full bg-blue-600 text-white font-medium py-3 rounded-lg text-base active:bg-blue-700 transition-colors" @click="isFiltersOpen = false">
            Применить
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  </DefaultLayout>
</template>

<style scoped>
@media (max-width: 767px) {
  .mobile-sheet {
     height: var(--mobile-h);
     transition: height 0.35s cubic-bezier(0.2, 1, 0.3, 1), transform 0.35s cubic-bezier(0.2, 1, 0.3, 1);
  }
}
@media (min-width: 768px) {
  .mobile-sheet {
     height: 45%;
     transition: none;
  }
}
</style>
