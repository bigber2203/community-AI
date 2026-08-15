// Global Event Discovery Service for U'R com

let mockEvents = [
  {
    id: "evt-nightlife-01",
    title: "Summer Beats Electronic Fest 🎧",
    description: "Get ready for the hottest electronic dance party tonight. Featuring top regional DJs and premium laser projection mappings. Food and beverages will be available.",
    date: "Tonight",
    time: "09:00 PM - 02:00 AM",
    location: "The Laugh Club Lounge, Zoo Road, Guwahati",
    approximateArea: "Zoo Road, Guwahati",
    distance: "2.4 km away",
    price: "₹500 onwards",
    category: "Nightlife",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    featured: true,
    organizer: "Guwahati Nightlife Club",
    availableSeats: 45,
    attendees: 347,
    interestedCount: 347,
    saves: 85,
    rating: 4.9,
    verificationStatus: "Verified Organizer",
    privacyLevel: "Public",
    coordinates: { x: 42, y: 35 },
    tags: ["Nightlife", "Music", "Party"]
  },
  {
    key: "evt-festival-01",
    id: "evt-festival-01",
    title: "Bhogali Bihu Fest & Food Bazaar 🪔",
    description: "Experience our rich heritage and Assamese cultural programs. Over 40 traditional food stalls, handloom exhibitions, bihu dances, and live local instrumentation.",
    date: "This Weekend",
    time: "10:00 AM - 10:00 PM",
    location: "Heritage Gardens, G.S. Road, Guwahati",
    approximateArea: "G.S. Road, Guwahati",
    distance: "0.5 km away",
    price: "Free Entry",
    category: "Festivals",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Assam Tourism Department",
    availableSeats: 2500,
    attendees: 1250,
    interestedCount: 840,
    saves: 210,
    rating: 4.8,
    verificationStatus: "Verified Event",
    privacyLevel: "Public",
    coordinates: { x: 15, y: 20 },
    tags: ["Festivals", "Culture", "Food"]
  },
  {
    id: "evt-private-01",
    title: "🔒 Secret Rooftop House Party & Jam Session",
    description: "Chilled acoustic sessions, backyard barbecue, and board games on our terrace. Approved list only. RSVP to request an invitation.",
    date: "Tonight",
    time: "08:00 PM - 11:30 PM",
    location: "Beltola (Address revealed upon host approval)",
    approximateArea: "Beltola, Guwahati (Approximate Area)",
    distance: "3.2 km away",
    price: "₹150 (BYOB)",
    category: "Social",
    image: "https://images.unsplash.com/photo-1496337589254-7e19d01eae44?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Siddharth (Sunshine Resident)",
    availableSeats: 12,
    attendees: 18,
    interestedCount: 52,
    saves: 14,
    rating: 4.6,
    verificationStatus: "Community Verified",
    privacyLevel: "Private",
    coordinates: { x: 65, y: 70 },
    tags: ["Social", "Music", "Party"]
  },
  {
    id: "evt-comedy-01",
    title: "Stand-Up Comedy Special with Abhinav 🎭",
    description: "An evening of hilarious observation comedy and crowd work. Uncensored, bachelors welcome. Unlimited laughs.",
    date: "This Weekend",
    time: "07:00 PM - 09:00 PM",
    location: "Lounge 51, Christian Basti, Guwahati",
    approximateArea: "Christian Basti, Guwahati",
    distance: "1.8 km away",
    price: "₹299 onwards",
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Humour Guild",
    availableSeats: 30,
    attendees: 110,
    interestedCount: 112,
    saves: 30,
    rating: 4.4,
    verificationStatus: "Verified Organizer",
    privacyLevel: "Public",
    coordinates: { x: 50, y: 56 },
    tags: ["Entertainment", "Comedy"]
  },
  {
    id: "evt-sports-01",
    title: "Guwahati Football Derby & Screening 🏏",
    description: "Resident sports matchup screening. Live large projector broadcast, food trucks, and friendly turf tournament matches beforehand.",
    date: "This Weekend",
    time: "04:00 PM - 08:00 PM",
    location: "RG Baruah Turf, Guwahati",
    approximateArea: "RG Baruah Rd, Guwahati",
    distance: "1.1 km away",
    price: "Free Entry",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    featured: false,
    organizer: "Guwahati United Sports",
    availableSeats: 400,
    interestedCount: 310,
    saves: 45,
    rating: 4.7,
    verificationStatus: "Verified Event",
    privacyLevel: "Public",
    coordinates: { x: 30, y: 25 },
    tags: ["Sports", "Social"]
  }
];

export const eventService = {
  async getEvents(category = "All", query = "") {
    let filtered = [...mockEvents];
    
    if (category && category !== "All") {
      filtered = filtered.filter(evt => evt.category.toLowerCase() === category.toLowerCase());
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

  async getFeaturedEvent() {
    return mockEvents.find(evt => evt.featured) || mockEvents[0];
  },

  async addEvent(evt) {
    const newEvent = {
      id: `evt-${Math.floor(100 + Math.random() * 900)}`,
      title: evt.title || "Local Gathering",
      description: evt.description || "",
      date: evt.date || "Today",
      time: evt.time || "08:00 PM",
      location: evt.privacyLevel === 'Private' ? `${evt.approximateArea || 'Beltola'} (Revealed on host approval)` : (evt.location || "Guwahati"),
      approximateArea: evt.approximateArea || evt.location || "Guwahati",
      distance: "1.2 km away",
      price: evt.price || "Free Entry",
      category: evt.category || "Social",
      image: evt.image || "https://images.unsplash.com/photo-1496337589254-7e19d01eae44?auto=format&fit=crop&w=600&q=80",
      featured: false,
      organizer: evt.organizer || "Community Organizer",
      availableSeats: parseInt(evt.capacity) || 50,
      attendees: 0,
      interestedCount: 0,
      saves: 0,
      rating: 5.0,
      verificationStatus: "Unverified",
      privacyLevel: evt.privacyLevel || "Public",
      coordinates: evt.coordinates || { x: 45, y: 45 },
      tags: [evt.category || "Social", "Local"]
    };

    mockEvents = [newEvent, ...mockEvents];
    return newEvent;
  }
};
