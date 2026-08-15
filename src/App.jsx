import React, { useState } from 'react';
import Layout from './components/Layout';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ServicesScreen from './screens/ServicesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SocietyScreen from './screens/SocietyScreen';
import { Bell, CheckCircle } from 'lucide-react';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [activeSubSection, setActiveSubSection] = useState(null); // Deep link inside society tab
  const [aiPrefill, setAiPrefill] = useState({ text: '', autoSend: false });
  const [userProfile, setUserProfile] = useState({
    name: 'Bigyat',
    community: 'Sunshine Residency, Guwahati',
    apartment: 'B-304',
    language: 'English'
  });

  // Notification banners (claymorphic slide down alerts)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const triggerNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleCompleteOnboarding = (profileData) => {
    setUserProfile(profileData);
    setIsOnboarded(true);
    triggerNotification(`Welcome to ${profileData.community.split(',')[0]}! 🏡`);
  };

  const handleTicketCreated = (ticket) => {
    triggerNotification(`Ticket #${ticket.id} created successfully! 🛠️`);
  };

  const handleBookingCreated = (booking) => {
    triggerNotification(`Booking confirmed for ${booking.providerName}! 📅`);
  };

  // Navigates and sets sub-sections (deep links)
  const handleQuickAction = (section) => {
    setActiveSubSection(section);
    setActiveTab('society');
  };

  return (
    <>
      {!isOnboarded ? (
        <div className="app-container">
          <OnboardingScreen onComplete={handleCompleteOnboarding} />
        </div>
      ) : (
        <Layout activeTab={activeTab} setTab={(tab) => {
          setActiveTab(tab);
          setActiveSubSection(null); // reset deep link when clicking tab manually
        }}>
          
          {/* Top Slide Down Notification Banner */}
          {notification.show && (
            <div 
              className="clay-card"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                zIndex: 999,
                padding: '12px 16px',
                borderRadius: '16px',
                backgroundColor: '#ECFDF5',
                border: '1px solid rgba(110, 231, 183, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 16px rgba(8,127,140,0.08)',
                animation: 'slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1) forwards'
              }}
            >
              <CheckCircle size={18} color="var(--green)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                {notification.message}
              </span>
            </div>
          )}

          {/* Screen Switcher */}
          {activeTab === 'home' && (
            <HomeScreen 
              userProfile={userProfile} 
              setTab={setActiveTab} 
              setAIPrefill={setAiPrefill}
              onCreateTicketNotification={handleQuickAction}
            />
          )}

          {activeTab === 'ai' && (
            <AIAssistantScreen 
              prefill={aiPrefill} 
              clearPrefill={() => setAiPrefill({ text: '', autoSend: false })}
              setTab={setActiveTab}
              onTicketCreated={handleTicketCreated}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverScreen 
              userProfile={userProfile}
            />
          )}

          {activeTab === 'services' && (
            <ServicesScreen 
              userProfile={userProfile}
              onBookingCreated={handleBookingCreated}
            />
          )}

          {activeTab === 'society' && (
            <SocietyScreen 
              userProfile={userProfile}
              activeSubSection={activeSubSection}
              onBookingCreated={handleBookingCreated}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen 
              userProfile={userProfile}
            />
          )}

        </Layout>
      )}

      {/* Slide down animation utility */}
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default App;
