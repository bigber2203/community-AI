import React, { useState, useEffect } from 'react';
import { ShieldAlert, Check, Star, Phone, MessageSquare, Calendar, Clock, Wrench } from 'lucide-react';
import { serviceProviderService } from '../services/serviceProviderService';

export default function ServicesScreen({ userProfile, filterFromAI, onBookingCreated }) {
  const [providers, setProviders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-08-16');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingSuccessModal, setBookingSuccessModal] = useState(false);

  const categories = [
    { label: 'All', icon: '⚡' },
    { label: 'Electrician', icon: '🔌' },
    { label: 'Plumber', icon: '🚰' },
    { label: 'Cleaning', icon: '🧹' },
    { label: 'Laundry', icon: '👕' },
    { label: 'Car Wash', icon: '🚗' },
    { label: 'Repair', icon: '🔧' },
    { label: 'Pet Care', icon: '🐶' },
    { label: 'Moving Help', icon: '📦' }
  ];

  // If redirected from AI assistant with a filter
  useEffect(() => {
    if (filterFromAI) {
      setSelectedCategory(filterFromAI);
    }
  }, [filterFromAI]);

  useEffect(() => {
    async function loadProviders() {
      const type = selectedCategory === 'All' ? 'All' : selectedCategory;
      const data = await serviceProviderService.getProviders(type);
      setProviders(data);
    }
    loadProviders();
  }, [selectedCategory]);

  const handleBookNow = (prov) => {
    setSelectedProvider(prov);
  };

  const submitBooking = async () => {
    if (!selectedProvider) return;
    try {
      const newBkg = await serviceProviderService.createBooking(
        selectedProvider.id,
        bookingDate,
        bookingTime
      );
      onBookingCreated(newBkg);
      setSelectedProvider(null);
      setBookingSuccessModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '90px' }}>
      
      {/* Title */}
      <div style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Need Something Fixed? 🔧</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Trusted local help, just a few taps away.</p>
      </div>

      {/* Grid of Categories (Horizontally scrollable or grid. Let's make a grid for categorisation) */}
      <div>
        <h4 style={{ fontSize: '14px', marginBottom: '10px', textAlign: 'left' }}>Categories</h4>
        <div 
          className="custom-scroll"
          style={{ 
            display: 'flex', 
            gap: '10px', 
            overflowX: 'auto', 
            padding: '6px 2px',
            scrollbarWidth: 'none'
          }}
        >
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat.label)}
              className="clay-card clay-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 14px',
                borderRadius: '18px',
                gap: '6px',
                backgroundColor: selectedCategory === cat.label ? 'var(--primary-cyan)' : '#FFFFFF',
                border: 'none',
                minWidth: '96px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <span style={{ fontSize: '24px' }}>{cat.icon}</span>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)' }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Providers list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
        <h4 style={{ fontSize: '15px', textAlign: 'left' }}>
          {selectedCategory === 'All' ? 'Verified Providers nearby' : `Available ${selectedCategory}s`}
        </h4>

        {providers.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>No providers found in this category.</p>
        ) : (
          providers.map((prov) => (
            <div key={prov.id} className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <img 
                  src={prov.avatar} 
                  alt={prov.name} 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #FFFFFF', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
                />
                
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{prov.name}</h4>
                    {prov.verified && (
                      <span 
                        style={{ 
                          backgroundColor: 'var(--soft-sky)', 
                          color: 'var(--deep-teal)', 
                          fontSize: '8px', 
                          fontWeight: '800', 
                          padding: '2px 6px', 
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <Check size={8} strokeWidth={4} />
                        VERIFIED
                      </span>
                    )}
                  </div>
                  
                  <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: '600' }}>
                    {prov.service} • {prov.experience}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Star size={12} color="#FBBF24" fill="#FBBF24" />
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{prov.rating}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>({prov.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Dist and Price info row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', background: '#F9FFFF', padding: '8px 12px', borderRadius: '10px', color: 'var(--text-main)' }}>
                <span>📍 {prov.distance}</span>
                <span>💵 {prov.rate.split(',')[0]}</span>
                <span style={{ color: prov.availability.includes('Available') ? 'var(--deep-teal)' : '#D97706', fontWeight: '600' }}>
                  {prov.availability}
                </span>
              </div>

              {/* Call-to-action buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <a 
                  href={`tel:${prov.phone}`}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '10px', fontSize: '13px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                >
                  <Phone size={14} />
                  Call
                </a>
                <button 
                  onClick={() => handleBookNow(prov)}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '10px', fontSize: '13px', borderRadius: '12px' }}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Form Sheet (Modal) */}
      {selectedProvider && (
        <div className="modal-overlay" onClick={() => setSelectedProvider(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', textAlign: 'center' }}>📅 Schedule Booking</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', marginTop: '-10px' }}>
              Booking <b>{selectedProvider.name}</b> ({selectedProvider.service})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              
              {/* Date Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Select Date</label>
                <div className="clay-input-container">
                  <Calendar size={16} color="var(--deep-teal)" />
                  <input 
                    type="date" 
                    className="clay-input" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Time Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Preferred Time Slot</label>
                <div className="clay-input-container">
                  <Clock size={16} color="var(--deep-teal)" />
                  <select 
                    className="clay-input" 
                    style={{ background: 'none', border: 'none', outline: 'none' }}
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="09:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="04:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Fee Notice */}
              <div style={{ fontSize: '12px', background: '#FFFDF6', padding: '10px', borderRadius: '10px', color: '#856404', border: '1px solid rgba(255, 214, 107, 0.3)' }}>
                ℹ️ <b>Rate Policy:</b> {selectedProvider.rate}. Payment can be made directly to the provider in cash or UPI after service completion.
              </div>

              {/* Confirm / Cancel Actions */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={() => setSelectedProvider(null)}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '14px', borderRadius: '14px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitBooking}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '14px', borderRadius: '14px' }}
                >
                  Confirm Booking
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation Modal */}
      {bookingSuccessModal && (
        <div className="modal-overlay" onClick={() => setBookingSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', alignItems: 'center', padding: '36px 24px' }}>
            <div 
              className="clay-card" 
              style={{ 
                width: '70px', 
                height: '70px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--green)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 6px 12px rgba(110, 231, 183, 0.4), inset 3px 3px 6px rgba(255,255,255,0.4)',
                border: 'none',
                marginBottom: '14px'
              }}
            >
              <Check size={36} color="var(--text-main)" strokeWidth={3} />
            </div>
            
            <h3 style={{ fontSize: '20px' }}>Booking Confirmed! 🎉</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: '1.5' }}>
              Your service appointment has been scheduled. The provider has accepted the request and will call you shortly to coordinate.
            </p>

            <button 
              onClick={() => setBookingSuccessModal(false)}
              className="clay-btn clay-btn-primary" 
              style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '14px' }}
            >
              Great, thank you!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
