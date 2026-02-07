import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X } from 'lucide-react';
import { getPlanningAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const QUICK_PROMPTS = [
  'What vendors do you have?',
  'Help me plan my budget',
  'Best time for a Diani wedding?',
  'How do I become a vendor?',
];

const GeminiPlanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: 'Jambo! 👋 I\'m Amari, your Diani wedding assistant. I can help you explore vendors, plan your budget, learn about our services, or answer any questions about coastal weddings in Kenya. How can I help?',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const msgText = text || inputValue.trim();
    if (!msgText) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: msgText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const responseText = await getPlanningAdvice(msgText);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const formatMessage = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <>
      {/* Trigger Button — bottom-right, above WhatsApp (which is bottom-left) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Amari AI Assistant"
          className="fixed bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-r from-amari-600 to-amari-500 text-white px-4 sm:px-5 py-3 rounded-full shadow-xl hover:shadow-2xl hover:shadow-amari-500/25 transition-all duration-300 hover:scale-105 flex items-center gap-2 animate-pulse-glow"
        >
          <Sparkles size={20} />
          <span className="font-bold text-sm hidden sm:inline">Ask Amari AI</span>
        </button>
      )}

      {/* Chat Window — full screen on mobile, floating panel on desktop */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[560px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden sm:border sm:border-stone-200 animate-in slide-in-from-bottom-5 fade-in duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-amari-700 to-amari-600 px-4 py-3 sm:py-4 flex justify-between items-center text-white flex-shrink-0 safe-bottom-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm leading-tight">Amari Assistant</h3>
                <p className="text-[10px] text-amari-200 font-medium">AI-Powered Wedding Help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50" style={{ WebkitOverflowScrolling: 'touch' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-amari-600 text-white rounded-2xl rounded-br-sm'
                      : 'bg-white border border-stone-200 text-stone-700 rounded-2xl rounded-bl-sm shadow-sm'
                  }`}
                >
                  {formatMessage(msg.text)}
                </div>
              </div>
            ))}

            {/* Quick prompts — only show at start */}
            {messages.length === 1 && !isLoading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-xs bg-white border border-amari-200 text-amari-700 px-3 py-1.5 rounded-full hover:bg-amari-50 hover:border-amari-300 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-amari-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-amari-400 rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
                    <div className="w-2 h-2 bg-amari-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 sm:p-4 bg-white border-t border-stone-100 flex-shrink-0 safe-bottom">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask anything about Amari..."
                className="flex-1 border border-stone-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amari-400 focus:border-amari-400 bg-stone-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
                className="bg-amari-600 text-white w-10 h-10 rounded-full hover:bg-amari-500 disabled:opacity-40 disabled:hover:bg-amari-600 flex items-center justify-center transition flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiPlanner;
