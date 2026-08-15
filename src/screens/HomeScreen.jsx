import React, { useState, useEffect } from 'react';
import { Mic, Send, MapPin, Wrench, FileText, Calendar, Bell, HelpCircle, Dumbbell, Sun, ChevronRight, CheckCircle, Package, Users } from 'lucide-react';
import { ticketService } from '../services/ticketService';

export default function HomeScreen({ userProfile, setTab, setAIPrefill, onCreateTicketNotification }) {
  const [tickets, setTickets] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('Listening...');
  const [community, setCommunity] = useState(userProfile.community || 'Sunshine Residency, Guwahati');
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    async function fetchTickets() {
      const activeTkts = await ticketService.getTickets();
      setTickets(activeTkts);
    }
    fetchTickets();
  }, []);

  const handleVoiceClick = () => {
    if (isListening) return;
    setIsListening(true);
    setListeningText('Listening...');
    
    // Simulate speech-to-text input after 3 seconds
    setTimeout(() => {
      setListeningText('Processing...');
      setTimeout(() => {
        setIsListening(false);
        // Pre-fill a random query and go to AI Assistant
        const voicePrompts = [
          "Report a water leakage in Block C corridor",
          "What are the gym timings?",
          "Book the community hall for tomorrow",
          "Find me a reliable electrician"
        ];
        const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
        setAIPrefill({ text: randomPrompt, autoSend: true });
        setTab('ai');
      }, 1000);
    }, 2200);
  };

  const handleSendInput = () => {
    if (!chatInput.trim()) return;
    setAIPrefill({ text: chatInput, autoSend: true });
    setChatInput('');
    setTab('ai');
  };

  const selectCommunity = (name) => {
    setCommunity(name);
    setShowLocationModal(false);
  };

  return (
    <div className="screen-content">
      {/* Top Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', lineHeight: '1.2' }}>
            Good Morning, {userProfile.name || 'Bigyat'} 👋
          </h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '13px', marginTop: '4px' }}>
            What can I help you with today?
          </p>
        </div>
        
        {/* Interactive Community Selector */}
        <button 
          onClick={() => setShowLocationModal(true)}
          className="clay-btn" 
          style={{ 
            padding: '8px 12px', 
            borderRadius: '16px', 
            fontSize: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            boxShadow: '4px 4px 8px rgba(8, 127, 140, 0.06)'
          }}
        >
          <MapPin size={14} color="var(--deep-teal)" />
          <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {community.split(',')[0]}
          </span>
        </button>
      </div>

      {/* Main AI Speak & Search Hero Card */}
      <div className="clay-card" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F5FFFF 100%)', display: 'flex', flexDirection: 'column', gap: '16px', border: '1px solid rgba(22, 217, 227, 0.2)' }}>
        <h3 style={{ fontSize: '16px', color: 'var(--deep-teal)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Ask anything about your community</span>
        </h3>
        
        {/* Animated Listening Overlay */}
        {isListening ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
            <div className="voice-waves">
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
              <div className="voice-wave-bar"></div>
            </div>
            <p style={{ fontFamily: 'var(--font-headings)', fontWeight: '700', color: 'var(--deep-teal)', fontSize: '15px', marginTop: '10px' }}>
              {listeningText}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            {/* Pulsing Mic Button */}
            <button 
              onClick={handleVoiceClick}
              className="clay-btn"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(22, 217, 227, 0.3), inset 3px 3px 6px rgba(255, 255, 255, 0.6), inset -3px -3px 6px rgba(8, 127, 140, 0.15)',
                cursor: 'pointer'
              }}
            >
              <Mic size={32} color="var(--text-main)" />
            </button>
          </div>
        )}

        {/* Text Input Row */}
        <div className="clay-input-container" style={{ padding: '4px 8px' }}>
          <input 
            type="text" 
            className="clay-input" 
            placeholder="Type your question..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendInput()}
          />
          <button 
            onClick={handleSendInput}
            className="clay-btn" 
            style={{ 
              width: '38px', 
              height: '38px', 
              borderRadius: '12px', 
              padding: 0, 
              backgroundColor: 'var(--primary-cyan)',
              boxShadow: '3px 3px 6px rgba(22, 217, 227, 0.2)'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* AI Daily Briefing / Smart Suggestions */}
      <div className="clay-card" style={{ background: '#FFFDF6', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid rgba(255, 214, 107, 0.3)' }}>
        <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#856404' }}>
          <Sun size={16} color="var(--yellow)" style={{ fill: 'var(--yellow)' }} />
          Your Day in the Neighbourhood
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <span style={{ fontSize: '16px' }}>🏋️</span>
            <span>Gym open until <b>10:00 PM</b> today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Package size={15} color="var(--purple)" />
            <span><b>2 packages</b> waiting for you at Block B reception</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Calendar size={15} color="var(--pink)" />
            <span>Stand-up Comedy Night tomorrow at <b>7:00 PM</b> (2.4 km away)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h4 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          Quick Actions
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Report Issue', icon: <Wrench size={22} color="var(--deep-teal)" />, bg: '#EBFBFC', tab: 'society', section: 'complaints' },
            { label: 'Society Rules', icon: <FileText size={22} color="var(--purple)" />, bg: '#F3EFFF', tab: 'society', section: 'rulebook' },
            { label: 'Book Service', icon: <Wrench size={22} color="#D97706" />, bg: '#FFF7ED', tab: 'services' },
            { label: 'Nearby Events', icon: <Calendar size={22} color="var(--pink)" />, bg: '#FFF0F5', tab: 'discover' },
            { label: 'Notices', icon: <Bell size={22} color="#2563EB" />, bg: '#EFF6FF', tab: 'society', section: 'notices' },
            { label: 'Amenities', icon: <Dumbbell size={22} color="#059669" />, bg: '#ECFDF5', tab: 'society', section: 'amenities' }
          ].map((act, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (act.section) onCreateTicketNotification(act.section);
                setTab(act.tab);
              }}
              className="clay-card clay-card-interactive"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 8px',
                borderRadius: '20px',
                gap: '8px',
                backgroundColor: act.bg,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {act.icon}
              </div>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', textAlign: 'center' }}>
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Requests Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ fontSize: '15px' }}>Active Requests</h4>
          <button onClick={() => setTab('profile')} style={{ background: 'none', border: 'none', color: 'var(--deep-teal)', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>View All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.slice(0, 2).map((tkt, idx) => (
            <div key={idx} className="clay-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                  {tkt.title}
                </span>
                <span className={`status-chip status-chip-${tkt.status.toLowerCase()}`}>
                  {tkt.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-sub)' }}>
                <span>ID: <b>#{tkt.id}</b></span>
                <span>{tkt.date}</span>
              </div>

              {tkt.technician && (
                <div style={{ fontSize: '12px', background: '#F1FAFA', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid var(--primary-cyan)', color: 'var(--text-main)' }}>
                  🧑‍🔧 <b>{tkt.technician}</b>
                </div>
              )}

              {/* Clay Progress Tracker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#E0F8F9', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(tkt.progress / 4) * 100}%`, 
                      height: '100%', 
                      backgroundColor: tkt.status === 'Resolved' ? 'var(--green)' : 'var(--primary-cyan)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-sub)', fontWeight: '600' }}>
                  <span>Reported</span>
                  <span>Assigned</span>
                  <span>In Progress</span>
                  <span>Resolved</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Pulse Section */}
      <div className="clay-card" style={{ background: '#FDF2F8', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid rgba(255, 143, 207, 0.2)' }}>
        <h4 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', color: '#9D174D' }}>
          <Users size={16} color="var(--pink)" />
          Community Pulse
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-main)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚽</span>
            <span><b>12 residents</b> joined the weekend football game turf booking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎨</span>
            <span><b>8 residents</b> registered for the Pottery Workshop</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧘</span>
            <span>New morning Yoga Class added in Central Lawn starting Monday</span>
          </div>
        </div>
      </div>

      {/* Community Location Selector Modal */}
      {showLocationModal && (
        <div className="modal-overlay" onClick={() => setShowLocationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', textAlign: 'center' }}>📍 Change Community</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
              {[
                'Sunshine Residency, Guwahati',
                'Greenwood Apartments, Kahilipara',
                'Exotica Greens, Zoo Road',
                'Palacio Heights, Khanapara'
              ].map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => selectCommunity(loc)}
                  className="clay-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'flex-start',
                    backgroundColor: community === loc ? 'var(--bg-light)' : '#FFFFFF',
                    border: community === loc ? '2px solid var(--primary-cyan)' : '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  <MapPin size={16} color="var(--deep-teal)" />
                  <span>{loc}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowLocationModal(false)} className="clay-btn clay-btn-primary" style={{ marginTop: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
