// Local Service Providers Database and Booking Service for U'R com

const mockProviders = [
  {
    id: "prov-elec-01",
    name: "Mukesh Boro",
    service: "Electrician",
    rating: 4.8,
    reviews: 112,
    distance: "0.8 km away",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 98765 43210",
    rate: "₹200/hr call-out fee",
    experience: "8 years experience"
  },
  {
    id: "prov-plum-01",
    name: "Ramesh Sharma",
    service: "Plumber",
    rating: 4.9,
    reviews: 245,
    distance: "1.2 km away",
    availability: "Busy until 4 PM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 87654 32109",
    rate: "₹250/hr call-out fee",
    experience: "12 years experience"
  },
  {
    id: "prov-clean-01",
    name: "Anjali Kalita",
    service: "Cleaning",
    rating: 4.7,
    reviews: 78,
    distance: "1.5 km away",
    availability: "Available Tomorrow",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 76543 21098",
    rate: "₹450/deep cleaning session",
    experience: "5 years experience"
  },
  {
    id: "prov-laun-01",
    name: "Express Laundry & Dry Clean",
    service: "Laundry",
    rating: 4.6,
    reviews: 134,
    distance: "0.4 km away",
    availability: "Pickups daily 9 AM - 6 PM",
    avatar: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 65432 10987",
    rate: "₹10/garment, ₹80/kg wash & iron",
    experience: "Established shop"
  },
  {
    id: "prov-wash-01",
    name: "Speedy Shine Car Wash",
    service: "Car Wash",
    rating: 4.8,
    reviews: 93,
    distance: "1.1 km away",
    availability: "Slots available",
    avatar: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 54321 09876",
    rate: "₹350/exterior-interior wash",
    experience: "Society approved vendor"
  },
  {
    id: "prov-pet-01",
    name: "Pooch Care Pet Sitting & Walk",
    service: "Pet Care",
    rating: 4.9,
    reviews: 41,
    distance: "2.3 km away",
    availability: "Available Today",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verified: true,
    phone: "+91 43210 98765",
    rate: "₹150/walk, ₹500/day sitting",
    experience: "Animal CPR certified"
  }
];

let mockBookings = [
  {
    id: "BKG-5930",
    providerName: "Ramesh Sharma",
    service: "Plumber",
    date: "2026-08-16",
    time: "10:00 AM",
    status: "Confirmed",
    rate: "₹250/hr call-out fee"
  }
];

export const serviceProviderService = {
  async getProviders(serviceType = "All") {
    if (serviceType === "All") return [...mockProviders];
    return mockProviders.filter(p => p.service.toLowerCase() === serviceType.toLowerCase());
  },

  async getBookings() {
    return [...mockBookings];
  },

  async createBooking(providerId, date, time) {
    const provider = mockProviders.find(p => p.id === providerId);
    if (!provider) throw new Error("Provider not found");

    const newBooking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      providerName: provider.name,
      service: provider.service,
      date,
      time,
      status: "Confirmed",
      rate: provider.rate
    };
    mockBookings = [newBooking, ...mockBookings];
    return newBooking;
  }
};
