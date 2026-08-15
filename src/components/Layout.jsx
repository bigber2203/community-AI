import React from 'react';
import { Home, Search, Map, MessageSquare, User, Plus } from 'lucide-react';

export default function Layout({ children, activeTab, setTab, onAddClick }) {
  return (
    <div className={`app-container ${activeTab === 'map' ? 'map-active-layout' : ''}`}>
      {/* Scrollable Screen Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {children}
      </div>

      {/* Floating Action Button (FAB) for adding a listing - E.g. Event, Room, Roommate */}
      <button
        onClick={onAddClick}
        className="clay-btn"
        style={{
          position: 'absolute',
          bottom: '108px',
          right: '20px',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'var(--purple)',
          color: '#FFFFFF',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 16px rgba(155, 123, 255, 0.35), inset 3px 3px 6px rgba(255,255,255,0.4), inset -3px -3px 6px rgba(0,0,0,0.15)',
          zIndex: 90,
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.25)'
        }}
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      {/* Floating Claymorphic Bottom Navigation Bar */}
      <nav className="bottom-nav">
        {/* Home Tab */}
        <div 
          className={`nav-item ${activeTab === 'home' ? 'nav-item-active' : ''}`} 
          onClick={() => setTab('home')}
        >
          <Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span className="nav-item-label">Home</span>
        </div>

        {/* Discover Tab */}
        <div 
          className={`nav-item ${activeTab === 'discover' ? 'nav-item-active' : ''}`} 
          onClick={() => setTab('discover')}
        >
          <Search size={20} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
          <span className="nav-item-label">Discover</span>
        </div>

        {/* Central Floating AI Assistant Tab */}
        <div 
          className={`nav-item-ai ${activeTab === 'ai' ? 'nav-item-ai-active' : ''}`}
          onClick={() => setTab('ai')}
          style={{
            transform: activeTab === 'ai' ? 'scale(1.05) translateY(-20px)' : 'translateY(-16px)'
          }}
        >
          <MessageSquare size={26} />
        </div>

        {/* Map Tab */}
        <div 
          className={`nav-item ${activeTab === 'map' ? 'nav-item-active' : ''}`} 
          onClick={() => setTab('map')}
        >
          <Map size={20} strokeWidth={activeTab === 'map' ? 2.5 : 2} />
          <span className="nav-item-label">U'R Map</span>
        </div>

        {/* Profile Tab */}
        <div 
          className={`nav-item ${activeTab === 'profile' ? 'nav-item-active' : ''}`} 
          onClick={() => setTab('profile')}
        >
          <User size={20} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span className="nav-item-label">Profile</span>
        </div>
      </nav>
    </div>
  );
}
