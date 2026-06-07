import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, Send, Trash2, HelpCircle, Code, BookOpen, 
  Terminal, RefreshCw, Bot, User, CornerDownLeft
} from "lucide-react";
import { ChatMessage } from "../types";

export default function AiAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const cached = localStorage.getItem("codemaster_buddy_chat");
    return cached ? JSON.parse(cached) : [
      {
        id: "m0",
        role: "model",
        text: "Salutations! I am Master AI, your senior compiler mentor. Ask me any conceptual algorithmic logic questions, ask for live code debugging guides, or click any templates below to begin!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCodeContext, setActiveCodeContext] = useState("");
  const [activeLang, setActiveLang] = useState("javascript");
  
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("codemaster_buddy_chat", JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendPrompt = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      codeContext: activeCodeContext.trim() || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const apiBody = {
      message: messageText,
      codeContext: activeCodeContext.trim() || undefined,
      language: activeLang,
      // Map back to expected types for backend
      history: messages.map(msg => ({
        role: msg.role === "model" ? "model" as const : "user" as const,
        text: msg.text
      }))
    };

    try {
      const response = await fetch("/api/codemaster/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiBody)
      });
      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.reply || "I encountered a routing timing error. Send again.",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: "model",
        text: "Compiler Sandbox Alert: Connected smoothly to Sandbox fallback. Set your GEMINI_API_KEY in secrets to trigger dynamic LLM assistance!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: "m0",
        role: "model",
        text: "Clean compile completed. Prompt me with any questions or code tasks below!",
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Preset instructions helper
  const promptPresets = [
    { title: "Explain Recursion", text: "Explain Recursion in Python visually with an eye-safe example." },
    { title: "React state lag", text: "Why is React state asynchronous and how do I log it immediately?" },
    { title: "What is Big-O?", text: "What is Big-O Notation and how do I calculate Space Complexity?" }
  ];

  return (
    <div className="space-y-4 animate-fade-in font-sans h-full flex flex-col flex-1 min-h-0">
      
      {/* Top Banner section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-slate-905 text-sm leading-none">Gemini Senior Mentor Advisor</h1>
            <span className="text-[10px] text-slate-450 mt-1 font-mono uppercase">Full-Stack LLM Assistant active</span>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="text-xs text-slate-450 hover:text-red-500 font-bold p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer select-none"
          title="Reset chat memory buffers"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 h-full min-h-0 overflow-hidden">
        
        {/* Left column (Preset tips & active context bindings) */}
        <div className="space-y-4 lg:col-span-1 flex flex-col min-h-0">
          
          {/* Preset Buttons */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shrink-0">
            <span className="text-[10px] font-bold font-mono text-slate-450 tracking-wider uppercase block">PRESET QUERIES</span>
            <div className="grid grid-cols-1 gap-2">
              {promptPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(preset.text)}
                  disabled={loading}
                  className="w-full text-left p-2.5 bg-slate-50 hover:bg-indigo-50/50 hover:text-indigo-950 border border-slate-150 hover:border-indigo-150 rounded-xl text-[11px] leading-relaxed transition-all text-slate-655 font-medium"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Code Bindings for LLM feedback */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col flex-1 min-h-[160px]">
            <span className="text-[10px] font-bold font-mono text-slate-455 tracking-wider uppercase block shrink-0">CODE CONTEXT ATTACHMENT</span>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed pl-0.5 shrink-0">Paste code here to ask specific debugger explanations.</p>
            
            <div className="mt-3 flex-grow flex flex-col min-h-0">
              <textarea
                value={activeCodeContext}
                onChange={(e) => setActiveCodeContext(e.target.value)}
                placeholder="Paste buggy loop blocks here..."
                className="w-full flex-grow p-3 border border-slate-200 bg-slate-50 rounded-xl font-mono text-[10px] resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
              />
              
              <div className="mt-2.5 flex items-center justify-between select-none">
                <select
                  value={activeLang}
                  onChange={(e) => setActiveLang(e.target.value)}
                  className="p-1 px-2 border border-slate-200 bg-white text-[10px] rounded-md font-mono"
                >
                  <option value="javascript">JS</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                </select>
                <span className="text-[9px] font-mono text-slate-400">Context active</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right main column (Chat dialog stream) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl flex flex-col h-full min-h-0 overflow-hidden shadow-sm">
          
          {/* Messages Stream Wrapper */}
          <div className="flex-grow overflow-y-auto p-4 md:p-5 space-y-4 max-h-[500px]">
            {messages.map((msg) => {
              const isBot = msg.role === "model";

              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}
                >
                  {/* Round Avatar icon */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border shadow-sm ${
                    isBot ? "bg-indigo-50 text-indigo-600 border-indigo-150" : "bg-slate-900 text-white border-slate-950"
                  }`}>
                    {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Bubble content */}
                  <div className="space-y-1">
                    <div className={`p-4 rounded-2xl ${
                      isBot 
                      ? "bg-slate-50 border border-slate-150 text-slate-800 text-xs leading-relaxed" 
                      : "bg-indigo-600 text-white text-xs leading-relaxed"
                    }`}>
                      {/* Code context badge attachment visualization inside bubble */}
                      {msg.codeContext && (
                        <div className={`p-2.5 rounded-lg font-mono text-[10px] mb-2.5 border text-left flex items-center gap-1.5 leading-tight ${
                          isBot ? "bg-indigo-50/55 text-indigo-750 border-indigo-150" : "bg-indigo-950/20 border-indigo-400/10 text-indigo-100"
                        }`}>
                          <Code className="w-3.5 h-3.5" />
                          <span>Code snippet binds attached</span>
                        </div>
                      )}
                      
                      {/* Splitting standard markdown headers or code block formatting manually for clean rendering */}
                      <div className="whitespace-pre-line font-medium leading-relaxed font-sans">{msg.text}</div>
                    </div>
                    
                    {/* Timestamp mark */}
                    <span className="text-[9px] text-slate-400 font-mono block px-1">{msg.timestamp}</span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto text-left animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-150 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-450 italic flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                    <span>Gemini compile active...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Typing box entry row */}
          <div className="p-4 border-t border-slate-150 bg-slate-50 flex items-center gap-3 shrink-0 select-none">
            <div className="relative flex-grow flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(input)}
                placeholder="Ask algorithms debugging limits (e.g. explain variables)..."
                disabled={loading}
                className="w-full bg-white border border-slate-255 rounded-xl pl-4 pr-12 py-3 text-xs text-slate-755 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800"
              />
              <span className="absolute right-3.5 text-[9px] text-slate-400 font-mono flex items-center gap-1 border border-slate-200 rounded bg-slate-50 px-1 py-0.5">
                <span>Enter</span> <CornerDownLeft className="w-2.5 h-2.5" />
              </span>
            </div>

            <button
              onClick={() => handleSendPrompt(input)}
              disabled={loading || !input.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
