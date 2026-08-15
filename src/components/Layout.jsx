import React from 'react';
import { Home, Compass, MessageSquare, Wrench, User } from 'lucide-react';

export default function Layout({ children, activeTab, setTab }) {
  return (
    <div className="app-container">
      {/* Scrollable Screen Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {children}
      </div>

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
          <Compass size={20} strokeWidth={activeTab === 'discover' ? 2.5 : 2} />
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
          <MessageSquare size={28} />
        </div>

        {/* Services Tab */}
        <div 
          className={`nav-item ${activeTab === 'services' ? 'nav-item-active' : ''}`} 
          onClick={() => setTab('services')}
        >
          <Wrench size={20} strokeWidth={activeTab === 'services' ? 2.5 : 2} />
          <span className="nav-item-label">Services</span>
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
