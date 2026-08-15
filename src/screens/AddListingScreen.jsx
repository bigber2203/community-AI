import React, { useState } from 'react';
import { Calendar, MapPin, Shield, Check, FileText, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { eventService } from '../services/eventService';
import { listingService } from '../services/listingService';

export default function AddListingScreen({ onClose, onAddSuccess }) {
  const [step, setStep] = useState(1);
  const [listingType, setListingType] = useState('Event'); // Event, Festival, Housing, Roommate
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('08:00 PM');
  const [privacyLevel, setPrivacyLevel] = useState('Public'); // Public, Area Only, Private
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [furnished, setFurnished] = useState('Furnished');
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [contact, setContact] = useState('+91 99999 99999');

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (listingType === 'Event' || listingType === 'Festival') {
        const newEvt = await eventService.addEvent({
          title,
          description,
          date,
          time,
          location: locationName,
          approximateArea: locationName,
          price: price ? `₹${price}` : 'Free Entry',
          category: listingType === 'Festival' ? 'Festivals' : 'Social',
          privacyLevel,
          coordinates: { x: 45 + Math.random() * 20, y: 45 + Math.random() * 20 }
        });
        onAddSuccess(`Event "${newEvt.title}" created successfully!`);
      } else {
        // Housing or Roommate
        const newList = await listingService.addListing({
          type: listingType === 'Roommate' ? 'Roommate' : 'Flat',
          title,
          description,
          locationName,
          rent: parseInt(price) || 10000,
          bedrooms,
          bathrooms,
          furnished,
          petsAllowed,
          contact,
          coordinates: { x: 45 + Math.random() * 20, y: 45 + Math.random() * 20 }
        });
        onAddSuccess(`Listing "${newList.title}" posted successfully!`);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" style={{ alignItems: 'center', padding: '20px' }}>
      <div 
        className="clay-card" 
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          maxHeight: '90%', 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          borderRadius: '32px',
          padding: '24px'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px' }}>➕ Add Something</h3>
          <button 
            onClick={onClose} 
            className="clay-btn" 
            style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              style={{
                width: s === step ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: s === step ? 'var(--primary-cyan)' : 'var(--soft-sky)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Step 1: Listing Category */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '14px', textAlign: 'center' }}>What would you like to add?</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {[
                { label: 'Event', desc: 'Concert, party, play', icon: '🎉' },
                { label: 'Festival', desc: 'Puja, fair, culture', icon: '🪔' },
                { label: 'Housing', desc: 'Rentals, PG, flats', icon: '🏠' },
                { label: 'Roommate', desc: 'Need a flatmate', icon: '👥' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setListingType(item.label)}
                  className="clay-card clay-card-interactive"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px 8px',
                    borderRadius: '20px',
                    gap: '6px',
                    backgroundColor: listingType === item.label ? 'var(--bg-light)' : '#FFFFFF',
                    border: listingType === item.label ? '2px solid var(--primary-cyan)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '28px' }}>{item.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{item.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)', textAlign: 'center' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '14px', textAlign: 'center' }}>Tell us about the {listingType}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Title</label>
              <div className="clay-input-container">
                <FileText size={16} color="var(--deep-teal)" />
                <input 
                  type="text" 
                  className="clay-input" 
                  placeholder={`e.g. ${listingType === 'Event' ? 'Acoustic Jam Session' : 'Cozy 1BHK Flat'}`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Description</label>
              <div className="clay-input-container" style={{ padding: '8px 12px' }}>
                <textarea 
                  className="clay-input" 
                  style={{ minHeight: '60px', resize: 'none' }}
                  placeholder="Provide detailed description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>
                {listingType === 'Housing' || listingType === 'Roommate' ? 'Monthly Rent (₹)' : 'Entry Price / Fee (₹)'}
              </label>
              <div className="clay-input-container">
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--deep-teal)', marginLeft: '4px' }}>₹</span>
                <input 
                  type="number" 
                  className="clay-input" 
                  placeholder={listingType === 'Housing' || listingType === 'Roommate' ? 'Rent in INR' : 'Leave empty if Free'}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '14px', textAlign: 'center' }}>Where is it located?</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Area / Neighbourhood</label>
              <div className="clay-input-container">
                <MapPin size={16} color="var(--deep-teal)" />
                <input 
                  type="text" 
                  className="clay-input" 
                  placeholder="e.g. Beltola, Guwahati"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                />
              </div>
            </div>

            {/* Simulated mini map */}
            <div className="clay-card" style={{ padding: '0', overflow: 'hidden', height: '140px', background: 'radial-gradient(circle, #E1F8F9 10%, #D4F7F7 70%, #C4ECEC 100%)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <MapPin size={24} color="var(--pink)" fill="rgba(255, 143, 207, 0.4)" />
                <span style={{ fontSize: '9px', fontWeight: '800', background: '#FFFFFF', padding: '2px 6px', borderRadius: '4px', marginTop: '2px', boxShadow: '1px 2px 4px rgba(0,0,0,0.1)' }}>Pin Location</span>
              </div>
              <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(255,255,255,0.8)', padding: '2px 6px', borderRadius: '4px', fontSize: '9px' }}>
                Map Preview
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Settings & Submission */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <h4 style={{ fontSize: '14px', textAlign: 'center' }}>Preferences & Privacy</h4>

            {/* Events Timing */}
            {(listingType === 'Event' || listingType === 'Festival') && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Date</label>
                  <div className="clay-input-container">
                    <input 
                      type="text" 
                      className="clay-input" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="e.g. Tonight, This Weekend"
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Time</label>
                  <div className="clay-input-container">
                    <input 
                      type="text" 
                      className="clay-input" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 08:00 PM"
                    />
                  </div>
                </div>
                
                {/* Privacy select */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Privacy Level</label>
                  <div className="clay-input-container">
                    <Shield size={16} color="var(--deep-teal)" />
                    <select 
                      className="clay-input"
                      style={{ background: 'none', border: 'none', outline: 'none' }}
                      value={privacyLevel}
                      onChange={(e) => setPrivacyLevel(e.target.value)}
                    >
                      <option value="Public">Public (Anyone can view address)</option>
                      <option value="Area Only">Area Only (Hide exact location)</option>
                      <option value="Private">Private House Party (Host approval required)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Housing specifications */}
            {(listingType === 'Housing' || listingType === 'Roommate') && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Bedrooms</label>
                    <div className="clay-input-container">
                      <select 
                        className="clay-input" 
                        style={{ border: 'none', background: 'none' }}
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                      >
                        <option value="1">1 BHK / Room</option>
                        <option value="2">2 BHK</option>
                        <option value="3">3 BHK</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Furnishing</label>
                    <div className="clay-input-container">
                      <select 
                        className="clay-input" 
                        style={{ border: 'none', background: 'none' }}
                        value={furnished}
                        onChange={(e) => setFurnished(e.target.value)}
                      >
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', marginLeft: '4px' }}>Contact Number</label>
                  <div className="clay-input-container">
                    <input 
                      type="text" 
                      className="clay-input" 
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px' }}>
                  <input 
                    type="checkbox" 
                    id="pets"
                    checked={petsAllowed}
                    onChange={(e) => setPetsAllowed(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-cyan)' }}
                  />
                  <label htmlFor="pets" style={{ fontSize: '12px', fontWeight: '600' }}>Pets Allowed</label>
                </div>
              </>
            )}

            <div style={{ fontSize: '11px', background: '#F1FAFA', padding: '8px 12px', borderRadius: '10px', color: 'var(--deep-teal)' }}>
              🛡️ **Safety Pledge:** Fake listings, scams, or misleading information will be removed by community moderators.
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="clay-btn" 
              style={{ flex: 1, height: '48px', borderRadius: '14px' }}
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <button 
            onClick={handleNext}
            className="clay-btn clay-btn-primary" 
            style={{ flex: 2, height: '48px', borderRadius: '14px' }}
          >
            <span>{step === 4 ? 'Submit Listing' : 'Next'}</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
