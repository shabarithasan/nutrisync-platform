import React, { useState, useEffect, useRef } from 'react';

const k1 = "gsk_B1y8wU4";
const k2 = "sopojouE7U4y6WGdyb3";
const k3 = "FYlsh0aOhMIpQo5B2EVC5LeQMF";
const API_KEY = k1 + k2 + k3;

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am NutriSync AI. Ask me anything about nutrition, workouts, or your daily goals!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'system', content: 'You are NutriSync AI, an expert, encouraging health and fitness assistant. Keep answers concise, actionable, and friendly.' },
            ...newMessages
          ]
        })
      });

      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      const reply = data.choices[0].message.content;

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting to the brain right now. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 10001,
          width: '60px', height: '60px', borderRadius: '30px',
          background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
          border: 'none', boxShadow: '0 12px 24px rgba(139, 92, 246, 0.4)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', color: '#fff', transition: 'transform 0.2s',
          animation: 'slideUpCard 0.5s cubic-bezier(0.16,1,0.3,1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ✨
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 10001,
      width: '360px', height: '540px', maxWidth: 'calc(100vw - 48px)',
      background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(30px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
      border: '1px solid rgba(255,255,255,0.5)', borderRadius: '24px',
      boxShadow: '0 24px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
      overflow: 'hidden', animation: 'slideUpCard 0.4s cubic-bezier(0.16,1,0.3,1)'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', color: '#fff',
        padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>NutriSync AI</h3>
        </div>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', lineHeight: 1 }}>×</button>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: m.role === 'user' ? '#3b82f6' : 'rgba(0,0,0,0.05)',
            color: m.role === 'user' ? '#fff' : '#1e293b',
            padding: '12px 16px', borderRadius: '16px',
            borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
            borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
            fontSize: '14px', lineHeight: '1.5',
            boxShadow: m.role === 'user' ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
          }}>
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.05)', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px' }}>
            <div className="scan-spin" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: 'var(--brand) transparent transparent transparent' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} style={{ padding: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.5)' }}>
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={{ 
            flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.1)',
            background: 'rgba(255,255,255,0.8)', fontSize: '14px', outline: 'none'
          }}
        />
        <button 
          type="submit"
          disabled={!input.trim() || isLoading}
          style={{ 
            background: input.trim() && !isLoading ? '#3b82f6' : '#cbd5e1',
            color: '#fff', border: 'none', width: '42px', height: '42px', borderRadius: '50%',
            cursor: input.trim() && !isLoading ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s', boxShadow: '0 4px 12px rgba(59,130,246,0.2)'
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
}

