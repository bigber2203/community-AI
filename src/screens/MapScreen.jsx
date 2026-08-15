import React, { useState, useEffect } from 'react';
import { Star, MapPin, Check, Plus, Minus, Search, Shield } from 'lucide-react';
import { eventService } from '../services/eventService';
import { listingService } from '../services/listingService';
import { rankingService } from '../services/rankingService';

export default function MapScreen({ userProfile }) {
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [zoomLevel, setZoomLevel] = useState(14);
  const [selectedMarker, setSelectedMarker] = useState(null); // { type: 'event' | 'housing', data: ... }
  const [mapSearch, setMapSearch] = useState('');

  const filterChips = [
    'All', 'Events', 'Parties', 'Festivals', 'Housing', 'Rooms', 'Roommates', 'Private', 'Free'
  ];

  useEffect(() => {
    async function loadData() {
      const allEvts = await eventService.getEvents();
      const rankedEvts = rankingService.rankItems(allEvts, userProfile.interests);
      setEvents(rankedEvts);

      const allListings = await listingService.getListings();
      setListings(allListings);
    }
    loadData();
  }, [userProfile.interests]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(18, prev + 1));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(10, prev - 1));

  // Determine active markers to show based on filters
  const getVisibleMarkers = () => {
    let showEvents = true;
    let showListings = true;

    if (activeFilter === 'Events' || activeFilter === 'Parties' || activeFilter === 'Festivals' || activeFilter === 'Private') {
      showListings = false;
    }
    if (activeFilter === 'Housing' || activeFilter === 'Rooms' || activeFilter === 'Roommates') {
      showEvents = false;
    }

    let filteredEvents = [...events];
    let filteredListings = [...listings];

    if (activeFilter === 'Parties') {
      filteredEvents = filteredEvents.filter(e => e.category === 'Nightlife' || e.tags.includes('Party'));
    } else if (activeFilter === 'Festivals') {
      filteredEvents = filteredEvents.filter(e => e.category === 'Festivals');
    } else if (activeFilter === 'Private') {
      filteredEvents = filteredEvents.filter(e => e.privacyLevel === 'Private');
    } else if (activeFilter === 'Free') {
      filteredEvents = filteredEvents.filter(e => e.price.toLowerCase().includes('free'));
      filteredListings = filteredListings.filter(l => l.rent === 0); // No free listings but filters events
    }

    if (activeFilter === 'Rooms') {
      filteredListings = filteredListings.filter(l => l.type === 'Room');
    } else if (activeFilter === 'Roommates') {
      filteredListings = filteredListings.filter(l => l.type === 'Roommate');
    } else if (activeFilter === 'Housing') {
      filteredListings = filteredListings.filter(l => l.type === 'Flat' || l.type === 'PG');
    }

    if (mapSearch) {
      const q = mapSearch.toLowerCase();
      filteredEvents = filteredEvents.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
      filteredListings = filteredListings.filter(l => l.title.toLowerCase().includes(q) || l.locationName.toLowerCase().includes(q));
    }

    return {
      events: showEvents ? filteredEvents : [],
      listings: showListings ? filteredListings : []
    };
  };

  const { events: visibleEvents, listings: visibleListings } = getVisibleMarkers();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
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
            placeholder="Search area or category..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
          />
        </div>

        {/* Filter Bar Chips */}
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

      {/* Map Zoom Controls */}
      <div 
        style={{ 
          position: 'absolute', 
          right: '20px', 
          top: '120px', 
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <button 
          onClick={handleZoomIn}
          className="clay-btn" 
          style={{ width: '38px', height: '38px', borderRadius: '10px', padding: 0 }}
        >
          <Plus size={16} />
        </button>
        <button 
          onClick={handleZoomOut}
          className="clay-btn" 
          style={{ width: '38px', height: '38px', borderRadius: '10px', padding: 0 }}
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Interactive Map Mock Canvas */}
      <div 
        onClick={() => setSelectedMarker(null)}
        style={{ 
          width: '100%', 
          height: '100%', 
          background: 'radial-gradient(circle, #D5F7F7 20%, #C3EBEB 70%, #B2DFDF 100%)', 
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Mock Road Grids */}
        <div style={{ position: 'absolute', width: '200%', height: '8px', backgroundColor: 'rgba(255,255,255,0.4)', top: '40%', left: '-50%', transform: 'rotate(-12deg)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '200%', height: '8px', backgroundColor: 'rgba(255,255,255,0.4)', top: '65%', left: '-50%', transform: 'rotate(22deg)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '8px', height: '200%', backgroundColor: 'rgba(255,255,255,0.4)', left: '35%', top: '-50%', transform: 'rotate(5deg)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '8px', height: '200%', backgroundColor: 'rgba(255,255,255,0.4)', left: '72%', top: '-50%', transform: 'rotate(-25deg)', pointerEvents: 'none' }} />

        {/* Current Location marker (Blue pulsing dot) */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '48%', 
            top: '52%', 
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(155, 123, 255, 0.25)', animation: 'orbGlowPulse 1.5s infinite alternate', position: 'absolute' }} />
          <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: 'var(--purple)', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
        </div>

        {/* Event Marker Pins */}
        {visibleEvents.map((evt) => (
          <button
            key={evt.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMarker({ type: 'event', data: evt });
            }}
            className="clay-card-interactive"
            style={{
              position: 'absolute',
              left: `${evt.coordinates?.x || 50}%`,
              top: `${evt.coordinates?.y || 50}%`,
              transform: `translate(-50%, -50%) scale(${zoomLevel / 14})`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 15
            }}
          >
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: evt.featured ? 'var(--pink)' : 'var(--primary-cyan)',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 12px rgba(8, 127, 140, 0.2)'
              }}
            >
              <span style={{ fontSize: '15px' }}>
                {evt.category === 'Nightlife' ? '🎧' : evt.category === 'Festivals' ? '🪔' : evt.category === 'Entertainment' ? '🎭' : '🎉'}
              </span>
            </div>
          </button>
        ))}

        {/* Housing Marker Pins */}
        {visibleListings.map((list) => (
          <button
            key={list.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMarker({ type: 'housing', data: list });
            }}
            className="clay-card-interactive"
            style={{
              position: 'absolute',
              left: `${list.coordinates?.x || 50}%`,
              top: `${list.coordinates?.y || 50}%`,
              transform: `translate(-50%, -50%) scale(${zoomLevel / 14})`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 15
            }}
          >
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--yellow)',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 12px rgba(8, 127, 140, 0.2)'
              }}
            >
              <span style={{ fontSize: '15px' }}>
                {list.type === 'Flat' ? '🏢' : list.type === 'Roommate' ? '👥' : '🛏️'}
              </span>
            </div>
          </button>
        ))}

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
          {selectedMarker.type === 'event' ? (
            /* Event Details */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--pink)', textTransform: 'uppercase' }}>
                  {selectedMarker.data.category} • {selectedMarker.data.distance}
                </span>
                <span style={{ background: 'var(--yellow)', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <Star size={10} color="#FBBF24" fill="#FBBF24" />
                  {selectedMarker.data.neighbourScore}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{selectedMarker.data.title}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                🕙 {selectedMarker.data.time} • 💰 {selectedMarker.data.price}
              </p>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button 
                  onClick={() => alert(`Directions mapped to: ${selectedMarker.data.locationName || 'Venue'}`)}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '10px', fontSize: '12px', borderRadius: '12px' }}
                >
                  Directions
                </button>
                <button 
                  onClick={() => alert("Saved to profile interested list!")}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '10px', fontSize: '12px', borderRadius: '12px' }}
                >
                  View Details
                </button>
              </div>
            </>
          ) : (
            /* Housing details */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>
                  {selectedMarker.data.type} • {selectedMarker.data.distance}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '9px', fontWeight: '800', color: 'var(--green)' }}>
                  <Check size={12} strokeWidth={3} />
                  {selectedMarker.data.verificationStatus}
                </span>
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{selectedMarker.data.title}</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                🛌 {selectedMarker.data.bedrooms} Bed · 🚿 {selectedMarker.data.bathrooms} Bath • <b>₹{selectedMarker.data.rent}/mo</b>
              </p>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a 
                  href={`tel:${selectedMarker.data.contact}`}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '10px', fontSize: '12px', borderRadius: '12px', textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
                >
                  Call Owner
                </a>
                <button 
                  onClick={() => alert(`Details opened in profile: ${selectedMarker.data.title}`)}
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

    </div>
  );
}
