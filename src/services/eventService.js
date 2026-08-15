// Event Discovery Service for NeighbourAI

const mockEvents = [
  {
    id: "evt-comedy-01",
    title: "Saturday Stand-up Comedy Night 🎤",
    description: "Prepare for a night of non-stop laughter with regional and national stand-up sensations. Food and beverages will be available at the venue.",
    date: "Saturday, August 22",
    time: "07:00 PM - 09:30 PM",
    location: "The Laugh Club, Zoo Road, Guwahati",
    distance: "2.4 km away",
    price: "₹299 onwards",
    category: "Comedy",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=600&q=80",
    featured: true,
    organizer: "Guwahati Comedy Collective",
    availableSeats: 34,
    attendees: 142,
    coordinates: { x: 45, y: 35 }, // Mock coordinates for custom map screen (0-100 scale)
    communityAttendees: [
      { name: "Amit Baruah", avatar: "👨‍💻", flat: "A-402" },
      { name: "Prerna Sen", avatar: "👩‍🎨", flat: "C-105" },
      { name: "Jatin Kalita", avatar: "👨‍🍳", flat: "B-201" }
    ]
  },
  {
    id: "evt-music-01",
    title: "Acoustic Night & Rooftop Dinner 🎵",
    description: "Enjoy a soothing evening of acoustic music under the stars with live acoustic guitar and delicious buffet cuisine.",
    date: "Sunday, August 23",
    time: "08:00 PM - 11:00 PM",
    location: "Skyline Cafe, Christian Basti",
    distance: "1.8 km away",
    price: "₹499 onwards",
    category: "Music",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Skyline Lounge & Grill",
    availableSeats: 15,
    attendees: 88,
    coordinates: { x: 60, y: 55 },
    communityAttendees: [
      { name: "Bigyat Sharma", avatar: "👋", flat: "B-304" },
      { name: "Rahul Das", avatar: "👨‍💼", flat: "D-102" }
    ]
  },
  {
    id: "evt-workshop-01",
    title: "Pottery & Clay Art Workshop 🎨",
    description: "Get your hands dirty and learn the peaceful art of clay moulding. All materials and light snacks are provided. Take home your own creation!",
    date: "Sunday, August 23",
    time: "11:00 AM - 02:00 PM",
    location: "The Clay Studio, Geetanagar",
    distance: "3.2 km away",
    price: "Free for residents",
    category: "Workshops",
    image: "https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Creative Arts Guild",
    availableSeats: 8,
    attendees: 30,
    coordinates: { x: 30, y: 70 },
    communityAttendees: [
      { name: "Devi Kakati", avatar: "👩‍⚕️", flat: "A-501" },
      { name: "Prerna Sen", avatar: "👩‍🎨", flat: "C-105" }
    ]
  },
  {
    id: "evt-food-01",
    title: "Assamese Food & Heritage Fest 🍔",
    description: "Celebrate local culinary history! Sample traditional duck dishes, pitika stalls, and standard community pitha items in a modern food festival setup.",
    date: "Friday, August 28",
    time: "05:00 PM - 10:00 PM",
    location: "Heritage Gardens, G.S. Road",
    distance: "0.5 km away",
    price: "Free Entry",
    category: "Food",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Assam Food Board",
    availableSeats: 500,
    attendees: 1250,
    coordinates: { x: 15, y: 20 },
    communityAttendees: [
      { name: "Bigyat Sharma", avatar: "👋", flat: "B-304" },
      { name: "Amit Baruah", avatar: "👨‍💻", flat: "A-402" },
      { name: "Nisha Sarma", avatar: "👩‍🏫", flat: "C-302" }
    ]
  },
  {
    id: "evt-sports-01",
    title: "Weekend Football Match (Residents vs Neighbours) 🏃",
    description: "Our community's monthly friendly soccer match. Bring your boots and play, or join us to cheer on the team!",
    date: "Saturday, August 22",
    time: "07:30 AM - 09:30 AM",
    location: "Sunshine Turf, RG Baruah Rd",
    distance: "0.2 km away",
    price: "Free",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Sunshine Residency Sports Club",
    availableSeats: 12,
    attendees: 22,
    coordinates: { x: 10, y: 12 },
    communityAttendees: [
      { name: "Amit Baruah", avatar: "👨‍💻", flat: "A-402" },
      { name: "Jatin Kalita", avatar: "👨‍🍳", flat: "B-201" }
    ]
  }
];

export const eventService = {
  async getEvents(category = "All", query = "") {
    let filtered = [...mockEvents];
    if (category !== "All") {
      filtered = filtered.filter(evt => evt.category === category);
    }
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(evt =>
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.location.toLowerCase().includes(q)
      );
    }
    return filtered;
  },

  async getEventById(id) {
    return mockEvents.find(evt => evt.id === id) || null;
  },

  async getFeaturedEvent() {
    return mockEvents.find(evt => evt.featured) || mockEvents[0];
  }
};
