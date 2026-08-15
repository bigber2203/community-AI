// U'R Map Service - Coordinates & Location intelligence for U'R com

export const mapService = {
  // Mock Geocoding search
  searchLocation(query) {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    const locations = [
      { name: "Zoo Road, Guwahati", center: [91.7762, 26.1645], zoom: 14 },
      { name: "Christian Basti, Guwahati", center: [91.7820, 26.1540], zoom: 14 },
      { name: "Beltola, Guwahati", center: [91.7960, 26.1320], zoom: 14 },
      { name: "Jalukbari, Guwahati", center: [91.6880, 26.1560], zoom: 13 },
      { name: "Koramangala, Bengaluru", center: [77.6200, 12.9350], zoom: 14 },
      { name: "Hauz Khas, New Delhi", center: [77.2060, 28.5460], zoom: 14 },
      { name: "Bandra, Mumbai", center: [72.8300, 19.0580], zoom: 14 }
    ];

    // Try finding exact match or substring
    const match = locations.find(loc => loc.name.toLowerCase().includes(q));
    return match || null;
  },

  // Distance calculation helper (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  },

  // Mock checking if item is within bounds (Bounding box search)
  // For the prototype, we map item.coordinates.x (0-100) and y (0-100) to latitude/longitude offsets from city center
  // Guwahati center: 91.7362, 26.1445
  itemToLatLng(item) {
    if (item.latitude && item.longitude) {
      return [item.longitude, item.latitude];
    }
    // Convert mock grid coordinates x/y (0-100) to lat/lon offsets
    const baseLng = 91.7362;
    const baseLat = 26.1445;
    const x = item.coordinates?.x || 50;
    const y = item.coordinates?.y || 50;
    
    // Scale: x maps from x=0 -> -0.06 to x=100 -> +0.06 (approx 10km bounds)
    const lng = baseLng + ((x - 50) / 50) * 0.08;
    const lat = baseLat + ((y - 50) / 50) * 0.06;
    
    return [lng, lat];
  },

  // Returns all items inside MapLibre viewport bounds
  // bounds = [west, south, east, north] or MapLibre Bounds object
  getItemsInBounds(bounds, items) {
    if (!bounds) return items;
    
    let west, south, east, north;
    if (Array.isArray(bounds)) {
      [west, south, east, north] = bounds;
    } else if (bounds.getWest) {
      west = bounds.getWest();
      south = bounds.getSouth();
      east = bounds.getEast();
      north = bounds.getNorth();
    } else {
      return items;
    }

    return items.filter(item => {
      const [lng, lat] = this.itemToLatLng(item);
      return lng >= west && lng <= east && lat >= south && lat <= north;
    });
  }
};
