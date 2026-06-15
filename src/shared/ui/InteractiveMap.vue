<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = defineProps<{
  markers: Array<{ id: number; lat: number; lng: number; title: string }>;
  center?: [number, number];
  zoom?: number;
}>();

const emit = defineEmits<{
  (e: 'bounds-changed', bounds: L.LatLngBounds): void;
  (e: 'marker-click', id: number): void;
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
const markerLayerGroup = L.layerGroup();

onMounted(() => {
  if (mapContainer.value) {
    // Basic setup
    map = L.map(mapContainer.value, {
      center: props.center || [55.751244, 37.618423], // Default Moscow or something
      zoom: props.zoom || 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    markerLayerGroup.addTo(map);

    // Initial markers
    updateMarkers();

    const resizeObserver = new ResizeObserver(() => {
      if (map) {
        map.invalidateSize();
      }
    });
    resizeObserver.observe(mapContainer.value);

    // Map events
    map.on('moveend', () => {
      if (map) {
        emit('bounds-changed', map.getBounds());
      }
    });

    // Fix leaflet marker icon issue
    delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }
});

const updateMarkers = () => {
  markerLayerGroup.clearLayers();
  
  // Quick hack for cluster or simple display. 
  // For real clustering we'd use leaflet.markercluster, but keeping it simple first.
  props.markers.forEach(m => {
    const marker = L.marker([m.lat, m.lng])
      .bindTooltip(m.title)
      .on('click', () => {
        emit('marker-click', m.id);
      });
    markerLayerGroup.addLayer(marker);
  });
};

// watch props.markers and update markers
import { watch } from 'vue';
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
