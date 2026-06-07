import React from "react";
import { 
  Settings, Award, RefreshCw, Sparkles, User, ShieldAlert, 
  CheckCircle2, Trash2, Heart, Cpu 
} from "lucide-react";
import { UserProfile } from "../types";

interface ProfileSettingsProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
}

export default function ProfileSettings({ user, onUpdateUser, onResetProgress }: ProfileSettingsProps) {
  
  const avatars = ["💻", "👩‍💻", "👨‍💻", "🔥", "🚀", "⚡", "🌟", "👾", "🧠", "🦁"];

  const handleSelectAvatar = (av: string) => {
    onUpdateUser({ avatar: av });
  };

  const handleUpdateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateUser({ name: e.target.value });
  };

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateUser({ title: e.target.value });
  };

  // Mock standard Badge library representing milestone states
  const badgeLibrary = [
    { id: "b1", icon: "🔥", name: "3-Day Fire Streak", target: "Streak", unlocked: user.streak >= 3 },
    { id: "b2", icon: "🎓", name: "Graduate Apprentice", target: "Lessons complete", unlocked: user.completedLessons.length >= 1 },
    { id: "b3", icon: "🧠", name: "DS & Solver Expert", target: "Practice Solved", unlocked: user.solvedChallenges.length >= 2 },
    { id: "b4", icon: "🚀", name: "Vanguard Contributor", target: "XPs gained", unlocked: user.xp >= 1000 }
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Search Header visual bar */}
      <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-indigo-650" />
          <div>
            <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">Account Configuration Console</h1>
            <p className="text-slate-500 text-sm mt-1">Manage avatar emojis, student role titles, and review lock/unlock qualifications.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Inputs forms) */}
        <div className="lg:col-span-2 space-y-6 select-none text-sans">
          
          {/* Form Card config */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-display font-bold text-slate-850 text-xs flex items-center gap-1.5 uppercase">
              <User className="w-4 h-4 text-indigo-500" /> General Profile settings
            </h3>

            <div className="space-y-4 pt-1">
              {/* Emojis selection row */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Select Avatar Accent</label>
                <div className="flex flex-wrap gap-2.5 p-3.5 bg-slate-50 border border-slate-150 rounded-2xl">
                  {avatars.map(av => {
                    const isSelected = user.avatar === av;
                    return (
                      <button
                        key={av}
                        onClick={() => handleSelectAvatar(av)}
                        className={`text-2xl p-1.5 px-3 rounded-xl border transition-all ${
                          isSelected 
                          ? "bg-indigo-600 border-indigo-700 text-white transform scale-110 shadow-md shadow-indigo-600/10"
                          : "bg-white border-slate-200 hover:border-slate-350"
                        }`}
                      >
                        {av}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Candidate Name</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={handleUpdateName}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-805 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-505 text-slate-800"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Student Professional Title</label>
                  <input
                    type="text"
                    value={user.title}
                    onChange={handleUpdateTitle}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 focus:bg-white text-slate-805 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-505 text-slate-800"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Destructive override reset card */}
          <div className="bg-red-50/20 border border-red-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-display font-bold text-red-900 text-xs flex items-center gap-1.5 uppercase">
              <ShieldAlert className="w-4.5 h-4.5 text-red-650" /> Destructive Override Workspace
            </h3>
            
            <p className="text-[11px] text-red-700 leading-relaxed max-w-xl pl-0.5">
              Resetting studies clears your achieved badge collections, wipes mock interview history streams, and deletes your interactive sandbox variables. Standard caches are permanently lost!
            </p>

            <button
              onClick={() => {
                if (confirm("Reset compilation stats? All local variables logs and exercises completions will be completely deleted.")) {
                  onResetProgress();
                }
              }}
              className="py-2 px-4 bg-red-600 hover:bg-red-705 text-white rounded-lg text-xs font-bold font-sans transition-all flex items-center gap-1.5 shadow-sm inline-block cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wipe System studies progress records
            </button>
          </div>

        </div>

        {/* Right side locked milestones checklist */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-205 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-indigo-550" />
              <h3 className="font-display font-medium text-slate-850 text-xs text-sans">Lock Qualifications matrix</h3>
            </div>

            {/* Matrix logs */}
            <div className="space-y-3">
              {badgeLibrary.map(bdg => (
                <div key={bdg.id} className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-white p-1 rounded border leading-none">{bdg.icon}</span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-[11px] font-sans leading-none">{bdg.name}</h4>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono leading-none">Condition: {bdg.target}</span>
                    </div>
                  </div>

                  {bdg.unlocked ? (
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50 shrink-0" />
                  ) : (
                    <span className="text-[8px] font-mono font-bold tracking-wider text-slate-400 border border-slate-200 bg-white px-1.5 rounded uppercase leading-none shrink-0 py-0.5">
                      Locked
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] text-slate-650 flex items-start gap-1.5 leading-relaxed font-sans mt-2">
              <Cpu className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-950 block">Hardware Sandbox Identity:</span>
                Student Node: {user.email || "guest@codemaster.ai"} with isolated local workspace parameters.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
