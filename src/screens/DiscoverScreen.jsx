import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Heart, Share2, Map, List, Check } from 'lucide-react';
import { eventService } from '../services/eventService';

export default function DiscoverScreen({ userProfile }) {
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [interestedEvents, setInterestedEvents] = useState(new Set());
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  const categories = ['All', 'Comedy', 'Music', 'Workshops', 'Food', 'Sports', 'Social'];

  useEffect(() => {
    async function loadData() {
      const evts = await eventService.getEvents(selectedCategory, searchQuery);
      setEvents(evts);
      const feat = await eventService.getFeaturedEvent();
      setFeaturedEvent(feat);
    }
    loadData();
  }, [selectedCategory, searchQuery]);

  const toggleInterest = (id) => {
    const updated = new Set(interestedEvents);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setInterestedEvents(updated);
  };

  const registerEvent = (id) => {
    const updated = new Set(registeredEvents);
    updated.add(id);
    setRegisteredEvents(updated);
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '90px' }}>
      
      {/* Title */}
      <div style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Discover Around You ✨</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Something exciting is always happening nearby.</p>
      </div>

      {/* Search Input */}
      <div className="clay-input-container">
        <Search size={18} color="var(--deep-teal)" />
        <input 
          type="text" 
          className="clay-input" 
          placeholder="Search events, places, activities..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Horizontal Pills */}
      <div 
        className="custom-scroll" 
        style={{ 
          display: 'flex', 
          gap: '10px', 
          overflowX: 'auto', 
          padding: '4px 0',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
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

      {/* View Mode Toggle (Map / List) */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="clay-btn"
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '3px 3px 6px rgba(8, 127, 140, 0.06)'
          }}
        >
          {viewMode === 'list' ? (
            <>
              <Map size={14} color="var(--deep-teal)" />
              <span>Map View</span>
            </>
          ) : (
            <>
              <List size={14} color="var(--deep-teal)" />
              <span>List View</span>
            </>
          )}
        </button>
      </div>

      {/* Main Content Areas */}
      {viewMode === 'list' ? (
        <>
          {/* Featured Event Card */}
          {featuredEvent && !searchQuery && selectedCategory === 'All' && (
            <div 
              className="clay-card clay-card-interactive" 
              onClick={() => setSelectedEvent(featuredEvent)}
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                borderRadius: '28px', 
                border: '1px solid rgba(255, 143, 207, 0.2)',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                <img 
                  src={featuredEvent.image} 
                  alt={featuredEvent.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span 
                  style={{ 
                    position: 'absolute', 
                    top: '12px', 
                    left: '12px', 
                    backgroundColor: 'var(--pink)', 
                    color: '#FFFFFF', 
                    padding: '4px 10px', 
                    borderRadius: '10px', 
                    fontSize: '10px', 
                    fontWeight: '700',
                    fontFamily: 'var(--font-headings)'
                  }}
                >
                  FEATURED EVENT
                </span>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--pink)', textTransform: 'uppercase' }}>
                  {featuredEvent.category}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                  {featuredEvent.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>{featuredEvent.date}</span>
                  </div>
                  <span>{featuredEvent.distance}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontWeight: '800', fontSize: '15px', color: 'var(--deep-teal)' }}>
                    {featuredEvent.price}
                  </span>
                  <button className="clay-btn clay-btn-primary" style={{ padding: '8px 14px', borderRadius: '12px', fontSize: '12px' }}>
                    View Event
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Regular Events List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '15px', textAlign: 'left', marginTop: '10px' }}>
              {selectedCategory === 'All' ? 'Upcoming Events' : `${selectedCategory} Events`}
            </h4>
            
            {events.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>No events found for this filter.</p>
            ) : (
              events.map((evt) => (
                <div 
                  key={evt.id} 
                  className="clay-card clay-card-interactive" 
                  onClick={() => setSelectedEvent(evt)}
                  style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '20px', cursor: 'pointer', textAlign: 'left' }}
                >
                  <img 
                    src={evt.image} 
                    alt={evt.title} 
                    style={{ width: '80px', height: '80px', borderRadius: '14px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: '700', color: evt.featured ? 'var(--pink)' : 'var(--deep-teal)', textTransform: 'uppercase' }}>
                        {evt.category}
                      </span>
                      <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {evt.title}
                      </h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-sub)' }}>
                      <span>{evt.date.split(',')[0]}</span>
                      <span>{evt.distance}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Map Mockup View */
        <div className="clay-card" style={{ padding: '0', overflow: 'hidden', height: '360px', position: 'relative', background: '#F0FDFD', display: 'flex', flexDirection: 'column', border: '1px solid rgba(8, 127, 140, 0.1)' }}>
          {/* Simulated Map Canvas */}
          <div style={{ flex: 1, position: 'relative', background: 'radial-gradient(circle, #E1F8F9 10%, #D4F7F7 70%, #C4ECEC 100%)', overflow: 'hidden' }}>
            
            {/* Map Roads & Blocks Overlay Grid (Styled like clay) */}
            <div style={{ position: 'absolute', width: '150%', height: '150%', border: '4px solid rgba(255,255,255,0.4)', borderRadius: '50%', top: '-25%', left: '-25%', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '100%', height: '40px', backgroundColor: 'rgba(255,255,255,0.3)', top: '40%', transform: 'rotate(-15deg)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '40px', height: '100%', backgroundColor: 'rgba(255,255,255,0.3)', left: '30%', transform: 'rotate(10deg)', pointerEvents: 'none' }} />

            {/* Central Resident Pin (Sunshine Residency) */}
            <div 
              style={{ 
                position: 'absolute', 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)', 
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--purple)', border: '3px solid #FFFFFF', boxShadow: '0 4px 8px rgba(155, 123, 255, 0.4)' }} />
              <span style={{ fontSize: '9px', fontWeight: '800', background: '#FFFFFF', padding: '2px 4px', borderRadius: '4px', marginTop: '2px', boxShadow: '1px 2px 4px rgba(0,0,0,0.1)' }}>Sunshine (You)</span>
            </div>

            {/* Event Pins */}
            {events.map((evt) => (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="clay-card-interactive"
                style={{
                  position: 'absolute',
                  left: `${evt.coordinates?.x || 30}%`,
                  top: `${evt.coordinates?.y || 40}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 5
                }}
              >
                <div 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: evt.featured ? 'var(--pink)' : 'var(--primary-cyan)', 
                    border: '2px solid #FFFFFF', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 6px 12px rgba(8, 127, 140, 0.2)'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>
                    {evt.category === 'Comedy' ? '🎤' : evt.category === 'Music' ? '🎵' : evt.category === 'Workshops' ? '🎨' : evt.category === 'Food' ? '🍔' : '🏃'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Map Footer Bar */}
          <div style={{ padding: '10px 14px', background: '#FFFFFF', fontSize: '11px', color: 'var(--text-sub)', textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            📍 Displaying <b>{events.length} event locations</b> within 5 km of your society.
          </div>
        </div>
      )}

      {/* Event Details Overlay Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
            
            {/* Header Image with Buttons */}
            <div style={{ position: 'relative', height: '200px', width: '100%' }}>
              <img 
                src={selectedEvent.image} 
                alt={selectedEvent.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="clay-btn" 
                style={{ position: 'absolute', top: '16px', left: '16px', width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}
              >
                ✕
              </button>
              
              <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                {/* Interest heart button */}
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
                {/* Share button */}
                <button 
                  className="clay-btn" 
                  style={{ width: '36px', height: '36px', borderRadius: '50%', padding: 0 }}
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Event Description Body */}
            <div className="custom-scroll" style={{ padding: '20px 24px 30px 24px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--deep-teal)', textTransform: 'uppercase' }}>
                  {selectedEvent.category} • {selectedEvent.distance}
                </span>
                <h3 style={{ fontSize: '20px', fontWeight: '800', marginTop: '4px', lineHeight: '1.3' }}>
                  {selectedEvent.title}
                </h3>
              </div>

              {/* Date/Location Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="clay-card" style={{ padding: '10px 14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', background: '#F9FFFF' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>DATE & TIME</span>
                  <span style={{ fontSize: '11px', fontWeight: '700' }}>{selectedEvent.date}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{selectedEvent.time}</span>
                </div>
                <div className="clay-card" style={{ padding: '10px 14px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2px', background: '#F9FFFF' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>VENUE</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedEvent.location.split(',')[0]}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{selectedEvent.location.split(',').slice(1).join(',')}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>About the Event</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: '1.6' }}>
                  {selectedEvent.description}
                </p>
              </div>

              {/* Organizer & Seats info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', background: '#F8F9FA', padding: '10px 14px', borderRadius: '14px' }}>
                <span>Host: <b>{selectedEvent.organizer}</b></span>
                <span style={{ color: 'red', fontWeight: '600' }}>Only {selectedEvent.availableSeats} seats left!</span>
              </div>

              {/* Community Integration: "People from your community are going" */}
              {selectedEvent.communityAttendees && selectedEvent.communityAttendees.length > 0 && (
                <div className="clay-card" style={{ padding: '14px', borderRadius: '20px', background: '#FFF0F5', border: '1px solid rgba(255, 143, 207, 0.1)' }}>
                  <h4 style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)', marginBottom: '8px' }}>
                    <span>👥 People from your community are going</span>
                  </h4>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
                    {selectedEvent.communityAttendees.map((person, index) => (
                      <div 
                        key={index}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          background: '#FFFFFF', 
                          padding: '6px 10px', 
                          borderRadius: '12px', 
                          fontSize: '11px',
                          boxShadow: '1px 2px 4px rgba(0,0,0,0.03)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{person.avatar}</span>
                        <div>
                          <div style={{ fontWeight: '700' }}>{person.name}</div>
                          <div style={{ fontSize: '9px', opacity: 0.6 }}>Flat {person.flat}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom booking row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>TICKET PRICE</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--deep-teal)' }}>{selectedEvent.price}</span>
                </div>
                
                {registeredEvents.has(selectedEvent.id) ? (
                  <button 
                    className="clay-btn" 
                    style={{ backgroundColor: 'var(--green)', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'default' }}
                  >
                    <Check size={16} />
                    Registered!
                  </button>
                ) : (
                  <button 
                    onClick={() => registerEvent(selectedEvent.id)}
                    className="clay-btn clay-btn-primary" 
                    style={{ padding: '14px 28px', borderRadius: '16px' }}
                  >
                    Register Now
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
