import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, X, User, Trash2, ArrowUp } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useTravel } from '../../context/TravelContext';
import logoImg from '../../assets/tourism_logo.png';

export default function ChatWidget() {
  const { chatOpen, setChatOpen, toggleChat } = useTravel();
  const location = useLocation();

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('angkor_travel_chat_msgs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
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
    ];
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
  const chatContainerRef = useRef(null);
  const toggleButtonRef = useRef(null);

  // Automatically close chat on route/page change without altering chat messages
  useEffect(() => {
    if (chatOpen && setChatOpen) {
      setChatOpen(false);
    }
  }, [location.pathname]);

  // Close chat when clicking outside the chat window or button
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!chatOpen) return;
      if (
        chatContainerRef.current &&
        !chatContainerRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        if (setChatOpen) setChatOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [chatOpen, setChatOpen]);

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

  // Focus and scroll when chat opens
  useEffect(() => {
    if (chatOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [chatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendPrompt = async (textToSend) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || loading) return;

    setInputMessage('');
    const nowISO = new Date().toISOString();
    const userMsg = {
      id: `usr_${crypto.randomUUID()}`,
      sender: 'user',
      message: text,
      created_at: nowISO,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatService.sendAiMessage(text, sessionId);
      const answer = res?.data?.answer || res?.data?.data?.answer || res?.message || 'Thank you! Let me know what else you would like to know about Cambodia.';
      const suggestions = res?.data?.suggestions || res?.data?.data?.suggestions || [];
      const respISO = new Date().toISOString();

      const botMsg = {
        id: `bot_${crypto.randomUUID()}`,
        sender: 'assistant',
        message: answer,
        suggestions: Array.isArray(suggestions) ? suggestions : [],
        created_at: respISO,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errISO = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${crypto.randomUUID()}`,
          sender: 'assistant',
          message: '⚠️ Angkor Verse AI is currently syncing. You can explore destinations, temples, and festival guides in the menu above!',
          created_at: errISO,
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
      {/* Floating Action Button */}
      <button
        ref={toggleButtonRef}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#003E83] hover:bg-[#002e62] text-white shadow-md flex items-center justify-center transition-all duration-200 cursor-pointer"
        title="Angkor Verse AI Guide"
        aria-label="Open AI Travel Chat"
      >
        {chatOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageSquare className="w-5 h-5" />
        )}
      </button>

      {/* Floating Chat Window Modal */}
      {chatOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-20 right-4 sm:right-6 left-4 sm:left-auto z-50 w-auto sm:w-[440px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-6rem)] bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col transition-all duration-200 animate-in fade-in zoom-in-95"
        >

          {/* Header */}
          <div className="px-4 py-3 bg-[#003E83] text-white flex items-center justify-between border-b border-[#002e62] shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8.5 h-8.5 rounded-md overflow-hidden bg-white flex items-center justify-center shrink-0 border border-gray-200">
                <img
                  src={logoImg}
                  alt="Angkor Verse Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold leading-none tracking-tight">Angkor Verse AI Guide</h4>
                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Online
                  </span>
                </div>
                <span className="text-[10px] text-blue-100 block mt-0.5">
                  AI Tourism Assistant
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                title="Clear Conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-gray-50 dark:bg-zinc-950">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex gap-2.5 max-w-[88%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div
                      className={`w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 text-xs mt-0.5 overflow-hidden ${isUser
                        ? 'bg-[#003E83] text-white'
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
                      className={`p-3.5 rounded-lg text-xs leading-relaxed ${isUser
                        ? 'bg-[#003E83] text-white'
                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 shadow-xs'
                        }`}
                    >
                      <div>{renderFormattedText(m.message)}</div>

                      {/* Suggestions list under bot message */}
                      {!isUser && m.suggestions && m.suggestions.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-100 dark:border-zinc-700 flex flex-wrap gap-1.5">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendPrompt(sug)}
                              className="text-[11px] px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:text-[#003E83] dark:hover:text-blue-300 transition-colors text-left border border-gray-200 dark:border-zinc-600 cursor-pointer"
                            >
                              💡 {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 dark:text-zinc-500 mt-1 px-9 font-medium">
                    {formatTime(m.created_at)}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 pl-2">
                <div className="w-7.5 h-7.5 rounded-full bg-white border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                  <img src={logoImg} alt="AI" className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="px-3.5 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003E83] dark:bg-[#60a5fa] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003E83] dark:bg-[#60a5fa] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#003E83] dark:bg-[#60a5fa] animate-bounce [animation-delay:0.4s]"></span>
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
            className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 shrink-0"
          >
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md focus-within:border-[#003E83] dark:focus-within:border-[#60a5fa] transition-all">
              <input
                ref={inputRef}
                type="text"
                placeholder="Ask something about Cambodia..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-transparent text-gray-900 dark:text-white text-xs focus:outline-none placeholder-gray-400 dark:placeholder-zinc-500 py-1"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || loading}
                className="w-7 h-7 rounded bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-xs"
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
