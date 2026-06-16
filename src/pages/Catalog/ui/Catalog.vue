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

let initCats: string[] = [];
if (Array.isArray(route.query.category)) initCats = route.query.category as string[];
else if (typeof route.query.category === 'string') initCats = [route.query.category];
const selectedCategories = ref<string[]>(initCats);

const selectedDistance = ref<number | null>(route.query.distance ? Number(route.query.distance) : null);
const sortByRating = ref<boolean>(route.query.sort === 'rating');

watch([searchQuery, selectedCategories, selectedDistance, sortByRating], () => {
  const query: any = {};
  if (searchQuery.value) query.q = searchQuery.value;
  if (selectedCategories.value.length) query.category = selectedCategories.value;
  if (selectedDistance.value) query.distance = selectedDistance.value;
  if (sortByRating.value) query.sort = 'rating';
  router.replace({ query }).catch(() => {});
}, { deep: true });

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

const currentBounds = ref<any>(null);

const filteredObjects = computed(() => {
  let result = tourismStore.objects;
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(o => o.name.toLowerCase().includes(q) || o.description.toLowerCase().includes(q));
  }
  if (selectedCategories.value.length > 0) {
    const catNames = selectedCategories.value
      .map(slug => tourismStore.categories.find(c => c.slug === slug)?.name)
      .filter(Boolean);
    if (catNames.length > 0) {
      result = result.filter(o => catNames.includes(o.category));
    }
  }
  if (selectedDistance.value) {
     result = result.filter(o => typeof o.distance === 'number' && o.distance <= selectedDistance.value!);
  }
  if (isSyncWithMap.value && currentBounds.value) {
    const sw = currentBounds.value.getSouthWest();
    const ne = currentBounds.value.getNorthEast();
    result = result.filter(o => o.lat >= sw.lat && o.lat <= ne.lat && o.lng >= sw.lng && o.lng <= ne.lng);
  }
  if (sortByRating.value) {
     result = [...result].sort((a, b) => b.rating - a.rating);
  }
  return result;
});

const mapCenter = ref<[number, number]>([52.289588, 104.280606]);

const handleMarkerClick = (id: number) => {
  console.log('Marker clicked', id);
};

const centerOnMap = (obj: { lat: number, lng: number }) => {
  mapCenter.value = [obj.lat, obj.lng];
};

const onMapMoved = (bounds: any) => {
  currentBounds.value = bounds;
};

const toggleCategory = (slug: string) => {
  const idx = selectedCategories.value.indexOf(slug);
  if (idx === -1) {
    selectedCategories.value.push(slug);
  } else {
    selectedCategories.value.splice(idx, 1);
  }
};

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategories.value = [];
  selectedDistance.value = null;
  sortByRating.value = false;
};
</script>

