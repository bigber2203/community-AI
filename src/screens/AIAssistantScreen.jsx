import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Globe, Check, AlertCircle, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { aiService } from '../services/aiService';
import { ticketService } from '../services/ticketService';

export default function AIAssistantScreen({ prefill, clearPrefill, setTab, onTicketCreated }) {
  const [messages, setMessages] = useState([
    {
      id: 'msg-init-01',
      sender: 'ai',
      text: "Hi! I'm NeighbourAI. Ask me anything about your home, community, or neighbourhood. 🏡\n\nTry asking about gym timings, report a water leakage, or request a plumber!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      verified: true
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('English');
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle pre-filled search queries from HomeScreen
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
      // Process with AI Service
      const result = await aiService.processQuery(textToSend, language);
      
      setIsTyping(false);

      // Add AI reply
      const aiReply = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: result.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        verified: result.verified,
        ruleRef: result.ruleRef,
        routeToTab: result.routeToTab,
        searchFilter: result.searchFilter
      };

      setMessages(prev => [...prev, aiReply]);

      // If a ticket was created
      if (result.ticketCreated && result.ticketDetails) {
        const newTicket = await ticketService.createTicket(result.ticketDetails);
        onTicketCreated(newTicket);
      }

    } catch (error) {
      console.error(error);
      setIsTyping(false);
    }
  };

  const handleMicClick = () => {
    if (isListening) return;
    setIsListening(true);
    
    // Simulate voice capture
    setTimeout(() => {
      setIsListening(false);
      const voicePrompts = [
        "Is pets allowed in the central garden?",
        "Street light near Block B is broken",
        "Book a laundry pickup from Express laundry",
        "Can guests use the swimming pool?"
      ];
      const randomPrompt = voicePrompts[Math.floor(Math.random() * voicePrompts.length)];
      setInput(randomPrompt);
    }, 2000);
  };

  return (
    <div className="screen-content" style={{ paddingBottom: '100px', height: '100%' }}>
      
      {/* Top Header & Language Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>NeighbourAI 🤖</h2>
          <p style={{ fontSize: '11px', color: 'var(--text-sub)' }}>Your community assistant</p>
        </div>
        
        {/* Language selector chip */}
        <div className="clay-input-container" style={{ padding: '4px 8px', borderRadius: '12px', boxShadow: '2px 2px 6px rgba(8,127,140,0.05)' }}>
          <Globe size={13} color="var(--deep-teal)" />
          <select 
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '11px', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}
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

      {/* Mascot Section */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div className="ai-orb-container">
          <div className="ai-orb-glow"></div>
          <div className="ai-orb"></div>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: '600', letterSpacing: '0.5px' }}>
          {isListening ? 'LISTENING TO YOU...' : 'NEIGHBOURAI ACTIVE'}
        </span>
      </div>

      {/* Chat Messages Panel */}
      <div 
        className="custom-scroll"
        style={{ 
          flex: 1, 
          minHeight: '260px', 
          maxHeight: '340px',
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px', 
          padding: '10px 4px'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              display: 'flex', 
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div 
              className="clay-card" 
              style={{ 
                maxWidth: '85%', 
                padding: '12px 16px', 
                borderRadius: '20px',
                borderTopRightRadius: msg.sender === 'user' ? '4px' : '20px',
                borderTopLeftRadius: msg.sender === 'ai' ? '4px' : '20px',
                backgroundColor: msg.sender === 'user' ? 'var(--primary-cyan)' : '#FFFFFF',
                boxShadow: msg.sender === 'user' 
                  ? '4px 4px 8px rgba(22, 217, 227, 0.2), inset 2px 2px 4px rgba(255,255,255,0.4), inset -2px -2px 4px rgba(8,127,140,0.1)' 
                  : 'var(--clay-shadow-card)',
                color: 'var(--text-main)',
                fontSize: '13.5px',
                lineHeight: '1.5'
              }}
            >
              {/* Text Body */}
              <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
              
              {/* Extra Details (Rulebook Verification Badge) */}
              {msg.verified && msg.sender === 'ai' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: 'var(--deep-teal)', fontWeight: '700', marginTop: '8px', padding: '4px 6px', background: 'var(--bg-light)', borderRadius: '8px' }}>
                  <Check size={10} strokeWidth={3} />
                  Verified Community Info
                  {msg.ruleRef && <span style={{ opacity: 0.6, marginLeft: 'auto' }}>{msg.ruleRef}</span>}
                </div>
              )}

              {/* Service redirect chip */}
              {msg.routeToTab && (
                <button
                  onClick={() => setTab(msg.routeToTab)}
                  className="clay-btn"
                  style={{
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    backgroundColor: 'var(--purple)',
                    color: '#FFFFFF',
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: 'none',
                    width: 'fit-content'
                  }}
                >
                  Go to Services
                  <ArrowUpRight size={10} />
                </button>
              )}

              {/* Time stamp */}
              <div style={{ fontSize: '9px', opacity: 0.5, textAlign: 'right', marginTop: '4px' }}>
                {msg.time}
              </div>
            </div>
          </div>
        ))}

        {/* Typing skeleton */}
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

      {/* Interactive Input Bar */}
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
        {/* Mic trigger */}
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

        {/* Input */}
        <input 
          type="text" 
          className="clay-input" 
          placeholder={isListening ? "Listening..." : "Ask NeighbourAI..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isListening}
        />

        {/* Send button */}
        <button 
          onClick={() => handleSend()}
          className="clay-btn clay-btn-primary" 
          style={{ width: '42px', height: '42px', borderRadius: '50%', padding: 0 }}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </button>
      </div>

      {/* Simple styling injection for typing skeleton */}
      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
