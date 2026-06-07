import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Key, User, Mail, ShieldCheck, Terminal, BookOpen, Cpu } from "lucide-react";
import { UserProfile } from "../types";

interface AuthPageProps {
  onSuccess: (email: string, customProfile?: Partial<UserProfile>) => void;
}

export default function AuthPage({ onSuccess }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Defaults strictly to the pristine Level 1 zero progress profile
    onSuccess(email);
  };

  // Skip logic using pre-configured skill presets
  const handleStartPreset = (tier: "beginner" | "intermediate" | "guru") => {
    let profileOverride: Partial<UserProfile> = {};

    if (tier === "beginner") {
      profileOverride = {
        name: fullName || "Alex Beginner",
        title: "Full-Stack Apprentice",
        level: 1,
        xp: 120,
        xpNextLevel: 500,
        streak: 1,
        badges: [
          { id: "b1", icon: "🔥", name: "Day 1 Recruit", description: "Enrolled in CodeMaster AI classroom.", dateEarned: "2026-06-07" }
        ],
        completedLessons: [],
        solvedChallenges: []
      };
    } else if (tier === "intermediate") {
      profileOverride = {
        name: fullName || "Alex Intermediate",
        title: "React & DSA Scholar",
        level: 5,
        xp: 850,
        xpNextLevel: 1200,
        streak: 7,
        badges: [
          { id: "b1", icon: "🔥", name: "7-Day Fire Streak", description: "Studied continuous algorithmic concepts.", dateEarned: "2026-06-07" },
          { id: "b2", icon: "🎓", name: "Graduate Apprentice", description: "Successfully compiled five modules.", dateEarned: "2026-06-07" }
        ],
        completedLessons: ["intro-js-variables", "react-useState-hooks"],
        solvedChallenges: ["chall-duplicate-checker"]
      };
    } else {
      profileOverride = {
        name: fullName || "Alex Guru",
        title: "Senior AI Architect",
        level: 12,
        xp: 2600,
        xpNextLevel: 4000,
        streak: 24,
        badges: [
          { id: "b1", icon: "🔥", name: "24-Day Firestore Streak", description: "Consistent study history logs.", dateEarned: "2026-06-07" },
          { id: "b2", icon: "🎓", name: "Graduate Apprentice", description: "Successfully compiled five modules.", dateEarned: "2026-06-07" },
          { id: "b3", icon: "🧠", name: "DS & Solver Expert", description: "Decomposed advanced tree structures.", dateEarned: "2026-06-07" },
          { id: "b4", icon: "🚀", name: "Vanguard Contributor", description: "Achieved highest tier rewards.", dateEarned: "2026-06-07" }
        ],
        completedLessons: ["intro-js-variables", "react-useState-hooks", "sql-select-queries", "ai-prompting-basics"],
        solvedChallenges: ["chall-duplicate-checker", "chall-prime-finder", "chall-fizzbuzz"]
      };
    }

    onSuccess(email || "alex@codemaster.ai", profileOverride);
  };

  return (
    <div className="min-h-screen bg-[#060a13] text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-indigo-600 selection:text-white font-sans overflow-y-auto">
      {/* Visual background ambient circles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Branded label */}
      <div className="absolute top-6 left-6 flex items-center gap-2.5 cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-650/40">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-medium text-lg text-white tracking-tight">CodeMaster AI</span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-display font-extrabold text-white tracking-tight leading-tight">
          {isLogin ? "Ascend your Coding prowess" : "Enroll inside CodeMaster AI"}
        </h2>
        <p className="mt-2.5 text-center text-xs text-slate-400 font-sans">
          {isLogin ? "Compile programs, ask real Gemini coaches, or" : "Establish your professional curriculum path or"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors underline cursor-pointer"
          >
            {isLogin ? "register a student workspace" : "login to existing parameters"}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-[#0b101c]/90 border border-slate-800/80 py-8 px-6 sm:px-10 rounded-2xl shadow-xl backdrop-blur-md grid grid-cols-1 gap-6">
          
          {/* Main accounts form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#060a13] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-white"
                    placeholder="E.g., Alex Developer"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                Student Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#060a13] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  placeholder="alex@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider mb-1">
                Security Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Key className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#060a13] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLogin ? "Unlock Account Console" : "Establish student credentials"}
            </button>
          </form>

          {/* Preset skip divider */}
          <div className="relative my-2 select-none">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold font-mono">
              <span className="px-3 bg-[#0d1323] text-indigo-400 uppercase border border-indigo-900/40 rounded-full py-0.5 leading-none">
                Or quick-start with a demo curriculum profile
              </span>
            </div>
          </div>

          {/* Sandbox presets grid selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleStartPreset("beginner")}
              className="p-3 text-left bg-[#05080f] border border-slate-800/80 rounded-xl hover:border-emerald-500/50 hover:bg-slate-900/10 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-lg">🌱</span>
                <h4 className="text-xs font-bold text-white mt-1 group-hover:text-emerald-400 transition-colors leading-tight">Level 1 - Starter</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">Brand new account. Cleared baseline path with zero lessons completed.</p>
              </div>
              <span className="text-[9px] font-bold font-mono text-emerald-500 mt-3 uppercase tracking-wider block">Launch Starter</span>
            </button>

            <button
              onClick={() => handleStartPreset("intermediate")}
              className="p-3 text-left bg-[#05080f] border border-slate-800/80 rounded-xl hover:border-indigo-500/50 hover:bg-slate-900/10 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-lg">⌨️</span>
                <h4 className="text-xs font-bold text-white mt-1 group-hover:text-indigo-400 transition-colors leading-tight">Level 5 - Scholar</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans font-sans">850 XP, 2 unlocked lessons, 7 Days streak simulation.</p>
              </div>
              <span className="text-[9px] font-bold font-mono text-indigo-400 mt-3 uppercase tracking-wider block">Launch Scholar</span>
            </button>

            <button
              onClick={() => handleStartPreset("guru")}
              className="p-3 text-left bg-[#05080f] border border-slate-800/80 rounded-xl hover:border-amber-500/50 hover:bg-slate-900/10 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <span className="text-lg">🧠</span>
                <h4 className="text-xs font-bold text-white mt-1 group-hover:text-amber-400 transition-colors leading-tight">Level 12 - Senior</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal font-sans">2600 XP, all lessons unlocked, all badges equipped.</p>
              </div>
              <span className="text-[9px] font-bold font-mono text-amber-500 mt-3 uppercase tracking-wider block">Launch Senior</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
