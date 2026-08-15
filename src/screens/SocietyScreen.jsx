import React, { useState, useEffect } from 'react';
import { Bell, Info, Dumbbell, BookOpen, Search, Check, Calendar, Clock, ChevronRight } from 'lucide-react';
import { aiService } from '../services/aiService';

export default function SocietyScreen({ userProfile, activeSubSection, onBookingCreated }) {
  const [activeTab, setActiveTab] = useState('notices'); // 'notices', 'amenities', 'rulebook'
  const [ruleSearch, setRuleSearch] = useState('');
  const [ruleResults, setRuleResults] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [bookingDate, setBookingDate] = useState('2026-08-16');
  const [bookingTime, setBookingTime] = useState('06:00 PM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Deep linking logic from HomeScreen quick actions
  useEffect(() => {
    if (activeSubSection) {
      setActiveTab(activeSubSection);
    }
  }, [activeSubSection]);

  // Handle Rulebook search
  useEffect(() => {
    async function searchRules() {
      if (ruleSearch.trim().length > 1) {
        const matches = await aiService.searchRulebook(ruleSearch);
        setRuleResults(matches);
      } else {
        setRuleResults([]);
      }
    }
    searchRules();
  }, [ruleSearch]);

  const notices = [
    {
      id: "ntc-01",
      title: "💧 Scheduled Water Maintenance",
      description: "Water supply will be suspended in all Blocks this Sunday between 1:00 PM and 4:00 PM due to standard overhead tank cleaning procedures.",
      date: "August 15, 2026",
      urgent: true,
      category: "Maintenance"
    },
    {
      id: "ntc-02",
      title: "🎉 Independence Day Flag Hoisting",
      description: "Join us in the Central Lawn at 8:30 AM tomorrow for the flag hoisting ceremony followed by community breakfast and cultural performances.",
      date: "August 14, 2026",
      urgent: false,
      category: "Celebrations"
    },
    {
      id: "ntc-03",
      title: "🚗 New RFID Gate System Update",
      description: "All resident vehicles must be registered for RFID tags by August 20. Stalls will be set up near Gate 1 from Friday onwards.",
      date: "August 12, 2026",
      urgent: false,
      category: "Security"
    }
  ];

  const amenities = [
    {
      id: "amn-gym",
      title: "Community Gym 🏋️",
      timings: "06:00 AM - 10:00 PM",
      rules: "Indoor shoes required. Maximum 60 mins per session.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
      capacity: "15 people max"
    },
    {
      id: "amn-pool",
      title: "Swimming Pool 🏊",
      timings: "07:00 AM - 11:00 AM, 04:00 PM - 08:00 PM",
      rules: "Swimming suits mandatory. Shower before entry.",
      image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=600&q=80",
      capacity: "10 people max"
    },
    {
      id: "amn-hall",
      title: "Clubhouse Community Hall 🏢",
      timings: "09:00 AM - 11:00 PM",
      rules: "Advance booking needed. Refundable security deposit ₹5,000.",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
      capacity: "150 guests max"
    },
    {
      id: "amn-court",
      title: "Badminton Court 🎾",
      timings: "06:00 AM - 09:00 PM",
      rules: "Non-marking shoes mandatory. Bring your own rackets.",
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80",
      capacity: "4 players max"
    }
  ];

  const handleAmenityBook = (amn) => {
    setSelectedAmenity(amn);
  };

  const submitAmenityBooking = () => {
    if (!selectedAmenity) return;
    const newBkg = {
      id: `BKG-AMN-${Math.floor(1000 + Math.random() * 9000)}`,
      providerName: selectedAmenity.title,
      service: "Amenity Reservation",
      date: bookingDate,
      time: bookingTime,
      status: "Confirmed",
      rate: "Free for residents"
    };
    onBookingCreated(newBkg);
    setSelectedAmenity(null);
    setBookingSuccess(true);
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '90px' }}>
      
      {/* Title */}
      <div style={{ marginTop: '10px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>Society Hub 🏢</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-sub)' }}>Manage bookings, announcements, & community rules.</p>
      </div>

      {/* Clay Navigation Tab switcher */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: 'var(--clay-shadow-input)' }}>
        {[
          { id: 'notices', label: 'Notices 📢' },
          { id: 'amenities', label: 'Amenities 🏋️' },
          { id: 'rulebook', label: 'Rulebook 📖' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="clay-btn"
            style={{
              flex: 1,
              padding: '10px 8px',
              fontSize: '11px',
              fontWeight: '700',
              borderRadius: '14px',
              backgroundColor: activeTab === t.id ? 'var(--primary-cyan)' : 'transparent',
              boxShadow: activeTab === t.id ? '3px 3px 6px rgba(22, 217, 227, 0.2), inset 2px 2px 4px rgba(255,255,255,0.4)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Screen Sections */}
      {activeTab === 'notices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          {notices.map(n => (
            <div 
              key={n.id} 
              className="clay-card" 
              style={{ 
                borderLeft: n.urgent ? '6px solid var(--pink)' : '6px solid var(--primary-cyan)',
                backgroundColor: n.urgent ? '#FFFDFD' : '#FFFFFF',
                padding: '18px 16px',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span 
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: '800', 
                    padding: '3px 8px', 
                    borderRadius: '8px', 
                    backgroundColor: n.urgent ? '#FFE3F0' : 'var(--soft-sky)',
                    color: n.urgent ? 'var(--pink)' : 'var(--deep-teal)'
                  }}
                >
                  {n.category}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>{n.date}</span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '6px' }}>{n.title}</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-sub)', lineHeight: '1.5' }}>{n.description}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'amenities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '6px' }}>
          {amenities.map(a => (
            <div 
              key={a.id} 
              className="clay-card" 
              style={{ padding: '0', overflow: 'hidden', textAlign: 'left', borderRadius: '24px' }}
            >
              <div style={{ height: '120px', width: '100%', position: 'relative' }}>
                <img src={a.image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: '700' }}>
                  🕒 {a.timings}
                </div>
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800' }}>{a.title}</h3>
                  <span style={{ fontSize: '11px', color: 'var(--deep-teal)', fontWeight: '600' }}>{a.capacity}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)', lineHeight: '1.4' }}>
                  <b>Guidelines:</b> {a.rules}
                </p>
                <button 
                  onClick={() => handleAmenityBook(a)}
                  className="clay-btn clay-btn-primary" 
                  style={{ width: '100%', padding: '10px', fontSize: '13px', borderRadius: '12px' }}
                >
                  Book a Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rulebook' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
          <div className="clay-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontSize: '14px', textAlign: 'left' }}>Digital Rulebook Search</h4>
            <div className="clay-input-container">
              <Search size={16} color="var(--deep-teal)" />
              <input 
                type="text" 
                className="clay-input" 
                placeholder="Ask e.g. pets in garden, pool guest fee..."
                value={ruleSearch}
                onChange={(e) => setRuleSearch(e.target.value)}
              />
            </div>
            
            {ruleResults.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' }}>
                {ruleResults.map((rule, idx) => (
                  <div key={idx} style={{ padding: '12px', border: '1px solid rgba(22, 217, 227, 0.2)', borderRadius: '14px', background: '#F9FFFF', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--deep-teal)', fontWeight: '800', marginBottom: '4px' }}>
                      <Check size={10} strokeWidth={4} />
                      Verified Clause
                    </div>
                    <h5 style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--text-main)' }}>{rule.question}</h5>
                    <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '4px', lineHeight: '1.4' }}>{rule.answer}</p>
                    
                    <button 
                      onClick={() => setSelectedRule(rule)}
                      style={{ background: 'none', border: 'none', color: 'var(--purple)', fontSize: '10.5px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '8px' }}
                    >
                      View Original Rule ↗
                    </button>
                  </div>
                ))}
              </div>
            ) : ruleSearch.trim().length > 1 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', textAlign: 'center', padding: '10px' }}>No rules matched. Try keywords like 'pool', 'gym', 'parking'.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left', marginTop: '4px' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Popular queries:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Gym timings', 'Pool guest fee', 'Pet leash rules', 'Visitor parking slot'].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => setRuleSearch(q)}
                      className="clay-btn"
                      style={{ padding: '6px 12px', borderRadius: '10px', fontSize: '10px', boxShadow: '2px 2px 4px rgba(0,0,0,0.02)' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amenity Booking Modal */}
      {selectedAmenity && (
        <div className="modal-overlay" onClick={() => setSelectedAmenity(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', textAlign: 'center' }}>📅 Reservation for {selectedAmenity.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
              
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', marginLeft: '4px' }}>Preferred Slot</label>
                <div className="clay-input-container">
                  <Clock size={16} color="var(--deep-teal)" />
                  <select 
                    className="clay-input" 
                    style={{ background: 'none', border: 'none', outline: 'none' }}
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="06:00 AM">06:00 AM - 07:00 AM</option>
                    <option value="08:00 AM">08:00 AM - 09:00 AM</option>
                    <option value="05:00 PM">05:00 PM - 06:00 PM</option>
                    <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                    <option value="08:00 PM">08:00 PM - 09:00 PM</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button 
                  onClick={() => setSelectedAmenity(null)}
                  className="clay-btn" 
                  style={{ flex: 1, padding: '14px', borderRadius: '14px' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={submitAmenityBooking}
                  className="clay-btn clay-btn-primary" 
                  style={{ flex: 2, padding: '14px', borderRadius: '14px' }}
                >
                  Book Slot
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Rule Document View Overlay */}
      {selectedRule && (
        <div className="modal-overlay" onClick={() => setSelectedRule(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', textAlign: 'center' }}>📖 Society Bylaws Clause</h3>
            <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: '16px', marginTop: '10px' }}>
              <span style={{ fontSize: '10px', color: 'var(--purple)', fontWeight: '800', textTransform: 'uppercase' }}>
                {selectedRule.ruleRef}
              </span>
              <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
                Official Regulation Excerpt:
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: '1.6', background: '#FFFFFF', padding: '10px', borderRadius: '10px', borderLeft: '3px solid var(--purple)' }}>
                "Pursuant to the resolutions of the general assembly, all residents shall adhere to standard codes. {selectedRule.answer} Violations will be subject to standard penalties after notice."
              </p>
            </div>
            <button 
              onClick={() => setSelectedRule(null)}
              className="clay-btn clay-btn-primary" 
              style={{ marginTop: '10px', width: '100%', padding: '12px', borderRadius: '12px' }}
            >
              Close Bylaws
            </button>
          </div>
        </div>
      )}

      {/* Booking Success Confirmation */}
      {bookingSuccess && (
        <div className="modal-overlay" onClick={() => setBookingSuccess(false)}>
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
            
            <h3 style={{ fontSize: '20px' }}>Slot Booked! 🎟️</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-sub)', marginTop: '8px', lineHeight: '1.5' }}>
              Your reservation has been recorded successfully. A booking pass has been generated. You can access it in your Profile.
            </p>

            <button 
              onClick={() => setBookingSuccess(false)}
              className="clay-btn clay-btn-primary" 
              style={{ width: '100%', marginTop: '20px', padding: '14px', borderRadius: '14px' }}
            >
              Excellent
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
