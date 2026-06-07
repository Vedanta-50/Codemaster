import React, { useState, useEffect } from "react";
import { 
  Code, Filter, Star, Clock, Trophy, Play, CheckCircle2, 
  HelpCircle, Sparkles, RefreshCw, AlertTriangle
} from "lucide-react";
import { CodingChallenge, UserProfile } from "../types";
import { CODING_CHALLENGES } from "../data";

interface PracticeProblemsProps {
  user: UserProfile;
  onSelectChallenge: (challenge: CodingChallenge) => void;
}

export default function PracticeProblems({ user, onSelectChallenge }: PracticeProblemsProps) {
  const [activeDifficulty, setActiveDifficulty] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [search, setSearch] = useState("");
  
  // Timer for Mock Pressure
  const [timeLeft, setTimeLeft] = useState(2700); // 45 mins Standard Interview
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const handleResetTimer = () => {
    setTimeLeft(2700);
    setIsTimerRunning(false);
  };

  const filteredChallenges = CODING_CHALLENGES.filter(chall => {
    const matchesSearch = chall.title.toLowerCase().includes(search.toLowerCase()) || 
                          chall.category.toLowerCase().includes(search.toLowerCase());
    const matchesDifficulty = activeDifficulty === "all" || chall.difficulty === activeDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Search Header visual bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">Technical Interview Practice</h1>
          <p className="text-slate-500 text-sm mt-1">Hone your problem solving and programmatic reasoning using real sandbox templates.</p>
        </div>

        {/* Stopwatch timer client widget */}
        <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 flex items-center gap-4 shrink-0 shadow-lg justify-between select-none">
          <div className="leading-none text-left">
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-450 uppercase block">INTERVIEW FOCUS STOPWATCH</span>
            <span className="text-xl font-mono font-extrabold text-indigo-400 mt-1 block">{formatTimer(timeLeft)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleToggleTimer}
              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isTimerRunning 
                ? "bg-amber-600 hover:bg-amber-705 text-white" 
                : "bg-indigo-600 hover:bg-indigo-705 text-white"
              }`}
            >
              {isTimerRunning ? "Pause" : "Commence"}
            </button>
            <button
              onClick={handleResetTimer}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg text-[10px] font-semibold"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Challenges list vs stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main column (problems catalog) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters shelf */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl select-none">
            <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
              {(["all", "Easy", "Medium", "Hard"] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setActiveDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border transition-all ${
                    activeDifficulty === diff
                    ? "bg-slate-950 border-slate-950 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-350"
                  }`}
                >
                  {diff === "all" ? "All Levels" : diff}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search duplicates, arrays etc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-3 pr-3 py-1.5 border border-slate-250 bg-white rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[200px] w-full text-slate-800"
            />
          </div>

          {/* Actual items list */}
          {filteredChallenges.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 shadow-sm">
              {filteredChallenges.map(chall => {
                const isSolved = user.solvedChallenges.includes(chall.id);

                return (
                  <div 
                    key={chall.id}
                    className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/40 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {isSolved ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 fill-emerald-50" />
                      ) : (
                        <div className="w-5 h-5 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-150">
                          <Code className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-bold text-xs truncate ${isSolved ? "text-slate-400 line-through font-medium" : "text-slate-750"}`}>
                            {chall.title}
                          </h3>
                          <span className={`text-[9px] font-bold font-mono px-1.5 rounded uppercase leading-none border ${
                            chall.difficulty === "Easy" 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-150" 
                            : chall.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-600 border-amber-150"
                            : "bg-rose-50 text-rose-600 border-rose-150"
                          }`}>
                            {chall.difficulty}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2.5 font-mono text-[10px] text-slate-400 mt-1">
                          <span>{chall.category}</span>
                          <span>•</span>
                          <span className="text-indigo-650 font-bold">+{chall.xpValue} XP</span>
                          <span>•</span>
                          <span className="bg-slate-100 p-0.5 px-1 rounded">{chall.language}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectChallenge(chall)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
                    >
                      <span>Code Arena</span> <Play className="w-3 h-3 fill-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-400">
              <Code className="w-8 h-8 text-slate-350 mx-auto mb-1" />
              <span>No algorithm exercises match your selection.</span>
            </div>
          )}

        </div>

        {/* Right side diagnostics column */}
        <div className="space-y-6 text-sans">
          
          {/* Quick stats checklist */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-xs">Sandbox Performance Logs</h3>

            <div className="space-y-2.5 text-xs text-slate-650">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Completed Exercises</span>
                <span className="font-mono font-bold text-slate-800">{user.solvedChallenges.length} / {CODING_CHALLENGES.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Diagnostic Skills Score</span>
                <span className="text-emerald-600 font-bold font-mono">Top 12%</span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 text-[11px] text-slate-650 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-indigo-950 block">AI Sandbox Advice:</span>
                Tackling Medium-grade exercises (like &quot;Prime Number Evaluator&quot;) trains logical reasoning ahead of tech selection tests.
              </div>
            </div>
          </div>

          {/* Time pressure warning instructions */}
          <div className="bg-amber-50 rounded-xl border border-amber-250 p-4 leading-relaxed text-[11px] text-stone-700 flex items-start gap-2.5">
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900 block">Mock Pressure Mode:</span>
              Commence the Focus Stopwatch above to dry-run standard interviews. Forces you to compute within active strict timer bounds!
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
