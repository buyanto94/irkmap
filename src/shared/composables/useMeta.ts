import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';

export interface MetaOptions {
  title?: string;
  description?: string;
  image?: string;
}

export function useMeta(optionsGetter: () => MetaOptions) {
  const route = useRoute();

  watchEffect(() => {
    const opts = optionsGetter();
    const title = opts.title ? `${opts.title} | IRK Map` : 'Турпортал IRK Map';
    const desc = opts.description || 'Иркутская область и озеро Байкал: гостиницы, базы отдыха, рестораны и достопримечательности.';
    const img = opts.image || '/og-image.jpg';
    
    // safe check for window 
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://irkmap.ru';
    
    const url = typeof window !== 'undefined' ? origin + route.fullPath : 'https://irkmap.ru' + route.fullPath;
    const fullImg = img.startsWith('http') ? img : origin + img;

    if (typeof document !== 'undefined') {
      document.title = title;
      
      const setMeta = (property: string, content: string) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (!el) {
          el = document.createElement('meta');
          el.setAttribute('property', property);
          document.head.appendChild(el);
        }
        el.setAttribute('content', content);
      };

      setMeta('og:title', title);
      setMeta('og:description', desc);
      setMeta('og:image', fullImg);
      setMeta('og:url', url);
    }
  });
}