<template>
  <DefaultLayout>
    <div class="w-full flex-1 flex flex-col md:flex-row bg-gray-50 overflow-hidden min-h-0">
      
      <!-- ====================== DESKTOP VERSION (FILTERS) ====================== -->
      <div class="hidden md:flex flex-col w-[300px] shrink-0 border-r border-gray-200 bg-white overflow-y-auto p-5 z-10">
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
              <input type="checkbox" :checked="selectedCategories.includes(cat.slug)" readonly class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none" />
              <span class="text-sm text-gray-700 group-hover:text-gray-900">{{ cat.name }}</span>
            </label>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Удаленность</h3>
          <select v-model="selectedDistance" class="w-full border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option :value="null">Любая</option>
            <option :value="10">До 10 км</option>
            <option :value="50">До 50 км</option>
            <option :value="100">До 100 км</option>
          </select>
        </div>

        <div class="mb-6">
          <h3 class="font-medium text-gray-900 mb-3 text-sm">Сортировка</h3>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" v-model="sortByRating" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <span class="text-sm text-gray-700 group-hover:text-gray-900">По рейтингу</span>
          </label>
        </div>
      </div>

      <!-- ====================== MAIN CONTENT AREA (List & Map) ====================== -->
      <div class="flex-grow flex flex-col md:flex-col min-w-0 min-h-0 relative overflow-hidden">

        <!-- List / Mobile Sheet -->
        <div 
          class="mobile-sheet w-full z-30 bg-white md:bg-gray-50 flex flex-col md:border-b md:border-gray-200 shrink-0 absolute bottom-0 left-0 md:static md:h-[50%]"
          :class="{
            'shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none rounded-t-[24px] md:rounded-none': true
          }"
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
                <button @click="isFiltersOpen = true" class="p-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 active:scale-95 transition-all text-gray-600 bg-white shadow-sm">
                  <Filter class="w-5 h-5" />
                </button>
             </div>
           </div>

           <!-- Content (List) -->
           <div class="flex-grow overflow-y-auto px-4 md:px-6 pb-28 pt-1 md:pt-6 md:pb-6 relative z-10 overscroll-contain transition-opacity duration-200"
                :class="sheetHeight === 0 ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto mt-4 md:mt-0' : 'opacity-100'">
              
              <!-- Cards Grid -->
              <div v-if="filteredObjects.length" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
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
                        <button @click.stop="centerOnMap(obj); sheetHeight = 0;" class="text-xs text-blue-600 font-medium hover:underline transition cursor-pointer">
                          На карте
                        </button>
                      </div>
                   </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-else class="flex flex-col items-center justify-center py-16 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SearchIcon class="w-8 h-8 text-gray-400" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">Ничего не найдено</h3>
                <p class="text-gray-500 text-sm max-w-sm">Попробуйте изменить параметры фильтрации или поисковый запрос.</p>
                <button @click="resetFilters" class="mt-6 text-blue-600 font-medium hover:underline text-sm opacity-90 hover:opacity-100">Сбросить фильтры</button>
              </div>
           </div>
        </div>
        
        <!-- Map View -->
        <div class="flex-1 relative bg-gray-200 min-w-0 min-h-0 absolute md:static inset-0 z-0">
           <div class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] md:top-6">
             <label class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-700 cursor-pointer border border-gray-100 hover:bg-gray-50 transition whitespace-nowrap">
               <input type="checkbox" v-model="isSyncWithMap" class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer" />
               <span>Искать в этом районе</span>
             </label>
           </div>
           <InteractiveMap 
              :markers="filteredObjects.map(o => ({ id: o.id, lat: o.lat, lng: o.lng, title: o.name, image: o.image, category: o.category, rating: o.rating, slug: o.slug }))"
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
          <button v-if="sheetHeight > 0" @click="sheetHeight = 0" class="bg-gray-900 text-white px-5 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 active:scale-95 transition-transform whitespace-nowrap cursor-pointer">
            <Map class="w-5 h-5" />
            <span class="text-sm">На карте</span>
          </button>
          <button v-else @click="sheetHeight = 40" class="bg-gray-900 text-white px-5 py-3 rounded-full font-medium shadow-[0_4px_15px_rgba(0,0,0,0.2)] flex items-center gap-2 active:scale-95 transition-transform whitespace-nowrap cursor-pointer">
            <List class="w-5 h-5" />
            <span class="text-sm">Списком</span>
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
              <label v-for="cat in tourismStore.categories" :key="cat.slug" class="flex items-center gap-3 cursor-pointer" @click.prevent="toggleCategory(cat.slug)">
                <input type="checkbox" :checked="selectedCategories.includes(cat.slug)" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 pointer-events-none" />
                <span class="text-gray-700 text-base">{{ cat.name }}</span>
              </label>
            </div>
          </div>
          
          <div class="mb-6">
            <h3 class="font-medium text-gray-900 mb-3 block text-sm">Удаленность</h3>
            <select v-model="selectedDistance" class="w-full border border-gray-300 rounded-lg py-3 px-3 outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white">
              <option :value="null">Любая</option>
              <option :value="10">До 10 км</option>
              <option :value="50">До 50 км</option>
              <option :value="100">До 100 км</option>
            </select>
          </div>

          <div class="mb-8">
            <h3 class="font-medium text-gray-900 mb-3 block text-sm">Сортировка</h3>
            <label class="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" v-model="sortByRating" class="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
              <span class="text-gray-700 text-base">По рейтингу</span>
            </label>
          </div>

          <button class="w-full bg-blue-600 text-white font-medium cursor-pointer py-3 rounded-lg text-base active:bg-blue-700 transition-colors" @click="isFiltersOpen = false">
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
</style>
