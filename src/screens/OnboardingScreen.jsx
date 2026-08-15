import React, { useState } from 'react';
import { ChevronRight, Sparkles, Compass, MapPin, Globe, Check } from 'lucide-react';

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Bigyat',
    community: 'Zoo Road, Guwahati', // Used as location in main app
    apartment: 'B-304',
    language: 'English',
    interests: []
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const toggleInterest = (interest) => {
    const current = [...formData.interests];
    const index = current.indexOf(interest);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(interest);
    }
    setFormData({ ...formData, interests: current });
  };

  const cities = [
    'Zoo Road, Guwahati',
    'Christian Basti, Guwahati',
    'Beltola, Guwahati',
    'Jalukbari, Guwahati',
    'Koramangala, Bengaluru',
    'Hauz Khas, New Delhi',
    'Bandra, Mumbai'
  ];

  const interestList = [
    { label: 'Music', icon: '🎵' },
    { label: 'Parties', icon: '🎉' },
    { label: 'Food', icon: '🍔' },
    { label: 'Culture', icon: '🪔' },
    { label: 'Sports', icon: '🏏' },
    { label: 'Art', icon: '🎨' },
    { label: 'Gaming', icon: '🎮' },
    { label: 'Nature', icon: '🌿' },
    { label: 'Business', icon: '💼' },
    { label: 'Housing', icon: '🏠' }
  ];

  return (
    <div className="screen-content" style={{ justifyContent: 'space-between', height: '100%', paddingBottom: '30px' }}>
      
      {/* Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              style={{
                width: s === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: s === step ? 'var(--primary-cyan)' : 'var(--soft-sky)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
        <button 
          onClick={() => onComplete(formData)} 
          style={{ background: 'none', border: 'none', fontFamily: 'var(--font-headings)', fontWeight: '600', color: 'var(--deep-teal)', fontSize: '14px', cursor: 'pointer' }}
        >
          Skip
        </button>
      </div>

      {/* Slide body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '30px 0' }}>
        {step === 1 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="clay-card" style={{ width: '110px', height: '110px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', backgroundColor: '#E9FCFC' }}>
              <Compass size={52} color="var(--primary-cyan)" style={{ filter: 'drop-shadow(2px 4px 6px rgba(22, 217, 227, 0.3))' }} />
            </div>
            <h1 style={{ fontSize: '30px', lineHeight: '1.2' }}>Know What's Happening<br /><span style={{ color: 'var(--deep-teal)' }}>Around You</span> 🗺️</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: '1.6' }}>
              Welcome to U'R com. Discover music events, local festivals, secret house parties, and available rooms/roommates near your location.
            </p>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>Select Your Location 📍</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Your Name</label>
              <div className="clay-input-container">
                <input 
                  type="text" 
                  className="clay-input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Preferred Location / Suburb</label>
              <div className="clay-input-container">
                <MapPin size={16} color="var(--deep-teal)" />
                <select 
                  className="clay-input" 
                  style={{ border: 'none', background: 'none' }}
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                >
                  {cities.map((city, idx) => (
                    <option key={idx} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Apartment (Optional)</label>
              <div className="clay-input-container">
                <input 
                  type="text" 
                  className="clay-input" 
                  placeholder="e.g. B-304"
                  value={formData.apartment} 
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '24px', textAlign: 'center' }}>Choose Your Interests 🎨</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', marginBottom: '8px' }}>We will personalize your U'R Score and AI recommendations.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {interestList.map((interest, idx) => {
                const selected = formData.interests.includes(interest.label);
                return (
                  <button
                    key={idx}
                    onClick={() => toggleInterest(interest.label)}
                    className="clay-card clay-card-interactive"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px',
                      borderRadius: '16px',
                      backgroundColor: selected ? 'var(--primary-cyan)' : '#FFFFFF',
                      border: selected ? '2px solid var(--deep-teal)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{interest.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>{interest.label}</span>
                    {selected && <Check size={12} color="var(--deep-teal)" style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="clay-card" style={{ width: '110px', height: '110px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '36px', backgroundColor: '#FFFDF0', border: '1px solid rgba(255, 214, 107, 0.2)' }}>
              <Sparkles size={52} color="var(--yellow)" style={{ filter: 'drop-shadow(2px 4px 6px rgba(255, 214, 107, 0.3))' }} />
            </div>
            <h1 style={{ fontSize: '30px' }}>Ready to Explore? 🚀</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: '1.6' }}>
              Your profile is set up. Let's see what is trending and happening around you in real time!
            </p>
            <div style={{ fontSize: '11px', background: '#E9FCFC', padding: '8px 12px', borderRadius: '10px', color: 'var(--deep-teal)', width: 'fit-content', margin: '0 auto' }}>
              🗣️ Language preference: <b>{formData.language}</b>
            </div>
          </div>
        )}
      </div>

      {/* Button controls */}
      <button 
        onClick={handleNext} 
        className="clay-btn clay-btn-primary" 
        style={{ width: '100%', height: '54px', borderRadius: '16px' }}
      >
        <span>{step === 4 ? 'Let\'s Go!' : 'Continue'}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
