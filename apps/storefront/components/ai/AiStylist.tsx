import { useState, useRef, useEffect } from 'react';
import { RotateCcw, X, Sparkles, Send } from 'lucide-react';

interface AiStylistProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'assistant' | 'user';
  text: string;
}

export function AiStylist({ isOpen, onClose }: AiStylistProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Welcome to the AETHER Atelier. I am your material engineer and personal styling concierge. Ask me anything regarding our 450GSM French Terry drape, boxy drop-shoulder sizing for your height/weight, or curated streetwear pairings.'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue.trim();
    const currentMessages = [...messages];
    
    setMessages([...currentMessages, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Format history for Gemini API
      const history = currentMessages
        .filter(m => m.text !== 'Welcome to the AETHER Atelier. I am your material engineer and personal styling concierge. Ask me anything regarding our 450GSM French Terry drape, boxy drop-shoulder sizing for your height/weight, or curated streetwear pairings.')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg, history }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch response');
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: data.text }
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Systems are currently experiencing high load. Please ensure your GEMINI_API_KEY is configured in the environment variables." }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: 'Conversation reset. How can I assist with your 450GSM sizing, pairing recommendations, or garment specifications?'
      }
    ]);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-40 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div 
        className={`fixed top-0 right-0 w-full sm:w-[440px] max-w-full h-full z-50 glass-panel border-l border-white/10 flex flex-col justify-between transform transition-transform duration-300 shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-obsidian-surface/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-burgundy-accent via-burgundy-bright to-black flex items-center justify-center font-display font-black text-sm text-white shadow-lg shadow-burgundy-accent/40 border border-burgundy-bright/40">
              Æ
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold font-display text-white text-sm tracking-wider">AETHER CONCIERGE</h3>
                <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[8px] font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                  <span>LIVE</span>
                </span>
              </div>
              <p className="text-[10px] font-mono text-gray-400 mt-0.5">Styling, Sizing & Material Consultant</p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button onClick={clearChat} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors" title="Clear Conversation">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors" title="Close Assistant">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Suggestions */}
        <div className="p-3 border-b border-white/10 bg-black/40 overflow-x-auto custom-scrollbar">
          <div className="flex items-center space-x-2 whitespace-nowrap text-[11px] font-mono">
            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">ASK:</span>
            <button onClick={() => setInputValue('What size should I choose for a 180cm / 75kg boxy oversized fit?')} className="px-2.5 py-1 rounded-lg glass-btn text-gray-300 hover:text-white hover:border-burgundy-bright/60 transition-all">📏 Size recommendation</button>
            <button onClick={() => setInputValue('How should I style the Burgundy Heavyweight hoodie for Autumn/Winter?')} className="px-2.5 py-1 rounded-lg glass-btn text-gray-300 hover:text-white hover:border-burgundy-bright/60 transition-all">👕 Outfit pairings</button>
          </div>
        </div>

        {/* Chat Conversation Messages Feed */}
        <div ref={feedRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-display font-bold text-xs ${isUser ? 'bg-burgundy-bright text-white' : 'bg-black border border-burgundy-bright/40 text-burgundy-bright'}`}>
                  {isUser ? 'YOU' : 'Æ'}
                </div>
                <div className={`max-w-[85%] rounded-2xl p-3 sm:p-3.5 text-xs font-mono leading-relaxed ${isUser ? 'bg-burgundy-900/60 border border-burgundy-bright/40 text-white rounded-tr-none' : 'glass-panel border border-white/10 text-gray-200 rounded-tl-none'}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-2.5">
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center font-display font-bold text-xs bg-black border border-burgundy-bright/40 text-burgundy-bright">
                Æ
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-black/40 p-2.5 rounded-xl border border-white/10 w-fit rounded-tl-none">
                <Sparkles className="w-3.5 h-3.5 text-burgundy-bright animate-spin" />
                <span className="text-[11px]">Atelier Stylist is analyzing...</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-bright animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-bright animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-burgundy-bright animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Footer */}
        <div className="p-4 border-t border-white/10 bg-obsidian-surface/90 space-y-2">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about sizing, drape, outfit pairings..." 
              className="w-full bg-black/70 border border-white/15 focus:border-burgundy-bright rounded-xl pl-3.5 pr-11 py-3 text-xs font-mono text-white placeholder-gray-500 focus:outline-none transition-colors"
            />
            <button type="submit" className="absolute right-2 p-2 bg-burgundy-bright hover:bg-red-600 text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 px-1">
            <span>POWERED BY GEMINI 3 FLASH</span>
            <span>AETHER DIGITAL ATELIER</span>
          </div>
        </div>
      </div>
    </>
  );
}
