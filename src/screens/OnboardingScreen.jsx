import React, { useState } from 'react';
import { ChevronRight, Sparkles, Mic, Home, MapPin, Globe } from 'lucide-react';

export default function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Bigyat',
    community: 'Sunshine Residency, Guwahati',
    apartment: 'B-304',
    language: 'English'
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleSkip = () => {
    onComplete(formData);
  };

  const communities = [
    'Sunshine Residency, Guwahati',
    'Greenwood Apartments, Kahilipara',
    'Exotica Greens, Zoo Road',
    'Palacio Heights, Khanapara'
  ];

  const languages = ['English', 'Hindi', 'Hinglish', 'Assamese'];

  return (
    <div className="screen-content" style={{ justifyContent: 'space-between', height: '100%', paddingBottom: '30px' }}>
      {/* Top Banner / Indicator */}
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
        {step < 4 && (
          <button 
            onClick={handleSkip} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontFamily: 'var(--font-headings)', 
              fontWeight: '600', 
              color: 'var(--deep-teal)', 
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Feature Slides */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', margin: '40px 0' }}>
        {step === 1 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="clay-card" style={{ width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '40px', backgroundColor: '#E9FCFC' }}>
              <Home size={56} color="var(--primary-cyan)" style={{ filter: 'drop-shadow(2px 4px 6px rgba(22, 217, 227, 0.3))' }} />
            </div>
            <h1 style={{ fontSize: '32px', lineHeight: '1.2' }}>Your Community,<br /><span style={{ color: 'var(--deep-teal)' }}>Smarter</span> 🏡</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.6' }}>
              Welcome to NeighbourAI. The friendly AI assistant built for your apartment building, housing society, and neighbourhood.
            </p>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="clay-card" style={{ width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'var(--primary-cyan)', boxShadow: '0 10px 20px rgba(22, 217, 227, 0.4), inset 4px 4px 8px rgba(255, 255, 255, 0.6)' }}>
              <Mic size={48} color="var(--text-main)" />
            </div>
            <h1 style={{ fontSize: '32px', lineHeight: '1.2' }}>Just Ask 🎙️</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.6' }}>
              Ask questions, book amenities, or report complaints. Just voice it out or type it like you're talking to a neighbour.
            </p>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="clay-card" style={{ width: '120px', height: '120px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '40px', backgroundColor: '#FFF0F5' }}>
              <Sparkles size={52} color="var(--pink)" style={{ filter: 'drop-shadow(2px 4px 6px rgba(255, 143, 207, 0.3))' }} />
            </div>
            <h1 style={{ fontSize: '32px', lineHeight: '1.2' }}>Discover More <span style={{ color: 'var(--pink)' }}>Around You</span> ✨</h1>
            <p style={{ color: 'var(--text-sub)', fontSize: '15px', lineHeight: '1.6' }}>
              Find upcoming comedy shows, workshops, music sessions, and premium local services in your proximity.
            </p>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '26px', marginBottom: '8px', textAlign: 'center' }}>Let's Get Started 🚀</h2>
            
            {/* Name Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-headings)', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', marginLeft: '4px' }}>Your Name</label>
              <div className="clay-input-container">
                <input 
                  type="text" 
                  className="clay-input" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
            </div>

            {/* Society Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-headings)', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', marginLeft: '4px' }}>Select Community / Society</label>
              <div className="clay-input-container">
                <MapPin size={18} color="var(--deep-teal)" />
                <select 
                  className="clay-input" 
                  style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                  value={formData.community}
                  onChange={(e) => setFormData({ ...formData, community: e.target.value })}
                >
                  {communities.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Apartment Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-headings)', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', marginLeft: '4px' }}>Apartment / Flat Number</label>
              <div className="clay-input-container">
                <input 
                  type="text" 
                  className="clay-input" 
                  value={formData.apartment} 
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                  placeholder="e.g. B-304"
                />
              </div>
            </div>

            {/* Language Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontFamily: 'var(--font-headings)', fontWeight: '600', fontSize: '14px', color: 'var(--text-main)', marginLeft: '4px' }}>Preferred Language</label>
              <div className="clay-input-container">
                <Globe size={18} color="var(--deep-teal)" />
                <select 
                  className="clay-input" 
                  style={{ background: 'none', border: 'none', outline: 'none', cursor: 'pointer' }}
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  {languages.map((l, idx) => (
                    <option key={idx} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button controls */}
      <button 
        onClick={handleNext} 
        className="clay-btn clay-btn-primary" 
        style={{ width: '100%', height: '56px', borderRadius: '18px' }}
      >
        <span>{step === 4 ? 'Enter App' : 'Continue'}</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
