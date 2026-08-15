import React, { useState, useEffect } from 'react';
import { User, Key, Shield, Calendar, Clock, Bell, Wrench, Settings, ChevronRight, Globe } from 'lucide-react';
import { ticketService } from '../services/ticketService';
import { serviceProviderService } from '../services/serviceProviderService';

export default function ProfileScreen({ userProfile }) {
  const [tickets, setTickets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeSection, setActiveSection] = useState('requests'); // 'requests', 'bookings', 'settings'

  useEffect(() => {
    async function loadData() {
      const tkts = await ticketService.getTickets();
      setTickets(tkts);
      const bkgs = await serviceProviderService.getBookings();
      setBookings(bkgs);
    }
    loadData();
  }, []);

  return (
    <div className="screen-content" style={{ paddingBottom: '90px' }}>
      
      {/* Profile Header */}
      <div className="clay-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F6FFFF 100%)', border: '1px solid rgba(22, 217, 227, 0.15)' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(22, 217, 227, 0.25)', fontSize: '32px' }}>
          👋
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{userProfile.name}</h3>
            <span style={{ fontSize: '8px', fontWeight: '800', backgroundColor: 'var(--green)', color: 'var(--text-main)', padding: '2px 6px', borderRadius: '6px' }}>VERIFIED</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: '600', marginTop: '2px' }}>
            Apartment {userProfile.apartment}
          </p>
          <p style={{ fontSize: '10px', color: 'var(--text-sub)', marginTop: '2px' }}>
            📍 {userProfile.community.split(',')[0]}
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: 'var(--clay-shadow-input)' }}>
        {[
          { id: 'requests', label: 'My Requests' },
          { id: 'bookings', label: 'My Bookings' },
          { id: 'settings', label: 'Settings' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSection(t.id)}
            className="clay-btn"
            style={{
              flex: 1,
              padding: '10px 8px',
              fontSize: '11px',
              fontWeight: '700',
              borderRadius: '14px',
              backgroundColor: activeSection === t.id ? 'var(--primary-cyan)' : 'transparent',
              boxShadow: activeSection === t.id ? '3px 3px 6px rgba(22, 217, 227, 0.2), inset 2px 2px 4px rgba(255,255,255,0.4)' : 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {activeSection === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>No requests logged yet.</p>
          ) : (
            tickets.map(tkt => (
              <div key={tkt.id} className="clay-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>{tkt.title}</span>
                  <span className={`status-chip status-chip-${tkt.status.toLowerCase()}`}>
                    {tkt.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-sub)' }}>
                  <span>ID: <b>#{tkt.id}</b></span>
                  <span>{tkt.date}</span>
                </div>
                
                {tkt.technician && (
                  <div style={{ fontSize: '12px', background: '#F1FAFA', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid var(--primary-cyan)' }}>
                    🧑‍🔧 <b>{tkt.technician}</b>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === 'bookings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>No active bookings yet.</p>
          ) : (
            bookings.map(bkg => (
              <div key={bkg.id} className="clay-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--purple)', textTransform: 'uppercase' }}>
                      {bkg.service}
                    </span>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', marginTop: '2px' }}>{bkg.providerName}</h4>
                  </div>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '8px', backgroundColor: '#D4EDDA', color: '#155724', fontWeight: '700' }}>
                    {bkg.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-sub)', marginTop: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {bkg.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {bkg.time}
                  </span>
                </div>
                
                <div style={{ fontSize: '11px', color: 'var(--text-sub)' }}>
                  Rate: <b>{bkg.rate}</b>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { label: 'Language Settings', val: userProfile.language, icon: <Globe size={18} color="var(--deep-teal)" /> },
            { label: 'Notification Settings', val: 'All Enabled', icon: <Bell size={18} color="var(--purple)" /> },
            { label: 'Community Credentials', val: 'Verified B-304', icon: <Shield size={18} color="var(--pink)" /> },
            { label: 'Help & Support', val: 'Society Office', icon: <User size={18} color="var(--deep-teal)" /> }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="clay-card clay-card-interactive" 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.icon}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{item.label}</h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-sub)' }}>{item.val}</span>
                </div>
              </div>
              <ChevronRight size={16} color="var(--text-sub)" />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
