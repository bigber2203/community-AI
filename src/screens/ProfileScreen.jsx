import React, { useState, useEffect } from 'react';
import { Star, Heart, Calendar, Clock, Globe, Shield, ShieldCheck, ChevronRight } from 'lucide-react';
import { reportService } from '../services/reportService';
import { listingService } from '../services/listingService';

export default function ProfileScreen({ userProfile }) {
  const [activeTab, setActiveTab] = useState('interests'); // 'interests', 'saves', 'mylistings', 'safety'
  const [userInterests, setUserInterests] = useState(userProfile.interests || ['Music', 'Parties', 'Culture']);
  const [reports, setReports] = useState([]);
  const [mylistings, setMylistings] = useState([]);

  useEffect(() => {
    async function loadData() {
      const data = await reportService.getReports();
      setReports(data);

      const allListings = await listingService.getListings();
      // Mock user's submitted listings
      setMylistings(allListings.slice(0, 1));
    }
    loadData();
  }, []);

  const allPossibleInterests = [
    'Music', 'Parties', 'Food', 'Culture', 'Sports', 'Art', 'Gaming', 'Nature', 'Business', 'Housing'
  ];

  const handleToggleInterest = (interest) => {
    const updated = [...userInterests];
    const index = updated.indexOf(interest);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(interest);
    }
    setUserInterests(updated);
    userProfile.interests = updated; // update reference
  };

  return (
    <div className="screen-content">
      <div className="screen-content-inner">
      {/* Profile Header */}
      <div className="clay-card" style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '10px', background: 'linear-gradient(135deg, #FFFFFF 0%, #F5FFFF 100%)', border: '1px solid rgba(22, 217, 227, 0.15)' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', backgroundColor: 'var(--primary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(22, 217, 227, 0.25)', fontSize: '32px' }}>
          👱
        </div>
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{userProfile.name}</h3>
            <span style={{ fontSize: '8px', fontWeight: '800', backgroundColor: 'var(--purple)', color: '#FFFFFF', padding: '2px 6px', borderRadius: '6px' }}>LEVEL 2</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: '600', marginTop: '2px' }}>
            📍 {userProfile.community.split(',')[0]}
          </p>
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
              gap: '2px',
              marginTop: '4px'
            }}
          >
            <ShieldCheck size={8} strokeWidth={3} />
            VERIFIED USER
          </span>
        </div>
      </div>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#FFFFFF', borderRadius: '18px', boxShadow: 'var(--clay-shadow-input)' }}>
        {[
          { id: 'interests', label: 'Interests' },
          { id: 'saves', label: 'Saves' },
          { id: 'mylistings', label: 'My Posts' },
          { id: 'safety', label: 'Safety Log' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className="clay-btn"
            style={{
              flex: 1,
              padding: '10px 4px',
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

      {/* Profile Panels */}
      {activeTab === 'interests' && (
        <div className="clay-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Your Local Preferences</h4>
          <p style={{ fontSize: '11.5px', color: 'var(--text-sub)', marginTop: '-6px' }}>Select interests to influence your personalized U'R Score on events.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
            {allPossibleInterests.map((interest, idx) => {
              const selected = userInterests.includes(interest);
              return (
                <button
                  key={idx}
                  onClick={() => handleToggleInterest(interest)}
                  className="clay-btn"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    backgroundColor: selected ? 'var(--primary-cyan)' : '#FFFFFF',
                    boxShadow: selected 
                      ? '2px 4px 8px rgba(22, 217, 227, 0.2), inset 2px 2px 4px rgba(255,255,255,0.4)' 
                      : '2px 4px 8px rgba(8,127,140,0.04)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'saves' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Mock saved items */}
          <div className="clay-card" style={{ padding: '12px', display: 'flex', gap: '12px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=150&q=80" alt="Saves" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--pink)' }}>NIGHTLIFE</span>
              <h4 style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>Summer Beats Electronic Fest</h4>
              <div style={{ fontSize: '10px', color: 'var(--text-sub)', marginTop: '2px' }}>⭐ 9.4 U'R Score</div>
            </div>
          </div>

          <div className="clay-card" style={{ padding: '12px', display: 'flex', gap: '12px', textAlign: 'left' }}>
            <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=150&q=80" alt="Saves" style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--purple)' }}>HOUSING</span>
              <h4 style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>2BHK Flat near City Center</h4>
              <div style={{ fontSize: '10px', color: 'var(--text-sub)', marginTop: '2px' }}>₹18,000/month</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mylistings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mylistings.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-sub)' }}>You haven't contributed any listings yet.</p>
          ) : (
            mylistings.map(list => (
              <div key={list.id} className="clay-card" style={{ padding: '14px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--purple)' }}>{list.type}</span>
                  <h4 style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>{list.title}</h4>
                  <span style={{ fontSize: '10px', color: 'var(--text-sub)' }}>📍 {list.locationName} • ₹{list.rent}/mo</span>
                </div>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px', backgroundColor: 'var(--soft-sky)', color: 'var(--deep-teal)', fontWeight: '800' }}>
                  ACTIVE
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'safety' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '800', textAlign: 'left' }}>Safety Flag Log</h4>
          <p style={{ fontSize: '11.5px', color: 'var(--text-sub)', marginTop: '-8px', textAlign: 'left' }}>Reports logged by you to flag scams, fake details or inappropriate content.</p>
          
          {reports.map(rep => (
            <div key={rep.id} className="clay-card" style={{ padding: '14px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--pink)' }}>{rep.category}</span>
                <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '8px', backgroundColor: '#FFF3CD', color: '#856404', fontWeight: '700' }}>
                  {rep.status}
                </span>
              </div>
              <h4 style={{ fontSize: '13px', fontWeight: '700' }}>{rep.title}</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Target: <b>{rep.targetTitle}</b></p>
              <div style={{ fontSize: '10.5px', background: '#F8F9FA', padding: '8px', borderRadius: '8px', color: 'var(--text-main)' }}>
                Detail: {rep.details}
              </div>
              <div style={{ fontSize: '9px', color: 'var(--text-sub)', textAlign: 'right' }}>
                Logged on: {rep.date}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
