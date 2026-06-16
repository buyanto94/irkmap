<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const props = defineProps<{
  markers: Array<{ id: number; lat: number; lng: number; title: string, image?: string, category?: string, rating?: number, slug?: string }>;
  center?: [number, number];
  zoom?: number;
}>();

const emit = defineEmits<{
  (e: 'bounds-changed', bounds: L.LatLngBounds): void;
  (e: 'marker-click', id: number): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let markerClusterGroup: L.MarkerClusterGroup | null = null;

onMounted(() => {
  if (mapContainer.value) {
    map = L.map(mapContainer.value, {
      center: props.center || [52.289588, 104.280606],
      zoom: props.zoom || 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
    });
    map.addLayer(markerClusterGroup);

    updateMarkers();

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainer.value);

    map.on('moveend', () => {
      if (map) {
        emit('bounds-changed', map.getBounds());
      }
    });

    emit('bounds-changed', map.getBounds());

    delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
});

const updateMarkers = () => {
  if (!markerClusterGroup) return;
  markerClusterGroup.clearLayers();
  
  props.markers.forEach(m => {
    const popupHtml = `
      <div class="w-48 text-left">
        ${m.image ? `<img src="${m.image}" class="w-full h-24 object-cover rounded-md mb-2" />` : ''}
        ${m.category ? `<div class="text-[10px] font-bold text-blue-600 uppercase mb-1">${m.category}</div>` : ''}
        <h4 class="font-bold text-gray-900 leading-tight mb-1" style="margin:0 0 4px 0">${m.title}</h4>
        ${m.rating ? `<div class="text-xs text-amber-500 font-bold mb-2">★ ${m.rating}</div>` : ''}
        ${m.slug ? `<a href="/objects/${m.slug}" class="text-blue-600 font-medium text-xs hover:underline block">Подробнее</a>` : ''}
      </div>
    `;

    const marker = L.marker([m.lat, m.lng])
      .bindPopup(popupHtml, { minWidth: 200 })
      .bindTooltip(m.title)
      .on('click', () => {
        emit('marker-click', m.id);
      });
      
    markerClusterGroup!.addLayer(marker);
  });
};

watch(() => props.center, (newCenter) => {
  if (map && newCenter) {
    map.setView(newCenter, map.getZoom(), { animate: true });
  }
}, { deep: true });

watch(() => props.markers, () => {
  updateMarkers();
}, { deep: true });

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<template>
  <div ref="mapContainer" class="w-full h-full z-0"></div>
</template>
