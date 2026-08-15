import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Heart, ShieldAlert, Star, Bell, ArrowRight, Flame } from 'lucide-react';
import { eventService } from '../services/eventService';
import { listingService } from '../services/listingService';
import { rankingService } from '../services/rankingService';

export default function HomeScreen({ userProfile, setTab, setAIPrefill, onQuickActionFilter }) {
  const [events, setEvents] = useState([]);
  const [listings, setListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [locationName, setLocationName] = useState(userProfile.community || 'Zoo Road, Guwahati');
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  useEffect(() => {
    async function loadData() {
      const allEvts = await eventService.getEvents();
      // Calculate scores dynamically based on user interests
      const rankedEvts = rankingService.rankItems(allEvts, userProfile.interests);
      setEvents(rankedEvts);

      const allListings = await listingService.getListings();
      setListings(allListings);
    }
    loadData();
  }, [userProfile.interests]);

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;
    setAIPrefill({ text: searchQuery, autoSend: true });
    setSearchQuery('');
    setTab('ai');
  };

  const handleLocationChange = (loc) => {
    setLocationName(loc);
    setShowLocationSelect(false);
  };

  // Filter listings by quick actions
  const handleQuickAction = (action) => {
    if (action === 'Events') {
      onQuickActionFilter({ category: 'All' });
      setTab('discover');
    } else if (action === 'Map') {
      setTab('map');
    } else if (action === 'Happening Tonight') {
      onQuickActionFilter({ tonightOnly: true });
      setTab('discover');
    } else if (action === 'Housing' || action === 'Roommate') {
      onQuickActionFilter({ type: action === 'Housing' ? 'Flat' : 'Roommate' });
      setTab('discover');
    } else if (action === 'Festivals') {
      onQuickActionFilter({ category: 'Festivals' });
      setTab('discover');
    } else if (action === 'Nightlife') {
      onQuickActionFilter({ category: 'Nightlife' });
      setTab('discover');
    } else if (action === 'Trending') {
      onQuickActionFilter({ trendingOnly: true });
      setTab('discover');
    }
  };

  return (
    <div className="screen-content">
      {/* Top Header Location Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', lineHeight: '1.2' }}>
            Good Evening, {userProfile.name} 👋
          </h2>
          {/* Location button */}
          <button
            onClick={() => setShowLocationSelect(true)}
            className="clay-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px',
              boxShadow: '2px 2px 6px rgba(8,127,140,0.04)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <MapPin size={12} color="var(--deep-teal)" />
            <span style={{ fontWeight: '700' }}>{locationName.split(',')[0]}</span>
          </button>
        </div>

        {/* Notifications */}
        <button 
          className="clay-btn" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0 }}
        >
          <Bell size={18} />
        </button>
      </div>

      {/* Main AI Search Input */}
      <div 
        className="clay-card" 
        style={{ 
          padding: '16px', 
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F5FFFF 100%)',
          border: isFocused ? '2px solid var(--primary-cyan)' : '1px solid rgba(22, 217, 227, 0.15)'
        }}
      >
        <div className="clay-input-container">
          <input 
            type="text" 
            className="clay-input" 
            placeholder="What should I do tonight?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
          />
          <button 
            onClick={handleSearchSubmit}
            className="clay-btn clay-btn-primary" 
            style={{ width: '38px', height: '38px', borderRadius: '12px', padding: 0 }}
          >
            <Search size={16} />
          </button>
        </div>
        
        {/* Animated Sound Wave on Focus */}
        {isFocused && (
          <div className="voice-waves" style={{ marginTop: '12px', height: '18px' }}>
            <div className="voice-wave-bar" style={{ height: '6px' }}></div>
            <div className="voice-wave-bar" style={{ height: '12px' }}></div>
            <div className="voice-wave-bar" style={{ height: '8px' }}></div>
            <div className="voice-wave-bar" style={{ height: '14px' }}></div>
            <div className="voice-wave-bar" style={{ height: '6px' }}></div>
          </div>
        )}
      </div>

      {/* Quick Action Grid */}
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { label: 'Events', icon: '🎉', action: 'Events', bg: '#EBFBFC' },
            { label: 'Map', icon: '🗺️', action: 'Map', bg: '#F5F3FF' },
            { label: 'Tonight', icon: '🔥', action: 'Happening Tonight', bg: '#FEF2F2' },
            { label: 'Housing', icon: '🏠', action: 'Housing', bg: '#FFFBEB' },
            { label: 'Roommates', icon: '👥', action: 'Roommate', bg: '#ECFDF5' },
            { label: 'Festivals', icon: '🪔', action: 'Festivals', bg: '#FFF0F5' },
            { label: 'Nightlife', icon: '🎧', action: 'Nightlife', bg: '#F0F9FF' },
            { label: 'Trending', icon: '✨', action: 'Trending', bg: '#FDF2F8' }
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(act.action)}
              className="clay-card clay-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 4px',
                borderRadius: '16px',
                gap: '4px',
                backgroundColor: act.bg,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '20px' }}>{act.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-main)', textAlign: 'center' }}>
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Happening Tonight Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>🔥 Happening Tonight</h3>
          <button 
            onClick={() => handleQuickAction('Happening Tonight')}
            style={{ border: 'none', background: 'none', color: 'var(--deep-teal)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            See All
            <ArrowRight size={12} />
          </button>
        </div>
        
        {/* Horizontal scroll slider */}
        <div 
          className="custom-scroll" 
          style={{ 
            display: 'flex', 
            gap: '14px', 
            overflowX: 'auto', 
            padding: '4px 2px',
            scrollbarWidth: 'none'
          }}
        >
          {events.filter(e => e.date === 'Tonight').map((evt) => (
            <div 
              key={evt.id} 
              onClick={() => {
                onQuickActionFilter({ openEventId: evt.id });
                setTab('discover');
              }}
              className="clay-card clay-card-interactive" 
              style={{ 
                width: '220px', 
                flexShrink: 0, 
                padding: 0, 
                overflow: 'hidden', 
                borderRadius: '24px', 
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <div style={{ height: '110px', width: '100%', position: 'relative' }}>
                <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {/* Score overlay */}
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    left: '8px', 
                    backgroundColor: 'rgba(255,255,255,0.9)', 
                    padding: '3px 6px', 
                    borderRadius: '8px', 
                    fontSize: '10px', 
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    boxShadow: '1px 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Star size={10} color="#FBBF24" fill="#FBBF24" />
                  <span>{evt.urScore}</span>
                </div>
              </div>
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>
                  {evt.category}
                </span>
                <h4 style={{ fontSize: '13px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {evt.title}
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-sub)' }}>
                  <span>📍 {evt.distance}</span>
                  <span>{evt.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Near You Leaderboard */}
      <div className="clay-card" style={{ padding: '16px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Flame size={16} color="red" fill="red" />
          Trending Near You
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {events.slice(0, 4).map((evt, index) => (
            <div 
              key={evt.id} 
              onClick={() => {
                onQuickActionFilter({ openEventId: evt.id });
                setTab('discover');
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '6px 4px', borderRadius: '8px' }}
            >
              <span style={{ fontSize: '16px', fontWeight: '800', width: '24px', color: index === 0 ? '#FBBF24' : index === 1 ? '#9CA3AF' : index === 2 ? '#B45309' : 'var(--text-sub)' }}>
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `4.`}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12.5px', fontWeight: '700' }}>{evt.title}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{evt.category} • {evt.distance}</div>
              </div>
              <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--deep-teal)' }}>
                ⭐ {evt.urScore}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Festivals & Culture */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', textAlign: 'left', marginBottom: '12px' }}>🪔 Festivals & Cultural Gigs</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {events.filter(e => e.category === 'Festivals' || e.tags.includes('Culture')).map(evt => (
            <div 
              key={evt.id}
              onClick={() => {
                onQuickActionFilter({ openEventId: evt.id });
                setTab('discover');
              }}
              className="clay-card clay-card-interactive" 
              style={{ display: 'flex', gap: '12px', padding: '12px', cursor: 'pointer', textAlign: 'left' }}
            >
              <img src={evt.image} alt={evt.title} style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--pink)', textTransform: 'uppercase' }}>
                    {evt.category}
                  </span>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '2px' }}>{evt.title}</h4>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-sub)' }}>
                  <span>{evt.date}</span>
                  <span style={{ color: 'var(--deep-teal)', fontWeight: '700' }}>⭐ {evt.urScore}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Housing & Roommates Preview */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>🏠 Nearby Housing & Roommates</h3>
          <button 
            onClick={() => handleQuickAction('Housing')}
            style={{ border: 'none', background: 'none', color: 'var(--deep-teal)', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            Explore
            <ArrowRight size={12} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {listings.slice(0, 2).map(list => (
            <div 
              key={list.id}
              onClick={() => {
                onQuickActionFilter({ openListingId: list.id });
                setTab('discover');
              }}
              className="clay-card clay-card-interactive" 
              style={{ padding: '10px', textAlign: 'left', cursor: 'pointer' }}
            >
              <img src={list.image} alt={list.title} style={{ width: '100%', height: '80px', borderRadius: '12px', objectFit: 'cover', marginBottom: '8px' }} />
              <span style={{ fontSize: '8px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>{list.type}</span>
              <h4 style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{list.title}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '11px' }}>
                <span style={{ fontWeight: '800', color: 'var(--deep-teal)' }}>₹{list.rent}/mo</span>
                <span style={{ fontSize: '9px', color: 'var(--text-sub)' }}>{list.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationSelect && (
        <div className="modal-overlay" onClick={() => setShowLocationSelect(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', textAlign: 'center' }}>📍 Select Your Area</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {[
                'Zoo Road, Guwahati',
                'Christian Basti, Guwahati',
                'Beltola, Guwahati',
                'Jalukbari, Guwahati',
                'Koramangala, Bengaluru',
                'Hauz Khas, New Delhi',
                'Bandra, Mumbai'
              ].map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleLocationChange(loc)}
                  className="clay-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    backgroundColor: locationName === loc ? 'var(--bg-light)' : '#FFFFFF',
                    border: locationName === loc ? '2px solid var(--primary-cyan)' : '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <MapPin size={14} color="var(--deep-teal)" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowLocationSelect(false)} className="clay-btn clay-btn-primary" style={{ marginTop: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
