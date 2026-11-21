import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  Building,
  RotateCcw,
  Scale,
  ArrowRight,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  content: string;
  citations?: Array<{
    type: string;
    supplier_code?: string;
    supplier_name?: string;
    severity?: string;
    title?: string;
    metric?: string;
  }>;
  followups?: string[];
  timestamp: string;
}

export const SustainabilityCopilot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'copilot',
      content: `### Welcome to CarbonTrack Intelligence Copilot 👋

I am your AI sustainability auditor and supplier fairness advisor. I analyze live telemetry, calculate GHG Protocol Scope 1–3 emissions, and detect systemic evaluation bias in supply chains.

You can ask me specific questions about your portfolio, such as:
- **"Which supplier has the highest emission intensity?"**
- **"Why was Supplier S-102 flagged?"**
- **"Which small suppliers may be unfairly evaluated?"**
- **"What happens if we change transportation from road to rail?"**
- **"Show the top five carbon hotspots."**
- **"Explain the fairness score methodology."**

How can I assist your sustainability audit today?`,
      followups: [
        'Which supplier has the highest emission intensity?',
        'Why was Supplier S-102 flagged?',
        'Which small suppliers may be unfairly evaluated?',
        'What happens if we change transportation from road to rail?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const handleSend = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q || thinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setThinking(true);

    try {
      const res = await api.chatWithCopilot(q);
      const copilotMsg: ChatMessage = {
        id: `copilot-${Date.now()}`,
        sender: 'copilot',
        content: res.answer,
        citations: res.evidence_citations,
        followups: res.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          content: `I encountered an error querying the dataset: ${err.message}. Please verify the database connection or load the demo dataset.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  const starterChips = [
    'Highest emission intensity',
    'Why was S-102 flagged?',
    'Unfairly evaluated small suppliers',
    'Road to rail what-if impact',
    'Top 5 carbon hotspots',
    'Explain FAIRScore methodology'
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Copilot Header */}
      <div className="pb-3 border-b border-charcoal-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-800 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <BotMessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>CarbonTrack Intelligence</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">
                Data-Grounded Copilot
              </span>
            </h1>
            <p className="text-xs text-charcoal-400">
              Answers grounded exclusively in active supply chain telemetry, GHG calculators, and ProofChain audit evidence.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages([messages[0]])}
          className="text-xs text-charcoal-400 hover:text-white flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-charcoal-800 border border-charcoal-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-charcoal-500 text-[11px] shrink-0">Try asking:</span>
        {starterChips.map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-charcoal-850 hover:bg-forest-900/60 text-charcoal-300 hover:text-emerald-300 border border-charcoal-750 shrink-0 transition-colors text-[11px]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Messages Timeline */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 rounded-2xl bg-charcoal-900/60 border border-charcoal-800">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-forest-800 text-emerald-300 border border-emerald-600/50'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-charcoal-850 border border-charcoal-750 text-charcoal-200 rounded-tl-none shadow-sm'
              }`}
            >
              {/* Message Content formatted */}
              <div className="prose prose-invert prose-xs max-w-none space-y-2 whitespace-pre-wrap font-sans">
                {m.content}
              </div>

              {/* Citations Box */}
              {m.citations && m.citations.length > 0 && (
                <div className="p-3 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-1.5 pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Evidence Citations ({m.citations.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {m.citations.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono bg-charcoal-800 px-2 py-0.5 rounded text-charcoal-300 border border-charcoal-700"
                      >
                        {c.supplier_code && `${c.supplier_code} • `}
                        {c.supplier_name || c.title || c.type}
                        {c.metric && ` (${c.metric})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Followup Question Pills */}
              {m.followups && m.followups.length > 0 && (
                <div className="pt-2 border-t border-charcoal-800/80 space-y-1.5">
                  <span className="text-[10px] font-medium text-charcoal-400">Suggested Follow-ups:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.followups.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(f)}
                        className="text-[11px] text-emerald-300 hover:text-white bg-forest-950/80 hover:bg-forest-900 px-2.5 py-1 rounded-lg border border-emerald-800/60 transition-colors flex items-center gap-1"
                      >
                        <span>{f}</span>
                        <ArrowRight className="w-3 h-3 text-emerald-500" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-[10px] text-charcoal-500 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-forest-800 text-emerald-300 border border-emerald-600/50 flex items-center justify-center text-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-charcoal-850 border border-charcoal-750 p-4 rounded-2xl rounded-tl-none text-xs text-charcoal-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Querying GHG calculation models and statistical fairness distributions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about high-emission suppliers, fairness disparities, or Scope 3 reductions..."
            className="w-full bg-charcoal-850 border border-charcoal-750 rounded-xl px-4 py-3 text-xs text-white placeholder-charcoal-500 focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>
        <button
          type="submit"
          disabled={!inputQuery.trim() || thinking}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
