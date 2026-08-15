import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Heart, Share2, Star, Check, Phone, Shield } from 'lucide-react';
import { eventService } from '../services/eventService';
import { listingService } from '../services/listingService';
import { rankingService } from '../services/rankingService';

export default function DiscoverScreen({ userProfile, quickFilters, clearQuickFilters }) {
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  
  const [interestedEvents, setInterestedEvents] = useState(new Set());
  const [joinedPrivateEvents, setJoinedPrivateEvents] = useState(new Set());
  const [savedListings, setSavedListings] = useState(new Set());

  const categories = [
    'All', 'Trending', 'Events', 'Nightlife', 'Music', 'Festivals', 'Entertainment', 'Sports', 'Social', 'Housing', 'Roommate'
  ];

  useEffect(() => {
    async function loadData() {
      // Load events
      const allEvts = await eventService.getEvents();
      const rankedEvts = rankingService.rankItems(allEvts, userProfile.interests);
      
      // Load housing
      const allListings = await listingService.getListings();
      const rankedListings = rankingService.rankItems(allListings, userProfile.interests);

      setEvents(rankedEvts);
      setListings(rankedListings);
    }
    loadData();
  }, [userProfile.interests]);

  // Deep linking logic from HomeScreen quick actions
  useEffect(() => {
    if (quickFilters) {
      if (quickFilters.category) {
        setSelectedCategory(quickFilters.category);
      } else if (quickFilters.tonightOnly) {
        setSelectedCategory('Events');
        setSearchQuery('tonight');
      } else if (quickFilters.trendingOnly) {
        setSelectedCategory('Trending');
      } else if (quickFilters.type) {
        setSelectedCategory(quickFilters.type === 'Flat' ? 'Housing' : 'Roommate');
      }

      // Handle direct item detail openings
      if (quickFilters.openEventId) {
        const findEvt = events.find(e => e.id === quickFilters.openEventId);
        if (findEvt) setSelectedEvent(findEvt);
      }
      if (quickFilters.openListingId) {
        const findLst = listings.find(l => l.id === quickFilters.openListingId);
        if (findLst) setSelectedListing(findLst);
      }

      clearQuickFilters();
    }
  }, [quickFilters, events, listings]);

  const toggleInterest = (id) => {
    const updated = new Set(interestedEvents);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setInterestedEvents(updated);
  };

  const requestJoinPrivateEvent = (id) => {
    const updated = new Set(joinedPrivateEvents);
    updated.add(id);
    setJoinedPrivateEvents(updated);
  };

  const toggleSaveListing = (id) => {
    const updated = new Set(savedListings);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSavedListings(updated);
  };

  // Filters logic
  const getFilteredItems = () => {
    let filteredEvents = [...events];
    let filteredListings = [...listings];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
      filteredListings = filteredListings.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.locationName.toLowerCase().includes(q));
    }

    if (selectedCategory === 'Trending') {
      // Sort by score
      return { events: filteredEvents.slice(0, 3), listings: [] };
    }

    if (selectedCategory === 'Events') {
      return { events: filteredEvents, listings: [] };
    }

    if (selectedCategory === 'Nightlife' || selectedCategory === 'Music' || selectedCategory === 'Festivals' || selectedCategory === 'Entertainment' || selectedCategory === 'Sports' || selectedCategory === 'Social') {
      return { events: filteredEvents.filter(e => e.category === selectedCategory), listings: [] };
    }

    if (selectedCategory === 'Housing') {
      return { events: [], listings: filteredListings.filter(l => l.type === 'Flat' || l.type === 'Room' || l.type === 'PG') };
    }

    if (selectedCategory === 'Roommate') {
      return { events: [], listings: filteredListings.filter(l => l.type === 'Roommate') };
    }

    // 'All' displays everything
    return { events: filteredEvents, listings: filteredListings };
  };

  const { events: displayEvents, listings: displayListings } = getFilteredItems();

  return (
    <div className="screen-content">
      <div className="screen-content-inner">
      {/* Title */}
      <div style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Discover Around You 🔎</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Real-time events, housing, & community hubs.</p>
      </div>

      {/* Large Search Bar */}
      <div className="clay-input-container">
        <Search size={18} color="var(--deep-teal)" />
        <input 
          type="text" 
          className="clay-input" 
          placeholder="Search parties, events, festivals, homes..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Horizontal Filter Chips */}
      <div 
        className="custom-scroll" 
        style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          padding: '4px 0',
          scrollbarWidth: 'none'
        }}
      >
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className="clay-btn"
            style={{
              padding: '8px 16px',
              borderRadius: '16px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              backgroundColor: selectedCategory === cat ? 'var(--primary-cyan)' : '#FFFFFF',
              boxShadow: selectedCategory === cat 
                ? '3px 3px 6px rgba(22, 217, 227, 0.2), inset 2px 2px 4px rgba(255,255,255,0.4)' 
                : '3px 3px 6px rgba(8, 127, 140, 0.05)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Display Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
        
        {/* Events Section */}
        {displayEvents.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '15px', textAlign: 'left' }}>Events & Nights</h4>
            <div className="discover-grid">
              {displayEvents.map((evt) => (
              <div 
                key={evt.id} 
                onClick={() => setSelectedEvent(evt)}
                className="clay-card clay-card-interactive" 
                style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                  <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* U'R Score badge */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.95)', padding: '4px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <span>Score: {evt.urScore}</span>
                  </div>
                  {/* Privacy Badge */}
                  {evt.privacyLevel === 'Private' && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--purple)', color: '#FFFFFF', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '700' }}>
                      🔒 PRIVATE
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--pink)', textTransform: 'uppercase' }}>{evt.category}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>📍 {evt.distance}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{evt.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                    <span>🕒 {evt.time}</span>
                    <span style={{ fontWeight: '800', color: 'var(--deep-teal)' }}>{evt.price}</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Housing / Roommates Section */}
        {displayListings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '15px', textAlign: 'left' }}>Housing & Roommates</h4>
            <div className="discover-grid">
              {displayListings.map((list) => (
              <div 
                key={list.id} 
                onClick={() => setSelectedListing(list)}
                className="clay-card clay-card-interactive" 
                style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', textAlign: 'left', cursor: 'pointer' }}
              >
                <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                  <img src={list.image} alt={list.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {/* Verified Owner overlay */}
                  <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(255,255,255,0.95)', padding: '4px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} color="var(--green)" strokeWidth={3} />
                    <span>{list.verificationStatus}</span>
                  </div>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>{list.type}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>📍 {list.distance}</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{list.title}</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                    <span>🛌 {list.bedrooms} Bed · 🚿 {list.bathrooms} Bath</span>
                    <span style={{ fontWeight: '800', color: 'var(--deep-teal)' }}>₹{list.rent}/month</span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

        {displayEvents.length === 0 && displayListings.length === 0 && (
          <p style={{ textAlign: 'center', padding: '30px', color: 'var(--text-sub)' }}>No matches found. Try another search or filter.</p>
        )}

      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img src={selectedEvent.image} alt={selectedEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="clay-btn" 
                style={{ position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}
              >
                ✕
              </button>
              
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => toggleInterest(selectedEvent.id)}
                  className="clay-btn" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    padding: 0,
                    backgroundColor: interestedEvents.has(selectedEvent.id) ? 'var(--pink)' : '#FFFFFF',
                    color: interestedEvents.has(selectedEvent.id) ? '#FFFFFF' : 'var(--text-main)'
                  }}
                >
                  <Heart size={16} fill={interestedEvents.has(selectedEvent.id) ? '#FFFFFF' : 'none'} />
                </button>
              </div>
            </div>

            <div className="custom-scroll" style={{ padding: '20px 20px 30px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--pink)', textTransform: 'uppercase' }}>
                    {selectedEvent.category} • {selectedEvent.distance}
                  </span>
                  
                  {/* Dynamic U'R Score display */}
                  <span style={{ marginLeft: 'auto', background: 'var(--yellow)', fontSize: '10px', fontWeight: '800', padding: '3px 6px', borderRadius: '6px' }}>
                    🔥 Score: {selectedEvent.urScore}/10
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '6px' }}>{selectedEvent.title}</h3>
              </div>

              {/* Security info for private event */}
              {selectedEvent.privacyLevel === 'Private' ? (
                <div style={{ background: '#FFF7ED', padding: '12px', borderRadius: '12px', border: '1px solid rgba(249,115,22,0.15)', fontSize: '11.5px', color: '#C2410C', textAlign: 'left' }}>
                  🔒 **Private House Party Privacy Rule:** The exact street coordinates are hidden for safety. Click 'Request to Join' below. Once the host Siddharth approves your profile, the address details will unlock.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="clay-card" style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '11px', background: '#F9FFFF' }}>
                    <span style={{ color: 'var(--text-sub)', fontSize: '9px' }}>DATE & TIME</span>
                    <div style={{ fontWeight: '700' }}>{selectedEvent.date}</div>
                    <div>{selectedEvent.time}</div>
                  </div>
                  <div className="clay-card" style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '11px', background: '#F9FFFF' }}>
                    <span style={{ color: 'var(--text-sub)', fontSize: '9px' }}>LOCATION</span>
                    <div style={{ fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedEvent.location.split(',')[0]}</div>
                    <div style={{ fontSize: '10px', opacity: 0.6 }}>{selectedEvent.location.split(',')[1]}</div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800' }}>About the Event</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: '1.5', marginTop: '4px' }}>
                  {selectedEvent.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', background: '#F8F9FA', padding: '8px 12px', borderRadius: '10px' }}>
                <span>Host: <b>{selectedEvent.organizer}</b></span>
                <span style={{ color: 'var(--deep-teal)', fontWeight: '700' }}>🟢 {selectedEvent.verificationStatus}</span>
              </div>

              {/* CTA Booking Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-sub)' }}>ENTRY FEE</span>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--deep-teal)' }}>{selectedEvent.price}</span>
                </div>

                {selectedEvent.privacyLevel === 'Private' ? (
                  joinedPrivateEvents.has(selectedEvent.id) ? (
                    <button className="clay-btn" style={{ backgroundColor: 'var(--soft-sky)', cursor: 'default' }}>
                      Request Sent ⏳
                    </button>
                  ) : (
                    <button 
                      onClick={() => requestJoinPrivateEvent(selectedEvent.id)}
                      className="clay-btn clay-btn-purple" 
                      style={{ padding: '12px 20px', borderRadius: '14px' }}
                    >
                      Request to Join
                    </button>
                  )
                ) : (
                  <button 
                    onClick={() => {
                      alert("Tickets generated successfully! Show QR code in profile at entry.");
                      setSelectedEvent(null);
                    }}
                    className="clay-btn clay-btn-primary" 
                    style={{ padding: '12px 24px', borderRadius: '14px' }}
                  >
                    Register / Tickets
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Housing Details Modal */}
      {selectedListing && (
        <div className="modal-overlay" onClick={() => setSelectedListing(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '180px', width: '100%' }}>
              <img src={selectedListing.image} alt={selectedListing.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={() => setSelectedListing(null)}
                className="clay-btn" 
                style={{ position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}
              >
                ✕
              </button>
              
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <button 
                  onClick={() => toggleSaveListing(selectedListing.id)}
                  className="clay-btn" 
                  style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '50%', 
                    padding: 0,
                    backgroundColor: savedListings.has(selectedListing.id) ? 'var(--pink)' : '#FFFFFF',
                    color: savedListings.has(selectedListing.id) ? '#FFFFFF' : 'var(--text-main)'
                  }}
                >
                  <Heart size={16} fill={savedListings.has(selectedListing.id) ? '#FFFFFF' : 'none'} />
                </button>
              </div>
            </div>

            <div className="custom-scroll" style={{ padding: '20px 20px 30px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>
                  {selectedListing.type} • {selectedListing.distance}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px' }}>{selectedListing.title}</h3>
              </div>

              {/* Features details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { label: 'ROOMS', val: `${selectedListing.bedrooms} Bed` },
                  { label: 'BATHROOMS', val: `${selectedListing.bathrooms} Bath` },
                  { label: 'FURNISHING', val: selectedListing.furnished }
                ].map((f, idx) => (
                  <div key={idx} className="clay-card" style={{ padding: '8px', borderRadius: '12px', fontSize: '10px', background: '#F9FFFF', textAlign: 'center' }}>
                    <div style={{ opacity: 0.5 }}>{f.label}</div>
                    <div style={{ fontWeight: '800', marginTop: '2px' }}>{f.val}</div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800' }}>Description</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: '1.5', marginTop: '4px' }}>
                  {selectedListing.description}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', background: '#F8F9FA', padding: '8px 12px', borderRadius: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Shield size={13} color="var(--green)" />
                  Owner: <b>{selectedListing.verificationStatus}</b>
                </span>
                <span style={{ color: selectedListing.petsAllowed ? 'var(--deep-teal)' : '#D97706', fontWeight: '700' }}>
                  {selectedListing.petsAllowed ? '🐾 Pets Ok' : '🚫 No Pets'}
                </span>
              </div>

              {/* Contact / Chat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '9px', color: 'var(--text-sub)' }}>MONTHLY RENT</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--deep-teal)' }}>₹{selectedListing.rent}</span>
                </div>

                <a 
                  href={`tel:${selectedListing.contact}`}
                  className="clay-btn clay-btn-primary" 
                  style={{ padding: '12px 24px', borderRadius: '14px', textDecoration: 'none' }}
                >
                  Contact Owner
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
