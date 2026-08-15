import React, { useState } from 'react';
import Layout from './components/Layout';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import MapScreen from './screens/MapScreen';
import AIAssistantScreen from './screens/AIAssistantScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddListingScreen from './screens/AddListingScreen';
import { CheckCircle } from 'lucide-react';

function App() {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Quick Filters state passed for deep linking from Home quick action grid
  const [quickFilters, setQuickFilters] = useState(null);

  const [userProfile, setUserProfile] = useState({
    name: 'Bigyat',
    community: 'Zoo Road, Guwahati',
    apartment: 'B-304',
    language: 'English',
    interests: ['Music', 'Parties', 'Culture']
  });

  const [aiPrefill, setAiPrefill] = useState({ text: '', autoSend: false });
  const [notification, setNotification] = useState({ show: false, message: '' });

  const triggerNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleCompleteOnboarding = (profileData) => {
    setUserProfile(profileData);
    setIsOnboarded(true);
    triggerNotification(`Welcome, ${profileData.name}! Let's discover ${profileData.community.split(',')[0]} 📍`);
  };

  const handleQuickActionFilter = (filters) => {
    setQuickFilters(filters);
  };

  const handleAddListingSuccess = (message) => {
    triggerNotification(message);
  };

  return (
    <>
      {!isOnboarded ? (
        <div className="app-container">
          <OnboardingScreen onComplete={handleCompleteOnboarding} />
        </div>
      ) : (
        <Layout 
          activeTab={activeTab} 
          setTab={setActiveTab}
          onAddClick={() => setShowAddModal(true)}
        >
          {/* Top Slide Down Notification Toast */}
          {notification.show && (
            <div 
              className="clay-card"
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'calc(100% - 32px)',
                maxWidth: '500px',
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

          {/* Core Tab Switcher */}
          {activeTab === 'home' && (
            <HomeScreen 
              userProfile={userProfile}
              setTab={setActiveTab}
              setAIPrefill={setAiPrefill}
              onQuickActionFilter={handleQuickActionFilter}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverScreen 
              userProfile={userProfile}
              quickFilters={quickFilters}
              clearQuickFilters={() => setQuickFilters(null)}
            />
          )}

          {activeTab === 'map' && (
            <MapScreen 
              userProfile={userProfile}
            />
          )}

          {activeTab === 'ai' && (
            <AIAssistantScreen 
              prefill={aiPrefill}
              clearPrefill={() => setAiPrefill({ text: '', autoSend: false })}
              setTab={setActiveTab}
              onQuickActionFilter={handleQuickActionFilter}
              userProfile={userProfile}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen 
              userProfile={userProfile}
            />
          )}

          {/* Stepper Wizard modal for contributing listings */}
          {showAddModal && (
            <AddListingScreen 
              onClose={() => setShowAddModal(false)}
              onAddSuccess={handleAddListingSuccess}
            />
          )}

        </Layout>
      )}

      {/* Slide down animation styled */}
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
