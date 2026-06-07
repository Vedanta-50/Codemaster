import React from "react";
import { 
  BookOpen, Terminal, Code, Sparkles, FolderCode, Users, Briefcase, 
  Settings, LogOut, Award, Zap, Trophy, ChevronRight
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: any) => void;
  user: UserProfile;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Trophy, category: "LEARN" },
    { id: "courses", label: "Courses", icon: BookOpen, category: "LEARN" },
    { id: "editor", label: "Code Playground", icon: Terminal, category: "PRACTICE" },
    { id: "practice", label: "Challenges", icon: Code, category: "PRACTICE" },
    { id: "projects", label: "Project Hub", icon: FolderCode, category: "PRACTICE" },
    { id: "ai_assistant", label: "Gemini AI Buddy", icon: Sparkles, category: "AI SERVICES" },
    { id: "career", label: "Career Prep", icon: Briefcase, category: "AI SERVICES" },
    { id: "community", label: "Community Forum", icon: Users, category: "SOCIAL" },
    { id: "settings", label: "Profile & Settings", icon: Settings, category: "SYSTEM" },
  ];

  // Group by category
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  // Calculate percentage of progression to next level
  const xpPct = Math.min(100, Math.floor((user.xp / user.xpNextLevel) * 100));

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 border-r border-slate-800 shrink-0 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-10 select-none font-sans">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-650/40">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-white block text-sm">CodeMaster AI</span>
              <span className="text-[10px] text-slate-500 font-mono">Senior-Pro Platform</span>
            </div>
          </div>
          <span className="text-[9px] font-bold py-0.5 px-2 rounded bg-indigo-950 border border-indigo-500/20 text-indigo-400">
            PREVIEW
          </span>
        </div>

        {/* Profile Stats Quickcard */}
        <div className="p-4 bg-slate-900/40 border-b border-slate-900/60 m-3 rounded-xl border border-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-slate-800 p-1.5 rounded-lg border border-slate-700/50 leading-none">{user.avatar}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 text-xs truncate">{user.name}</span>
                <span className="text-[10px] text-indigo-400 font-mono font-bold">Lvl {user.level}</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">{user.title}</span>
            </div>
          </div>

          {/* XP Progress Slider */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
              <span>XP Progressive</span>
              <span>{user.xp} / {user.xpNextLevel}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>

          {/* Spark Streaks Grid */}
          <div className="flex gap-2 mt-3 items-center">
            <div className="flex-1 bg-slate-950/60 p-1.5 px-2 rounded-lg border border-slate-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0Fill fill-amber-450" />
              <div className="leading-none">
                <span className="text-[10px] font-mono font-bold block text-amber-400">{user.streak} Days</span>
                <span className="text-[7px] text-slate-500 font-mono">DAILY STREAK</span>
              </div>
            </div>
            <div className="flex-1 bg-slate-950/60 p-1.5 px-2 rounded-lg border border-slate-800 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="leading-none">
                <span className="text-[10px] font-mono font-bold block text-indigo-400">{user.badges.length} Badges</span>
                <span className="text-[7px] text-slate-500 font-mono">ACHIEVED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Menu Navigation */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[55vh]">
          {categories.map(cat => (
            <div key={cat} className="space-y-1">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 leading-none">{cat}</p>
              <div className="space-y-0.5">
                {menuItems
                  .filter(item => item.category === cat)
                  .map(item => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`sidebar-link-${item.id}`}
                        onClick={() => setCurrentTab(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all duration-150 ${
                          isActive 
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10 border border-indigo-500" 
                            : "text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout Row */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40">
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 border border-slate-800 rounded-lg text-xs font-semibold text-slate-500 hover:text-red-400 hover:border-red-900/30 hover:bg-red-950/10 transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4 text-slate-550" />
          <span>Exit Account Workspace</span>
        </button>
      </div>
    </aside>
  );
}
