import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '../../utils/formatters.js';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickPrompts = [
    'Is cash on delivery available in my district?',
    'What is the delivery time inside Dhaka?',
    'Do you have official warranty on Anker / Soundcore?',
    'I want to inquire about bulk ordering.',
  ];

  const handleSend = (text: string) => {
    const url = getWhatsAppLink('01864015928', text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-[#101828] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold font-display">Akash Telecom Care</div>
                <div className="text-[11px] text-emerald-400 font-medium">WhatsApp Support (+8801864015928)</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick FAQ / Presets */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 text-xs text-slate-600 space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Quick WhatsApp Questions:</span>
            </div>
            <div className="space-y-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-medium border border-slate-200/80 transition-colors shadow-2xs"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="p-3 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customMsg.trim()) handleSend(customMsg);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900"
              />
              <button
                type="submit"
                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition-colors"
                title="Send via WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Pill / Circle Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Open WhatsApp Chat with Akash Telecom"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp Help</span>
      </button>
    </div>
  );
};
