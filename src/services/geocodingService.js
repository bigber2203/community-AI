// U'R Geocoding Service - Real Map Place & Area Search

const mockLocations = [
  { name: "Zoo Road, Guwahati", center: [91.7762, 26.1645], zoom: 14 },
  { name: "Christian Basti, Guwahati", center: [91.7820, 26.1540], zoom: 14 },
  { name: "Beltola, Guwahati", center: [91.7960, 26.1320], zoom: 14 },
  { name: "Jalukbari, Guwahati", center: [91.6880, 26.1560], zoom: 13 },
  { name: "Koramangala, Bengaluru", center: [77.6200, 12.9350], zoom: 14 },
  { name: "Hauz Khas, New Delhi", center: [77.2060, 28.5460], zoom: 14 },
  { name: "Bandra, Mumbai", center: [72.8300, 19.0580], zoom: 14 }
];

export const geocodingService = {
  // Async search that queries real-world geocoding APIs and falls back to mock list
  async search(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    try {
      // 1. Check if MapTiler API Key is configured for official Geocoding API
      const maptilerKey = import.meta.env.VITE_MAPTILER_API_KEY;
      if (maptilerKey) {
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(q)}.json?key=${maptilerKey}&bbox=91.5,26.0,92.0,26.3`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data && data.features && data.features.length > 0) {
            return data.features.map(f => ({
              name: f.place_name || f.text || q,
              center: f.center, // [lng, lat]
              zoom: f.bbox ? 14 : 15
            }));
          }
        }
      }

      // 2. Fallback: Public OSM Nominatim API (Free, open-source search engine for OSM data)
      // Note: We use a custom User-Agent to respect OSM policy.
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&viewbox=91.65,26.08,91.85,26.22`;
      const response = await fetch(nominatimUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'URcom-App-Discovery/1.0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return data.map(item => ({
            name: item.display_name,
            center: [parseFloat(item.lon), parseFloat(item.lat)],
            zoom: 14
          }));
        }
      }
    } catch (err) {
      console.warn("Geocoding API failed or rate-limited. Falling back to local mock search.", err);
    }

    // 3. Absolute Fallback: Local mock list filter
    const matches = mockLocations.filter(loc => loc.name.toLowerCase().includes(q));
    return matches;
  }
};
