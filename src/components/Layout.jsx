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
        className="fab-add"
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
