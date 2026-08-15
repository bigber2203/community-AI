// Housing & Roommate Directory Service for NeighbourAI

let mockListings = [
  {
    id: "hse-01",
    type: "Flat",
    title: "Premium 2BHK Apartment near City Center",
    description: "Beautiful, fully furnished 2BHK flat with continuous water supply and covered parking. Located in a secure gated community. Bachelors allowed.",
    locationName: "Zoo Road, Guwahati",
    distance: "1.8 km away",
    rent: 18000,
    bedrooms: 2,
    bathrooms: 2,
    furnished: "Fully Furnished",
    petsAllowed: true,
    verificationStatus: "Verified Owner",
    contact: "+91 98765 43221",
    saves: 32,
    rating: 4.8,
    interestedCount: 145,
    coordinates: { x: 38, y: 48 }, // Map grid coordinates (0-100)
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    tags: ["Flat", "Housing", "Furnished"]
  },
  {
    id: "hse-02",
    type: "Room",
    title: "Spacious Private Room in 3BHK",
    description: "Looking for a flatmate to occupy a spacious, well-ventilated private bedroom in our 3BHK. Sharing hall and kitchen with two friendly working professionals.",
    locationName: "Beltola, Guwahati",
    distance: "3.5 km away",
    rent: 6500,
    bedrooms: 1,
    bathrooms: 1,
    furnished: "Semi-Furnished",
    petsAllowed: false,
    verificationStatus: "Community Verified",
    contact: "+91 87654 32110",
    saves: 18,
    rating: 4.5,
    interestedCount: 64,
    coordinates: { x: 62, y: 72 },
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    tags: ["Room", "Housing", "Roommate"]
  },
  {
    id: "hse-03",
    type: "PG",
    title: "Modern Boys PG with Meals included",
    description: "Premium single and double sharing rooms. Rent includes 3 meals a day, high-speed WiFi, laundry services, and daily cleaning. Very close to Engineering College.",
    locationName: "Jalukbari, Guwahati",
    distance: "8.2 km away",
    rent: 8500,
    bedrooms: 1,
    bathrooms: 1,
    furnished: "Fully Furnished",
    petsAllowed: false,
    verificationStatus: "Verified Organizer",
    contact: "+91 76543 21019",
    saves: 45,
    rating: 4.7,
    interestedCount: 210,
    coordinates: { x: 12, y: 30 },
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    tags: ["PG", "Housing"]
  },
  {
    id: "hse-04",
    type: "Roommate",
    title: "Flatmate needed for 2BHK flat",
    description: "Looking for a chill female roommate to share a beautiful 2BHK. Vegetarian preferred. Rent is split equally.",
    locationName: "Christian Basti, Guwahati",
    distance: "2.1 km away",
    rent: 9000,
    bedrooms: 2,
    bathrooms: 2,
    furnished: "Unfurnished",
    petsAllowed: true,
    verificationStatus: "Unverified",
    contact: "+91 65432 10928",
    saves: 12,
    rating: 4.2,
    interestedCount: 22,
    coordinates: { x: 50, y: 55 },
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
    tags: ["Roommate", "Housing"]
  }
];

export const listingService = {
  async getListings(filters = {}) {
    let result = [...mockListings];

    if (filters.type && filters.type !== 'All') {
      result = result.filter(item => item.type.toLowerCase() === filters.type.toLowerCase());
    }

    if (filters.maxRent) {
      result = result.filter(item => item.rent <= filters.maxRent);
    }

    if (filters.bedrooms) {
      result = result.filter(item => item.bedrooms === parseInt(filters.bedrooms));
    }

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.locationName.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async addListing(item) {
    const newListing = {
      id: `hse-${Math.floor(100 + Math.random() * 900)}`,
      type: item.type || "Flat",
      title: item.title || "Charming space",
      description: item.description || "",
      locationName: item.locationName || "Guwahati",
      distance: "1.0 km away",
      rent: parseInt(item.rent) || 10000,
      bedrooms: parseInt(item.bedrooms) || 1,
      bathrooms: parseInt(item.bathrooms) || 1,
      furnished: item.furnished || "Unfurnished",
      petsAllowed: item.petsAllowed || false,
      verificationStatus: "Unverified",
      contact: item.contact || "+91 99999 99999",
      saves: 0,
      rating: 5.0,
      interestedCount: 0,
      coordinates: item.coordinates || { x: 45, y: 45 },
      image: item.image || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
      tags: [item.type || "Flat", "Housing"]
    };

    mockListings = [newListing, ...mockListings];
    return newListing;
  }
};
