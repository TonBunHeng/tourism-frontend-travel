import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2, Sparkles, Plus, ArrowUp } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useTravel } from '../../context/TravelContext';
import logoImg from '../../assets/tourism_logo.png';

export default function ChatWidget() {
  const { chatOpen, setChatOpen, toggleChat } = useTravel();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('angkor_travel_chat_msgs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('angkor_chat_session_id');
    if (!id) {
      id = 'tourist_' + Math.random().toString(36).substring(2, 10);
      localStorage.setItem('angkor_chat_session_id', id);
    }
    return id;
  });

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Helper to format timestamps to current locale 12h time
  const formatTime = (timeVal) => {
    try {
      const d = timeVal ? new Date(timeVal) : new Date();
      if (isNaN(d.getTime())) return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
      return d.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  };

  // Initialize welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          message: '🙏 **Choum Reap Sour!** Welcome to AngkorVerses AI Guide.\n\nI can help you explore Angkor temples, plan day-by-day itineraries, check live weather, convert currency, and recommend top local spots.',
          suggestions: [
            '🏛️ Top temples in Angkor',
            '☀️ Siem Reap weather',
            '🗓️ 3-day travel plan',
            '💱 100 USD to KHR',
          ],
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  // Save to session storage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('angkor_travel_chat_msgs', JSON.stringify(messages));
      } catch (e) {
        console.warn('Could not save chat history', e);
      }
    }
  }, [messages]);

  // Refresh single welcome message timestamp to real current time when opening chat
  useEffect(() => {
    if (chatOpen) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].sender === 'assistant') {
          return [{ ...prev[0], created_at: new Date().toISOString() }];
        }
        return prev;
      });

      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendPrompt = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      message: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatService.sendAiMessage(text, sessionId);
      const answer = res?.data?.answer || res?.data?.data?.answer || res?.message || 'Thank you! Let me know what else you would like to know about Cambodia.';
      const suggestions = res?.data?.suggestions || res?.data?.data?.suggestions || [];

      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        message: answer,
        suggestions: Array.isArray(suggestions) ? suggestions : [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          message: '⚠️ Angkor Verse AI is currently syncing. You can explore destinations, temples, and festival guides in the menu above!',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const freshWelcome = [
      {
        id: `welcome_${Date.now()}`,
        sender: 'assistant',
        message: '🧹 Conversation reset. How can I assist your Cambodia journey today?',
        suggestions: [
          '🏛️ Top temples in Angkor',
          '☀️ Siem Reap weather',
          '🗓️ 3-day travel plan',
        ],
        created_at: new Date().toISOString(),
      },
    ];
    setMessages(freshWelcome);
    sessionStorage.removeItem('angkor_travel_chat_msgs');
  };

  // Helper to format simple markdown (bold, lists, breaks)
  const renderFormattedText = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-blue-600 dark:text-blue-400">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={i} className="ml-4 list-disc my-0.5 leading-relaxed">
            {renderedLine}
          </li>
        );
      }

      return (
        <span key={i} className="block leading-relaxed min-h-[1.1rem]">
          {renderedLine}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button (Matches Screenshot) */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-blue-500/30"
        title="Angkor Verse AI Guide"
        aria-label="Open AI Travel Chat"
      >
        {chatOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <MessageSquare className="w-6 h-6 stroke-[2]" />
        )}
      </button>

      {/* Floating Chat Window Modal */}
      {chatOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 left-4 sm:left-auto z-50 w-auto sm:w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7rem)] bg-white dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95">

          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#003E83] to-[#1d4ed8] dark:from-zinc-900 dark:to-zinc-800 text-white flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shadow-md flex items-center justify-center shrink-0 border border-white/30">
                <img
                  src={logoImg}
                  alt="Angkor Verse Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold leading-none tracking-tight">Angkor Verse AI Guide</h4>
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-blue-100/70 dark:text-zinc-400 block mt-0.5">
                  Powered by Angkor Verse AI Tourism Engine
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Clear Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-gray-50/50 dark:bg-zinc-950/80">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex gap-2 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5 overflow-hidden ${isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-white shadow-xs border border-gray-200 dark:border-zinc-700'
                        }`}
                    >
                      {isUser ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <img src={logoImg} alt="AI" className="w-full h-full object-cover rounded-full" />
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-2xl text-[12.5px] leading-relaxed shadow-2xs ${isUser
                        ? 'bg-[#3b82f6] text-white rounded-tr-xs'
                        : 'bg-white dark:bg-zinc-800/90 text-gray-800 dark:text-zinc-100 border border-gray-200/80 dark:border-zinc-700/60 rounded-tl-xs'
                        }`}
                    >
                      <div>{renderFormattedText(m.message)}</div>

                      {/* Suggestions list under bot message */}
                      {!isUser && m.suggestions && m.suggestions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 dark:border-zinc-700/60 flex flex-wrap gap-1.5">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendPrompt(sug)}
                              className="text-[11px] px-2 py-0.5 rounded-lg bg-gray-100 dark:bg-zinc-700/70 text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-blue-600 dark:hover:text-blue-300 transition-colors text-left"
                            >
                              💡 {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 px-8 font-medium">
                    {formatTime(m.created_at)}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 pl-2">
                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <img src={logoImg} alt="AI" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="p-3 bg-white dark:bg-[#18181b] border-t border-gray-100 dark:border-zinc-800/80 shrink-0"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100/90 dark:bg-[#27272a] border border-gray-200 dark:border-zinc-700/60 rounded-full focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-all shadow-inner">
              <button
                type="button"
                onClick={() => {
                  inputRef.current?.focus();
                }}
                className="text-gray-400 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors p-0.5 rounded-full shrink-0 cursor-pointer"
                title="New prompt"
              >
                <Plus className="w-4 h-4 stroke-[2]" />
              </button>

              <input
                ref={inputRef}
                type="text"
                placeholder="Ask something about Cambodia."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-xs sm:text-[13px] focus:outline-none placeholder-gray-400 dark:placeholder-zinc-400 py-1"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:hover:bg-[#2563eb] text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shrink-0 shadow-sm"
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </form>

        </div>
      )}
    </>
  );
}
