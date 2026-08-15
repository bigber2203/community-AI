import React, { useState, useEffect } from 'react';
import { Star, MapPin, Check, Search, Compass, Shield, ShieldAlert, Heart, Share2, Phone } from 'lucide-react';
import URMap from '../components/URMap';
import { eventService } from '../services/eventService';
import { listingService } from '../services/listingService';
import { rankingService } from '../services/rankingService';
import { mapService } from '../services/mapService';

export default function MapScreen({ userProfile }) {
  const [allEvents, setAllEvents] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMarker, setSelectedMarker] = useState(null); // { type: 'event' | 'housing', data: ... }
  const [mapSearch, setMapSearch] = useState('');
  
  // Geolocation & Pan States
  const [mapCenter, setMapCenter] = useState([91.7362, 26.1445]); // Guwahati default center
  const [mapZoom, setMapZoom] = useState(13);
  const [currentBounds, setCurrentBounds] = useState(null);
  const [showSearchThisAreaBtn, setShowSearchThisAreaBtn] = useState(false);

  const filterChips = [
    'All', 'Events', 'Tonight', 'Parties', 'Festivals', 'Housing', 'Rooms', 'Roommates', 'Private', 'Free'
  ];

  // Load Initial Data
  useEffect(() => {
    async function loadData() {
      const evts = await eventService.getEvents();
      const rankedEvts = rankingService.rankItems(evts, userProfile.interests);
      setAllEvents(rankedEvts);
      setEvents(rankedEvts);

      const lists = await listingService.getListings();
      const rankedLists = rankingService.rankItems(lists, userProfile.interests);
      setAllListings(rankedLists);
      setListings(rankedLists);
    }
    loadData();
  }, [userProfile.interests]);

  // Handle Location Search
  const handleLocationSearch = () => {
    if (!mapSearch.trim()) return;
    const match = mapService.searchLocation(mapSearch);
    if (match) {
      setMapCenter(match.center);
      setMapZoom(match.zoom);
      setShowSearchThisAreaBtn(false);
      setSelectedMarker(null);
    } else {
      alert(`Location "${mapSearch}" not found in local mock search. Try "Beltola" or "Christian Basti".`);
    }
  };

  // Center on current user location
  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setMapCenter([longitude, latitude]);
          setMapZoom(15);
          setSelectedMarker(null);
          setShowSearchThisAreaBtn(false);
        },
        (error) => {
          console.warn("Geolocation denied, using fallback city center.", error);
          setMapCenter([91.7362, 26.1445]);
          setMapZoom(13);
          alert("Geolocation permission denied. Center coordinates set to Guwahati.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Bounds Change listener callback
  const handleBoundsChange = (bounds) => {
    setCurrentBounds(bounds);
    // Show "Search This Area" button if bounds changed from original load
    setShowSearchThisAreaBtn(true);
  };

  // Filter listings inside current map viewport bounds
  const handleSearchThisArea = () => {
    if (!currentBounds) return;

    // Filter events
    const eventsInViewport = mapService.getItemsInBounds(currentBounds, allEvents);
    setEvents(eventsInViewport);

    // Filter listings
    const listingsInViewport = mapService.getItemsInBounds(currentBounds, allListings);
    setListings(listingsInViewport);

    setShowSearchThisAreaBtn(false);
    setSelectedMarker(null);
  };

  // Dynamic filter chips actions
  const getVisibleItems = () => {
    let showEvents = true;
    let showListings = true;

    if (activeFilter === 'Events' || activeFilter === 'Tonight' || activeFilter === 'Parties' || activeFilter === 'Festivals' || activeFilter === 'Private') {
      showListings = false;
    }
    if (activeFilter === 'Housing' || activeFilter === 'Rooms' || activeFilter === 'Roommates') {
      showEvents = false;
    }

    let filteredEvents = [...events];
    let filteredListings = [...listings];

    if (activeFilter === 'Tonight') {
      filteredEvents = filteredEvents.filter(e => e.date.toLowerCase() === 'tonight');
    } else if (activeFilter === 'Parties') {
      filteredEvents = filteredEvents.filter(e => e.category === 'Nightlife' || e.tags.includes('Party'));
    } else if (activeFilter === 'Festivals') {
      filteredEvents = filteredEvents.filter(e => e.category === 'Festivals');
    } else if (activeFilter === 'Private') {
      filteredEvents = filteredEvents.filter(e => e.privacyLevel === 'Private');
    } else if (activeFilter === 'Free') {
      filteredEvents = filteredEvents.filter(e => e.price.toLowerCase().includes('free'));
      filteredListings = filteredListings.filter(l => l.rent === 0);
    }

    if (activeFilter === 'Rooms') {
      filteredListings = filteredListings.filter(l => l.type === 'Room');
    } else if (activeFilter === 'Roommates') {
      filteredListings = filteredListings.filter(l => l.type === 'Roommate');
    } else if (activeFilter === 'Housing') {
      filteredListings = filteredListings.filter(l => l.type === 'Flat' || l.type === 'PG');
    }

    return {
      events: showEvents ? filteredEvents : [],
      listings: showListings ? filteredListings : []
    };
  };

  const { events: displayEvents, listings: displayListings } = getVisibleItems();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Search bar inside Map */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          right: '20px', 
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div className="clay-input-container" style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 8px 16px rgba(8,127,140,0.1)' }}>
          <Search size={16} color="var(--deep-teal)" />
          <input 
            type="text" 
            className="clay-input" 
            placeholder="Search area (e.g. Beltola, Christian Basti)..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
          />
          <button 
            onClick={handleLocationSearch}
            className="clay-btn clay-btn-primary" 
            style={{ width: '38px', height: '38px', borderRadius: '12px', padding: 0 }}
          >
            Go
          </button>
        </div>

        {/* Map Filters bar */}
        <div 
          className="custom-scroll" 
          style={{ 
            display: 'flex', 
            gap: '8px', 
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '2px 0'
          }}
        >
          {filterChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveFilter(chip);
                setSelectedMarker(null);
              }}
              className="clay-btn"
              style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                backgroundColor: activeFilter === chip ? 'var(--primary-cyan)' : '#FFFFFF',
                boxShadow: '2px 4px 8px rgba(8,127,140,0.06)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Search This Area button */}
      {showSearchThisAreaBtn && (
        <button
          onClick={handleSearchThisArea}
          className="clay-btn clay-btn-primary"
          style={{
            position: 'absolute',
            top: '114px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 40,
            padding: '8px 16px',
            fontSize: '12px',
            borderRadius: '14px',
            boxShadow: '0 8px 16px rgba(22, 217, 227, 0.25)'
          }}
        >
          🔍 Search This Area
        </button>
      )}

      {/* User Geolocation Recenter button */}
      <button 
        onClick={handleCurrentLocation}
        className="clay-btn" 
        style={{ 
          position: 'absolute', 
          right: '20px', 
          top: '114px', 
          zIndex: 40, 
          width: '38px', 
          height: '38px', 
          borderRadius: '10px', 
          padding: 0,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Compass size={18} color="var(--deep-teal)" />
      </button>

      {/* Real MapLibre Canvas Container */}
      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <URMap 
          events={displayEvents} 
          listings={displayListings} 
          center={mapCenter} 
          zoom={mapZoom} 
          onMarkerClick={(marker) => setSelectedMarker(marker)} 
          onBoundsChange={handleBoundsChange}
        />
      </div>

      {/* Map Interactive Bottom Sheet details */}
      {selectedMarker && (
        <div 
          className="clay-card"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '96px',
            left: '16px',
            right: '16px',
            zIndex: 100,
            padding: '16px',
            borderRadius: '24px',
            backgroundColor: '#FFFFFF',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'slideUp 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards'
          }}
        >
          {/* Header Close button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10px', fontWeight: '800', color: selectedMarker.type === 'event' ? 'var(--pink)' : 'var(--purple)', textTransform: 'uppercase' }}>
              {selectedMarker.type === 'event' ? `${selectedMarker.data.category} • ${selectedMarker.data.distance}` : `${selectedMarker.data.type} • ${selectedMarker.data.distance}`}
            </span>
            <button 
              onClick={() => setSelectedMarker(null)} 
              style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', color: 'var(--text-sub)' }}
            >
              ✕
            </button>
          </div>

          {selectedMarker.type === 'event' ? (
            /* Event Details bottom sheet */
            <>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img src={selectedMarker.data.image} alt={selectedMarker.data.title} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800' }}>{selectedMarker.data.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px' }}>
                    <Star size={11} color="#FBBF24" fill="#FBBF24" />
                    <span style={{ fontWeight: '700' }}>U'R Score: {selectedMarker.data.urScore}</span>
                    <span>• {selectedMarker.data.price}</span>
                  </div>
                </div>
              </div>

              {selectedMarker.data.privacyLevel === 'Private' ? (
                <div style={{ background: '#FFF7ED', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', color: '#C2410C', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    🔒 **Private Event Privacy:** Exact address coordinates are hidden. Request to join below to get access.
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: '11.5px', color: 'var(--text-sub)' }}>
                  📍 Address: <b>{selectedMarker.data.location.split(',')[0]}</b> • 🕙 {selectedMarker.data.time}
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button 
                  onClick={() => alert("Event added to saved lists!")}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '10px', fontSize: '12px', borderRadius: '12px' }}
                >
                  Save
                </button>
                <button 
                  onClick={() => {
                    alert(`Opening details for: ${selectedMarker.data.title}`);
                    setSelectedMarker(null);
                  }}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '10px', fontSize: '12px', borderRadius: '12px' }}
                >
                  View Details
                </button>
              </div>
            </>
          ) : (
            /* Housing details bottom sheet */
            <>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <img src={selectedMarker.data.image} alt={selectedMarker.data.title} style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800' }}>{selectedMarker.data.title}</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-sub)', marginTop: '2px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>🛌 {selectedMarker.data.bedrooms} Bed · 🚿 {selectedMarker.data.bathrooms} Bath</span>
                    <span style={{ fontWeight: '800', color: 'var(--deep-teal)' }}>₹{selectedMarker.data.rent}/mo</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a 
                  href={`tel:${selectedMarker.data.contact}`}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '10px', fontSize: '12px', borderRadius: '12px', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Phone size={12} style={{ marginRight: '4px' }} />
                  Call
                </a>
                <button 
                  onClick={() => {
                    alert(`Opening details for listing: ${selectedMarker.data.title}`);
                    setSelectedMarker(null);
                  }}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '10px', fontSize: '12px', borderRadius: '12px' }}
                >
                  View Property
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Slide up animation styles */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

    </div>
  );
}
