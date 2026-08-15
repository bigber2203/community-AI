// U'R Map Configuration Service

// Read env variables (defaulting to CARTO Voyager GL, which doesn't require API key)
export const MAP_STYLE_URL = import.meta.env.VITE_MAP_STYLE_URL || 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

export const MAP_DEFAULT_CENTER = [
  parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LNG) || 91.7362,
  parseFloat(import.meta.env.VITE_MAP_DEFAULT_CENTER_LAT) || 26.1445
];

export const MAP_DEFAULT_ZOOM = parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 13;
export const MAP_MIN_ZOOM = parseInt(import.meta.env.VITE_MAP_MIN_ZOOM) || 2;
export const MAP_MAX_ZOOM = parseInt(import.meta.env.VITE_MAP_MAX_ZOOM) || 20;

export const ENABLE_3D_BUILDINGS = import.meta.env.VITE_ENABLE_3D_BUILDINGS !== 'false';

// Helper to construct custom provider style URLs if using MapTiler
export const getMapStyleUrl = () => {
  const maptilerKey = import.meta.env.VITE_MAPTILER_API_KEY;
  if (maptilerKey && MAP_STYLE_URL.includes('maptiler.com') && !MAP_STYLE_URL.includes('key=')) {
    return `${MAP_STYLE_URL}?key=${maptilerKey}`;
  }
  return MAP_STYLE_URL;
};
