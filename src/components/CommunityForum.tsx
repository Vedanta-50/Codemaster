import React, { useState, useEffect } from "react";
import { 
  Users, MessageSquare, Heart, Share2, Search, Filter, 
  Send, CornerDownRight, Plus, X, Award, Flame, Star 
} from "lucide-react";
import { ForumPost, ForumReply } from "../types";
import { FORUM_THREADS } from "../data";

export default function CommunityForum() {
  const [threads, setThreads] = useState<ForumPost[]>(() => {
    const cached = localStorage.getItem("codemaster_forum_threads");
    return cached ? JSON.parse(cached) : FORUM_THREADS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  
  // Custom Thread Builder Form Modal
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"General" | "Debugging" | "Showcase" | "Career Advice">("General");
  const [newContent, setNewContent] = useState("");

  // Detailed commenting states on active Expanded Thread
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);
  const [newReplyInput, setNewReplyInput] = useState("");

  useEffect(() => {
    localStorage.setItem("codemaster_forum_threads", JSON.stringify(threads));
  }, [threads]);

  const handleLikePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => {
      return prev.map(t => {
        if (t.id === id) {
          const isLiked = t.likedByCurrentUser;
          return {
            ...t,
            likes: isLiked ? t.likes - 1 : t.likes + 1,
            likedByCurrentUser: !isLiked
          };
        }
        return t;
      });
    });
  };

  const handleCreateThread = () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `thread-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      authorName: "Alex Dev", // matches app profile
      authorRole: "Full-Stack Apprentice",
      authorAvatar: "💻",
      content: newContent,
      likes: 1,
      repliesCount: 0,
      createdAt: new Date().toISOString(),
      tags: [newCategory],
      likedByCurrentUser: true,
      replies: []
    };

    setThreads([newPost, ...threads]);
    
    // Reset Form Modal state
    setNewTitle("");
    setNewContent("");
    setShowModal(false);
  };

  const handlePublishReply = (threadId: string) => {
    if (!newReplyInput.trim()) return;

    const newRep: ForumReply = {
      id: `rep-${Date.now()}`,
      authorName: "Alex Dev",
      authorRole: "Full-Stack Apprentice",
      authorAvatar: "💻",
      content: newReplyInput,
      createdAt: new Date().toISOString()
    };

    setThreads(prev => {
      return prev.map(t => {
        if (t.id === threadId) {
          const updatedRepls = t.replies ? [...t.replies, newRep] : [newRep];
          return {
            ...t,
            repliesCount: t.repliesCount + 1,
            replies: updatedRepls
          };
        }
        return t;
      });
    });

    setNewReplyInput("");
  };

  const categoriesList = [
    { id: "all", label: "All Topics" },
    { id: "Debugging", label: "Debugging" },
    { id: "Showcase", label: "Showcase" },
    { id: "Career Advice", label: "Career Advice" },
    { id: "General", label: "General" }
  ];

  const filteredThreads = threads.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  // Mock Leaders dataset for Gamification scoreboard
  const scoreLeaders = [
    { rank: 1, name: "Pranav S.", xp: 4820, streak: 15, avatar: "🔥", badge: "Expert" },
    { rank: 2, name: "Subhashini", xp: 3200, streak: 12, avatar: "👩‍💻", badge: "Pro Compiler" },
    { rank: 3, name: "Alex Dev (You)", xp: 1420, streak: 5, avatar: "💻", badge: "Apprentice" },
    { rank: 4, name: "Rohan", xp: 950, streak: 3, avatar: "👨‍💻", badge: "Aspirant" }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Search Header visual bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">CodeMaster Community Forum</h1>
          <p className="text-slate-500 text-sm mt-1">Chat on programmatic tasks, showcase web designs, and climb leader board positions.</p>
        </div>

        {/* Create Thread trigger */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg flex items-center gap-1 transition-all shadow-md shadow-indigo-600/15 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" /> Start Thread
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Catalog Lists of Questions) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters shelf */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl select-none">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {categoriesList.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveCategory(item.id); setExpandedThreadId(null); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                    activeCategory === item.id
                    ? "bg-slate-950 border-slate-950 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search forum topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[180px] w-full text-slate-850"
            />
          </div>

          {/* Expanded Thread detail visual segment (drawer-like) */}
          {expandedThreadId ? (
            (() => {
              const activeT = threads.find(t => t.id === expandedThreadId);
              if (!activeT) return null;

              return (
                <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 space-y-6 shadow-md animate-fade-in text-sans">
                  <button 
                    onClick={() => setExpandedThreadId(null)}
                    className="text-[11px] font-bold text-indigo-650 hover:underline cursor-pointer"
                  >
                    ← Close Thread detailed view
                  </button>

                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-slate-50 p-1 rounded-md border text-center">{activeT.authorAvatar}</span>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{activeT.authorName}</h4>
                        <span className="text-[10px] text-slate-450 uppercase tracking-wide font-mono">{activeT.authorRole}</span>
                      </div>
                    </div>

                    <h2 className="font-display font-bold text-[#0c142c] text-sm leading-snug">{activeT.title}</h2>
                    <div className="text-xs text-slate-650 leading-relaxed whitespace-pre-wrap font-mono p-4 bg-slate-50 rounded-xl border border-slate-150">
                      {activeT.content}
                    </div>
                  </div>

                  {/* Replies detail stack */}
                  <div className="space-y-3.5 pt-4 border-t border-slate-150">
                    <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-indigo-500" /> Responses ({activeT.repliesCount})
                    </h3>

                    <div className="space-y-3 pl-3 border-l-2 border-slate-150">
                      {activeT.replies && activeT.replies.length > 0 ? (
                        activeT.replies.map(rep => (
                          <div key={rep.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 shrink-0">
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                              <span className="font-semibold text-slate-700">{rep.authorName} ({rep.authorRole})</span>
                              <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{rep.content}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 italic text-[11px] py-1">No comments posted yet. Add yours below!</div>
                      )}
                    </div>
                  </div>

                  {/* New comment input field */}
                  <div className="pt-4 border-t border-slate-150 flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Type helpful reply comments here..."
                      value={newReplyInput}
                      onChange={(e) => setNewReplyInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePublishReply(activeT.id)}
                      className="flex-grow p-2.5 border border-slate-250 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                    <button
                      onClick={() => handlePublishReply(activeT.id)}
                      className="bg-slate-900 hover:bg-slate-950 text-white p-2.5 rounded-xl block shrink-0 cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            // Core List view
            <div className="space-y-4">
              {filteredThreads.map(post => {
                const isLiked = post.likedByCurrentUser;

                return (
                  <div 
                    key={post.id}
                    onClick={() => setExpandedThreadId(post.id)}
                    className="bg-white border border-slate-200 hover:border-slate-350 rounded-2xl p-5 hover:shadow-sm transition-all cursor-pointer select-none space-y-4"
                  >
                    {/* Author block Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{post.authorAvatar}</span>
                        <div>
                          <span className="font-bold text-xs text-slate-800 block leading-tight">{post.authorName}</span>
                          <span className="text-[9px] font-mono tracking-wide text-slate-400 uppercase">{post.authorRole}</span>
                        </div>
                      </div>

                      <span className="text-[10px] bg-slate-100 p-0.5 px-2 rounded-md font-semibold text-slate-500 border border-slate-200 font-mono">
                        {post.category}
                      </span>
                    </div>

                    {/* Main content snippet */}
                    <div className="space-y-1">
                      <h3 className="font-display font-bold text-[#0e172e] text-[13px] leading-snug">{post.title}</h3>
                      <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{post.content}</p>
                    </div>

                    {/* Footer stats row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500 leading-none">
                      <div className="flex gap-4">
                        <button
                          onClick={(e) => handleLikePost(post.id, e)}
                          className={`flex items-center gap-1 font-bold ${isLiked ? "text-rose-500" : "hover:text-rose-500"}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center gap-1 font-bold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.repliesCount} replies</span>
                        </div>
                      </div>
                      
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                  </div>
                );
              })}

              {filteredThreads.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400">
                  <span>No thread discussions found. Click Start Thread to write yours!</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column (Gamification scoreboard panel) */}
        <div className="space-y-6 font-sans">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                <h3 className="font-display font-medium text-slate-850 text-xs">Aspirants Leader board</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-450">Cohort: June</span>
            </div>

            {/* Score lists */}
            <div className="divide-y divide-slate-100 select-none">
              {scoreLeaders.map((ldr) => (
                <div key={ldr.rank} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-slate-450 font-bold text-[10px] pr-0.5">#{ldr.rank}</span>
                    <span className="text-xl shrink-0 leading-none">{ldr.avatar}</span>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-850 truncate block leading-tight">{ldr.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase block tracking-wide">{ldr.badge}</span>
                    </div>
                  </div>

                  <div className="text-right leading-none shrink-0 font-mono text-[10px]">
                    <span className="font-bold text-slate-900 block">{ldr.xp} XP</span>
                    <span className="text-slate-400 text-[8px] uppercase tracking-wider block mt-0.5">{ldr.streak} days</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Model Dialog component for Creating absolute new threads */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 shadow-2xl relative animate-scale-in text-sans">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider block">Write Community Thread</h3>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5 animate-none">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase block">Thread Title</label>
                <input
                  type="text"
                  placeholder="e.g., Why does Python crash on floats iterations?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl text-xs text-slate-850 focus:outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1.5 animate-none">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase block">Category Topic</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-250 bg-slate-50 rounded-xl text-xs text-slate-705"
                >
                  <option value="General">General</option>
                  <option value="Debugging">Debugging</option>
                  <option value="Showcase">Showcase</option>
                  <option value="Career Advice">Career Advice</option>
                </select>
              </div>

              <div className="space-y-1.5 animate-none">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase block">Questions Details</label>
                <textarea
                  placeholder="Detail your question logic and variables here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full h-28 p-3 border border-slate-250 bg-slate-50 focus:bg-white rounded-xl text-xs text-slate-850 focus:outline-none resize-none text-slate-800"
                />
              </div>

              <button
                onClick={handleCreateThread}
                disabled={!newTitle.trim() || !newContent.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/15 transition-colors cursor-pointer"
              >
                Publish Thread
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
