import React from "react";
import { 
  Zap, Trophy, Flame, Play, CheckCircle2, ChevronRight, 
  Map, Target, ArrowRight, Star, Clock, Laptop 
} from "lucide-react";
import { UserProfile, Course } from "../types";

interface HomeDashboardProps {
  user: UserProfile;
  courses: Course[];
  onStartCourse: (courseId: string) => void;
  onNavigateTab: (tab: any) => void;
}

export default function HomeDashboard({ user, courses, onStartCourse, onNavigateTab }: HomeDashboardProps) {
  // Find recommended lesson based on unfinished items
  const activeCourse = courses[0]; // JavaScript
  const activeLesson = activeCourse?.modules[0]?.lessons.find(l => !user.completedLessons.includes(l.id)) || activeCourse?.modules[1]?.lessons[0];

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
  };

  const completedM1Lessons = ["js-intro-1", "js-intro-2"].filter(id => user.completedLessons.includes(id)).length;
  const m1Pct = Math.floor((completedM1Lessons / 2) * 100);

  const completedM2Lessons = ["js-logic-1", "js-logic-2"].filter(id => user.completedLessons.includes(id)).length;
  const m2Pct = Math.floor((completedM2Lessons / 2) * 100);

  return (
    <div className="space-y-6 animate-fade-in text-sans font-sans">
      
      {/* 1. Header Greeting Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-indigo-600/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="space-y-2 relative">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold tracking-wider uppercase">
              Apprentice Portal Active
            </span>
            <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              {user.streak} Day Heat Streak
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight">
            Howdy, <span className="bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-100 bg-clip-text text-transparent">{user.name}</span>!
          </h1>
          <p className="text-slate-400 text-xs md:text-sm max-w-xl">
            You are currently on track for your weekly goals. Your custom AI tutor suggests spending 15 minutes reviewing JavaScript recursion loops today.
          </p>
        </div>

        <div className="flex gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 shrink-0 self-start md:self-center">
          <div className="text-center px-2">
            <span className="text-2xl font-mono font-extrabold text-white block">{user.totalHours}h</span>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Total hours</span>
          </div>
          <div className="w-px bg-slate-800 self-stretch" />
          <div className="text-center px-2">
            <span className="text-2xl font-mono font-extrabold text-indigo-400 block">{user.xp}</span>
            <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">Alltime XP</span>
          </div>
        </div>
      </div>

      {/* 2. Top Grid: Learning Journey Map vs Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) - Personalized Roadmap Nodes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-150 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Map className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-slate-900 text-sm">Personal Learning Roadmap</h2>
                  <p className="text-slate-400 text-[11px]">Milestones tailored by AI based on your diagnostic answers</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigateTab("courses")}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 transition-colors"
              >
                Expand Catalog <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Milestones Nodes Map */}
            <div className="mt-6 relative">
              <div className="absolute left-[27px] top-4 bottom-5 w-0.5 bg-dashed bg-slate-200" />
              
              <div className="space-y-6">
                
                {/* Node 1: Completed variables */}
                <div className="flex items-start gap-4">
                  {m1Pct === 100 ? (
                    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10 shadow-sm shadow-indigo-200 animate-pulse">
                      <ProgressMarker num={1} active />
                    </div>
                  )}
                  <div className={`flex-1 p-4 rounded-xl flex items-center justify-between ${
                    m1Pct === 100 
                      ? "bg-slate-50 border border-slate-150" 
                      : "bg-indigo-50/20 border-2 border-indigo-400/30 relative overflow-hidden"
                  }`}>
                    {m1Pct < 100 && <div className="absolute -top-1 right-2 w-16 h-16 bg-indigo-500/5 rounded-full pointer-events-none" />}
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block font-mono ${
                        m1Pct === 100 ? "text-emerald-600" : "text-indigo-600"
                      }`}>
                        {m1Pct === 100 ? "Module I Finished" : "Current Active Module"}
                      </span>
                      <h4 className={`font-bold text-xs ${m1Pct === 100 ? "text-slate-800" : "text-indigo-900"}`}>
                        JavaScript Variables & Syntax
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Introduced Let, Const, Strings and primitive variables.</p>
                    </div>
                    {m1Pct === 100 ? (
                      <span className="text-[11px] font-bold text-slate-500 font-mono bg-white p-1 px-2 rounded-md border border-slate-200 shrink-0">100% Done</span>
                    ) : (
                      <button 
                        onClick={() => onStartCourse("javascript-basics")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
                      >
                        Start {m1Pct > 0 ? `${m1Pct}%` : ""} <Play className="w-3 h-3 fill-white" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Node 2: Currently Active logic quiz */}
                <div className="flex items-start gap-4">
                  {m1Pct === 100 ? (
                    m2Pct === 100 ? (
                      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center shrink-0 z-10 shadow-sm shadow-indigo-200 animate-pulse">
                        <ProgressMarker num={2} active />
                      </div>
                    )
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <ProgressMarker num={2} />
                    </div>
                  )}
                  <div className={`flex-1 p-4 rounded-xl flex items-center justify-between ${
                    m1Pct === 100 
                      ? m2Pct === 100
                        ? "bg-slate-50 border border-slate-150"
                        : "bg-indigo-50/20 border-2 border-indigo-400/30 relative overflow-hidden"
                      : "bg-white border border-slate-250/60"
                  }`}>
                    {m1Pct === 100 && m2Pct < 150 && <div className="absolute -top-1 right-2 w-16 h-16 bg-indigo-500/5 rounded-full pointer-events-none" />}
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block font-mono ${
                        m1Pct === 100
                          ? m2Pct === 100 ? "text-emerald-600" : "text-indigo-600"
                          : "text-slate-400"
                      }`}>
                        {m1Pct === 100 ? m2Pct === 100 ? "Module II Finished" : "Current Challenge Node" : "Locked Phase"}
                      </span>
                      <h4 className={`font-bold text-xs ${
                        m1Pct === 100
                          ? m2Pct === 100 ? "text-slate-800" : "text-indigo-900"
                          : "text-slate-600"
                      }`}>
                        Conditional Logic Statements & Loops
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Solve interactive quizzes & loops sandbox terminals immediately.</p>
                    </div>
                    {m1Pct === 100 ? (
                      m2Pct === 100 ? (
                        <span className="text-[11px] font-bold text-slate-500 font-mono bg-white p-1 px-2 rounded-md border border-slate-200 shrink-0">100% Done</span>
                      ) : (
                        <button 
                          onClick={() => onStartCourse("javascript-basics")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
                        >
                          Resume {m2Pct > 0 ? `${m2Pct}%` : ""} <Play className="w-3 h-3 fill-white" />
                        </button>
                      )
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-50 p-1 px-2 rounded-md border border-slate-200">Locked</span>
                    )}
                  </div>
                </div>

                {/* Node 3: Upcoming DSA */}
                <div className="flex items-start gap-4">
                  {m1Pct === 100 && m2Pct === 100 ? (
                    <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 z-10 shadow-sm animate-pulse">
                      <ProgressMarker num={3} active />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                      <ProgressMarker num={3} />
                    </div>
                  )}
                  <div className={`flex-1 p-4 rounded-xl flex items-center justify-between ${
                    m1Pct === 100 && m2Pct === 100
                      ? "bg-indigo-50/20 border-2 border-indigo-400/30 relative overflow-hidden"
                      : "bg-white border border-slate-250/60"
                  }`}>
                    <div>
                      <span className={`text-[9px] font-bold uppercase tracking-widest block font-mono ${
                        m1Pct === 100 && m2Pct === 100 ? "text-indigo-600" : "text-slate-400"
                      }`}>
                        {m1Pct === 100 && m2Pct === 100 ? "Next Level Node" : "Locked Phase"}
                      </span>
                      <h4 className={`font-bold text-xs ${
                        m1Pct === 100 && m2Pct === 100 ? "text-indigo-900" : "text-slate-600"
                      }`}>
                        Arrays Reduction, Mapping & Closures
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Unlock after satisfying loops requirements.</p>
                    </div>
                    {m1Pct === 100 && m2Pct === 100 ? (
                      <button 
                        onClick={() => onNavigateTab("courses")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-lg flex items-center gap-1 transition-all shadow-md shadow-indigo-600/20 shrink-0 cursor-pointer"
                      >
                        Explore <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-50 p-1 px-2 rounded-md border border-slate-200">Locked</span>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Github Calendar Style Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Daily Contribution Calendar</h3>
                  <p className="text-slate-400 text-[11px]">Track your coding sessions inside CodeMaster AI playground</p>
                </div>
              </div>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{user.streak} Days Streak</span>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="grid grid-cols-7 gap-2.5 flex-1 max-w-sm">
                {user.timelineActivity.map((day, idx) => {
                  let colorClass = "bg-slate-100 hover:bg-slate-200";
                  if (day.count > 0 && day.count < 5) colorClass = "bg-indigo-200 border-indigo-300";
                  else if (day.count >= 5 && day.count < 10) colorClass = "bg-indigo-400 border-indigo-500";
                  else if (day.count >= 10) colorClass = "bg-indigo-600 border-indigo-700 text-white";
                  return (
                    <div 
                      key={day.date} 
                      className="text-center font-mono space-y-1 relative group"
                      title={`${day.count} activities on ${day.date}`}
                    >
                      <div className={`w-8 h-8 mx-auto rounded-lg border border-slate-200 flex items-center justify-center text-xs font-bold transition-all ${colorClass}`}>
                        {day.count}
                      </div>
                      <span className="text-[9px] text-slate-450 block truncate font-mono">
                        {getDayLabel(day.date)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="hidden sm:block flex-1 pl-4 border-l border-slate-200 space-y-2">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 block">XP INTENSITY:</span>
                <div className="flex gap-2 items-center text-[11px] text-slate-650">
                  <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200" />
                  <span>0 points (Idle)</span>
                </div>
                <div className="flex gap-2 items-center text-[11px] text-slate-650">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-200 border border-indigo-300" />
                  <span>50-100 points (Normal)</span>
                </div>
                <div className="flex gap-2 items-center text-[11px] text-slate-650">
                  <span className="w-2.5 h-2.5 rounded bg-indigo-600 border border-indigo-700" />
                  <span>150+ points (Hyper)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3 width) - Achievements and Active Goals */}
        <div className="space-y-6">
          
          {/* Daily Goals Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded-lg bg-orange-50 text-orange-600">
                <Target className="w-4 h-4" />
              </span>
              <h3 className="font-display font-bold text-slate-900 text-xs">Daily Coding Goals</h3>
            </div>

            <div className="space-y-3.5">
              {user.goals.map(goal => {
                const currentPct = Math.min(100, Math.floor((goal.current / goal.target) * 100));
                const completed = currentPct >= 100;

                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[11px] font-semibold">
                      <span className={completed ? "text-slate-400 line-through" : "text-slate-700"}>{goal.description}</span>
                      <span className="text-slate-400 font-mono text-[10px]">{goal.current}/{goal.target}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${completed ? "bg-emerald-500" : "bg-orange-400"}`}
                        style={{ width: `${currentPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Achievements Display list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-yellow-50 text-yellow-600">
                  <Trophy className="w-4 h-4" />
                </span>
                <h3 className="font-display font-bold text-slate-900 text-xs">Earned Badges</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{user.badges.length} achieved</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {user.badges.map(badge => (
                <div key={badge.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center gap-3">
                  <span className="text-2xl bg-white p-1 rounded-lg shadow-sm border border-slate-100 leading-none">{badge.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800">{badge.name}</h4>
                    <p className="text-[10px] text-slate-450">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ProgressMarker({ num, active }: { num: number; active?: boolean }) {
  if (active) {
    return (
      <div className="w-7 h-7 bg-indigo-600 rounded-full text-white font-mono text-xs font-bold flex items-center justify-center">
        {num}
      </div>
    );
  }
  return (
    <div className="w-7 h-7 bg-slate-200 text-slate-450 rounded-full font-mono text-xs font-bold flex items-center justify-center">
      {num}
    </div>
  );
}
