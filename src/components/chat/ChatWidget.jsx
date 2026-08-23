import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { useTravel } from '../../context/TravelContext';

export default function ChatWidget() {
  const { isChatOpen, toggleChat } = useTravel();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      loadHistory();
    }
  }, [isChatOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadHistory = async () => {
    try {
      const res = await chatService.getMessages();
      if (res?.data && res.data.length > 0) {
        setMessages(res.data);
      } else {
        setMessages([
          {
            id: 'welcome',
            sender: 'bot',
            message: 'Hello! I am your AngkorVerses Travel Assistant. How can I help with your Cambodia itinerary today?',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          message: 'Hello! I am your AngkorVerses Travel Assistant. How can I help with your Cambodia itinerary today?',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      message: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      const res = await chatService.sendMessage(userText);
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: 'bot',
            message: 'Thank you for your question! For official ticket reservations or tour guide arrangements, please check our Destinations tab.',
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          message: 'I can assist you with temple schedules, province guides, and festival dates. Let me know what you need!',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white shadow-lg flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
        title="Live Travel Assistant"
      >
        {isChatOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
      </button>

      {/* Slide-in Chat Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-18 sm:bottom-22 right-3 sm:right-6 left-3 sm:left-auto z-40 w-auto sm:w-96 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-zinc-900 rounded-lg shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden flex flex-col h-[80vh] max-h-[480px] sm:h-[480px] zoom-in transition-colors">
          
          {/* Header */}
          <div className="px-4 py-3 bg-[#003E83] dark:bg-zinc-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">Travel Assistant</h4>
                <span className="text-[10px] text-blue-200 dark:text-zinc-400 block">Always Online</span>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-gray-50 dark:bg-zinc-950">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full bg-[#003E83] dark:bg-[#60a5fa] text-white dark:text-zinc-950 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] p-2.5 rounded-lg leading-relaxed ${
                      isUser
                        ? 'bg-[#003E83] dark:bg-[#60a5fa] dark:text-zinc-950 text-white rounded-br-none'
                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-100 border border-gray-200 dark:border-zinc-700 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p>{m.message}</p>
                  </div>

                  {isUser && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-center gap-1.5 text-gray-400 text-xs pl-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSend} className="p-2.5 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white text-xs rounded-md border border-gray-200 dark:border-zinc-700 focus:outline-none focus:border-[#003E83] dark:focus:border-[#60a5fa]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="px-3 py-1.5 bg-[#003E83] hover:bg-[#002e62] dark:bg-[#60a5fa] dark:hover:bg-[#3b82f6] dark:text-zinc-950 text-white rounded-md transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
