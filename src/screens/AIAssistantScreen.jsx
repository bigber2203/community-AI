import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe, Star, Check, ArrowRight } from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AIAssistantScreen({ prefill, clearPrefill, setTab, onQuickActionFilter, userProfile }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-01',
      sender: 'ai',
      text: "Hey! I'm NeighbourAI. Ask me anything about what's happening around you. 🤖\n\nTry asking: 'What should I do tonight?', 'Puja nearby', or 'Find a flatmate near Beltola'!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState(userProfile.language || 'English');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle prefill inputs
  useEffect(() => {
    if (prefill && prefill.text) {
      setInput(prefill.text);
      if (prefill.autoSend) {
        handleSend(prefill.text);
      }
      clearPrefill();
    }
  }, [prefill]);

  const handleSend = async (customText = '') => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await aiService.processQuery(textToSend, language, userProfile.interests);
      
      setIsTyping(false);

      const aiReply = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: result.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendations: result.recommendations
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);

    setTimeout(() => {
      setIsListening(false);
      const voicePrompts = [
        "What is happening tonight?",
        "Find a 2BHK flat under 20000",
        "Is there any Bihu puja nearby?",
        "Show me trending gigs this weekend"
      ];
      setInput(voicePrompts[Math.floor(Math.random() * voicePrompts.length)]);
    }, 2000);
  };

  const handleRecommendationClick = (rec) => {
    if (rec.cardType === 'event') {
      onQuickActionFilter({ openEventId: rec.id });
    } else {
      onQuickActionFilter({ openListingId: rec.id });
    }
    setTab('discover');
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '100px', height: '100%' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>NeighbourAI 🤖</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Local Discovery Copilot</p>
        </div>
        
        {/* Language select */}
        <div className="clay-input-container" style={{ padding: '4px 8px', borderRadius: '12px' }}>
          <Globe size={13} color="var(--deep-teal)" />
          <select 
            style={{ border: 'none', background: 'none', fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Hinglish">Hinglish</option>
            <option value="Assamese">Assamese</option>
          </select>
        </div>
      </div>

      {/* Mascot Active Orb */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div className="ai-orb-container">
          <div className="ai-orb-glow"></div>
          <div className="ai-orb"></div>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-sub)', fontWeight: '700', letterSpacing: '0.5px' }}>
          {isListening ? 'LISTENING...' : 'ASK ME WHAT\'S HAPPENING'}
        </span>
      </div>

      {/* Chat Messages */}
      <div 
        className="custom-scroll"
        style={{ 
          flex: 1, 
          minHeight: '260px', 
          maxHeight: '340px',
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '14px', 
          padding: '10px 4px'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            {/* Bubble */}
            <div 
              className="clay-card" 
              style={{ 
                maxWidth: '85%', 
                padding: '12px 16px', 
                borderRadius: '20px',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '20px',
                backgroundColor: msg.sender === 'user' ? 'var(--primary-cyan)' : '#FFFFFF',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                lineHeight: '1.5',
                textAlign: 'left'
              }}
            >
              <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
              <div style={{ fontSize: '9px', opacity: 0.5, textAlign: 'right', marginTop: '4px' }}>
                {msg.time}
              </div>
            </div>

            {/* Recommendations clickable cards inside chat */}
            {msg.sender === 'ai' && msg.recommendations && msg.recommendations.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '85%', marginTop: '8px' }}>
                {msg.recommendations.map((rec) => (
                  <div 
                    key={rec.id}
                    onClick={() => handleRecommendationClick(rec)}
                    className="clay-card clay-card-interactive"
                    style={{ 
                      padding: '8px', 
                      display: 'flex', 
                      gap: '10px', 
                      backgroundColor: '#F9FFFF', 
                      border: '1px solid rgba(22, 217, 227, 0.15)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <img src={rec.image} alt={rec.title} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <h4 style={{ fontSize: '12px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }}>
                        {rec.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '10px', color: 'var(--text-sub)' }}>
                        <span>📍 {rec.distance}</span>
                        {rec.cardType === 'event' ? (
                          <span style={{ color: 'var(--deep-teal)', fontWeight: '700' }}>⭐ {rec.neighbourScore}</span>
                        ) : (
                          <span style={{ color: 'var(--deep-teal)', fontWeight: '700' }}>₹{rec.rent}/mo</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <div className="clay-card" style={{ padding: '12px 18px', borderRadius: '20px', borderTopLeftRadius: '4px', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '14px' }}>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary-cyan)', borderRadius: '50%', animation: 'bounce 0.8s infinite alternate' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary-cyan)', borderRadius: '50%', animation: 'bounce 0.8s infinite alternate 0.2s' }}></span>
                <span className="typing-dot" style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary-cyan)', borderRadius: '50%', animation: 'bounce 0.8s infinite alternate 0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div 
        className="clay-card" 
        style={{ 
          padding: '8px 12px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          position: 'absolute', 
          bottom: '106px', 
          left: '20px', 
          right: '20px',
          zIndex: 10
        }}
      >
        <button 
          onClick={handleMicClick}
          className="clay-btn" 
          style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%', 
            padding: 0, 
            backgroundColor: isListening ? 'var(--pink)' : '#FFFFFF',
            color: isListening ? '#FFFFFF' : 'var(--text-main)',
            boxShadow: isListening ? '0 4px 10px rgba(255, 143, 207, 0.4)' : 'var(--clay-shadow-button)'
          }}
        >
          <Mic size={18} />
        </button>

        <input 
          type="text" 
          className="clay-input" 
          placeholder={isListening ? "Listening..." : "Ask NeighbourAI..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isListening}
        />

        <button 
          onClick={() => handleSend()}
          className="clay-btn clay-btn-primary" 
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
