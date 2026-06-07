import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Sparkles, Award, Zap, Trophy, MessageSquare, Briefcase, 
  Settings, ChevronRight, Menu, LogOut, Code, AlertCircle
} from "lucide-react";

import { UserProfile, Course, Lesson, CodingChallenge } from "./types";
import { INITIAL_USER_PROFILE, COURSES, CODING_CHALLENGES } from "./data";

import Sidebar from "./components/Sidebar";
import HomeDashboard from "./components/HomeDashboard";
import CoursesView from "./components/CoursesView";
import CourseDetail from "./components/CourseDetail";
import CodePlayground from "./components/CodePlayground";
import PracticeProblems from "./components/PracticeProblems";
import ProjectHub from "./components/ProjectHub";
import AiAssistant from "./components/AiAssistant";
import CommunityForum from "./components/CommunityForum";
import CareerPrep from "./components/CareerPrep";
import ProfileSettings from "./components/ProfileSettings";
import AuthPage from "./components/AuthPage";

interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "award" | "level_up";
}

export default function App() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(() => {
    return localStorage.getItem("codemaster_email");
  });

  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core Study states (with fallback localStorage caches)
  const [user, setUser] = useState<UserProfile>(() => {
    const cached = localStorage.getItem("codemaster_user");
    return cached ? JSON.parse(cached) : INITIAL_USER_PROFILE;
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Toast alerts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Synchronize storage
  useEffect(() => {
    localStorage.setItem("codemaster_user", JSON.stringify(user));
  }, [user]);

  const triggerToast = (message: string, type: ToastNotification["type"] = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth logins
  const handleAuthSuccess = (email: string, customProfile?: Partial<UserProfile>) => {
    setSessionEmail(email);
    localStorage.setItem("codemaster_email", email);

    let newUserProfile: UserProfile;
    if (customProfile) {
      newUserProfile = {
        ...INITIAL_USER_PROFILE,
        ...customProfile,
        email: email,
        name: customProfile.name || email.split("@")[0] || "Student"
      };
    } else {
      newUserProfile = {
        ...INITIAL_USER_PROFILE,
        email: email,
        name: email.split("@")[0] || "Student"
      };
    }

    setUser(newUserProfile);
    localStorage.setItem("codemaster_user", JSON.stringify(newUserProfile));
    
    triggerToast("Workstation workspace loaded successfully!", "success");
    setCurrentTab("dashboard");
  };

  const handleLogout = () => {
    setSessionEmail(null);
    localStorage.removeItem("codemaster_email");
    localStorage.removeItem("codemaster_user");
    setSelectedCourse(null);
    setActiveLesson(null);
    setCurrentTab("dashboard");
    triggerToast("Logged out of session. Workspace restored to baseline.");
  };

  // Process Reward XPs when user completes lesson, code arena or project checklist
  const handleClaimXPReward = (xpAmount: number, detailsMsg: string = "Milestone achieved!") => {
    let currentXp = user.xp + xpAmount;
    let currentLvl = user.level;
    let nextLvlThreshold = user.xpNextLevel;
    let didLevelUp = false;

    // Check for standard Level Ups
    if (currentXp >= nextLvlThreshold) {
      currentXp = currentXp - nextLvlThreshold;
      currentLvl += 1;
      nextLvlThreshold = Math.floor(nextLvlThreshold * 1.5);
      didLevelUp = true;
    }

    setUser(prev => ({
      ...prev,
      xp: currentXp,
      level: currentLvl,
      xpNextLevel: nextLvlThreshold
    }));

    triggerToast(`+${xpAmount} XP: ${detailsMsg}`, "award");

    if (didLevelUp) {
      setTimeout(() => {
        triggerToast(`LEVEL UP! You are now Level ${currentLvl}! 🎓`, "level_up");
        // Add random cool student title on high ranks
        if (currentLvl >= 10 && user.title === "Full-Stack Apprentice") {
          setUser(prev => ({ ...prev, title: "Senior AI Compiler Architect" }));
        }
      }, 900);
    }
  };

  // Action: Completed Lesson Sandbox or theory note
  const handleCompleteLessonReward = (lessonId: string, xpAwardAmount: number = 150) => {
    const isAlreadyCompleted = user.completedLessons.includes(lessonId);

    // 1. Add ID to completed log if not already there
    if (!isAlreadyCompleted) {
      setUser(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      }));
      handleClaimXPReward(xpAwardAmount, "Lesson curriculum challenge parsed!");
    } else {
      triggerToast("Lesson reviewed. Code outputs compiled successfully.", "success");
    }

    // Return back to course detail
    setActiveLesson(null);
    setCurrentTab("courses");
  };

  // Action: Launch a specific lesson inside the Playground Editor
  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentTab("editor");
    triggerToast(`Launching Node: ${lesson.title}`, "success");
  };

  // Action: Selecting a challenge exercises directly loads editor template
  const handleSelectChallenge = (challenge: CodingChallenge) => {
    // Generate a temporary lesson template mimicking that challenge
    const challengeLesson: Lesson = {
      id: challenge.id,
      title: challenge.title,
      type: "playground",
      duration: challenge.difficulty === "Easy" ? 10 : 25,
      codeTemplate: challenge.startingCode,
      solution: challenge.testCases[0]?.expected || "",
      language: challenge.language as any
    };

    setActiveLesson(challengeLesson);
    setCurrentTab("editor");
    triggerToast(`Arena prepped: ${challenge.title}`, "success");
  };

  // Update user general characteristics (title, name, avatar)
  const handleUpdateUserProfile = (updatedFields: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...updatedFields
    }));
    triggerToast("Student records card updated.");
  };

  // Hard Wipe Progressive memory
  const handleResetProgressAll = () => {
    setUser(INITIAL_USER_PROFILE);
    localStorage.removeItem("codemaster_user");
    setSelectedCourse(null);
    setActiveLesson(null);
    setCurrentTab("dashboard");
    triggerToast("Workspace progress cleared. System restored to Level 1");
  };

  // Navigations tab jumper
  const handleNavigationTab = (tab: any) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  // Require Auth page if not logged in
  if (!sessionEmail) {
    return <AuthPage onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Desktop Sidebar Rail Component */}
      <Sidebar 
        currentTab={currentTab} 
        setCurrentTab={(tab) => { handleNavigationTab(tab); setActiveLesson(null); }} 
        user={user} 
        onLogout={handleLogout} 
      />

      {/* 2. Right Side Main panel container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar component */}
        <header className="h-16 border-b border-slate-200 bg-white sticky top-0 z-20 px-6 flex items-center justify-between select-none">
          
          {/* Header left */}
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Menu className="w-5 h-5" />
            </button>

            <p className="font-display font-medium text-slate-800 text-sm md:text-base hidden sm:block">
              Welcome back, <span className="font-bold text-slate-950">{user.name}</span>
            </p>
          </div>

          {/* Quick Stats Pills header bar */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold bg-indigo-50 border border-indigo-150 text-indigo-700 p-1.5 px-3 rounded-lg flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>Level {user.level} Standard</span>
            </span>

            <span className="text-[11px] font-mono font-bold bg-amber-50 border border-amber-150 text-amber-700 p-1.5 px-3 rounded-lg flex items-center gap-1 hidden md:flex">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{user.xp} Progressive XP</span>
            </span>
          </div>

        </header>

        {/* Mobile slide drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-30 md:hidden flex justify-start">
            <div className="bg-slate-950 w-64 h-full p-4 p-5 space-y-6 relative border-r border-slate-800">
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-display font-bold text-white text-sm">CodeMaster AI</span>
              </div>

              {/* Mobile menu items list */}
              <div className="space-y-1.5 pt-4">
                {[
                  { id: "dashboard", label: "Dashboard" },
                  { id: "courses", label: "Courses" },
                  { id: "editor", label: "Code Playground" },
                  { id: "practice", label: "Challenges" },
                  { id: "projects", label: "Project Hub" },
                  { id: "ai_assistant", label: "Gemini AI Buddy" },
                  { id: "career", label: "Career Prep" },
                  { id: "community", label: "Community Forum" },
                  { id: "settings", label: "Profile & Settings" }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { handleNavigationTab(item.id); setActiveLesson(null); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold block ${
                      currentTab === item.id 
                      ? "bg-indigo-600 text-white" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2.5 text-xs text-red-400 font-bold border-t border-slate-900 mt-6"
                >
                  Exit Workstation
                </button>
              </div>
            </div>
            {/* Tap outside to close helper */}
            <div className="flex-grow" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Dynamic tabs controller dashboard renderer */}
        <main className="p-6 max-w-7xl w-full mx-auto flex-1 h-full min-h-0 overflow-y-auto">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab + (selectedCourse ? `-${selectedCourse.id}` : "") + (activeLesson ? `-${activeLesson.id}` : "")}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="h-full"
            >
              
              {currentTab === "dashboard" && (
                <HomeDashboard 
                  user={user} 
                  courses={COURSES} 
                  onStartCourse={(cId) => {
                    const matchedC = COURSES.find(c => c.id === cId);
                    if (matchedC) {
                      setSelectedCourse(matchedC);
                      setCurrentTab("courses");
                    }
                  }} 
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === "courses" && !selectedCourse && (
                <CoursesView 
                  user={user} 
                  courses={COURSES} 
                  onSelectCourse={(course) => setSelectedCourse(course)}
                />
              )}

              {currentTab === "courses" && selectedCourse && (
                <CourseDetail 
                  course={selectedCourse} 
                  user={user} 
                  onBack={() => setSelectedCourse(null)} 
                  onStartLesson={handleStartLesson}
                />
              )}

              {currentTab === "editor" && (
                <CodePlayground 
                  lesson={activeLesson || undefined}
                  user={user} 
                  onSubmitProgress={handleCompleteLessonReward}
                  onBack={() => {
                    setActiveLesson(null);
                    setCurrentTab(selectedCourse ? "courses" : "dashboard");
                  }}
                />
              )}

              {currentTab === "practice" && (
                <PracticeProblems 
                  user={user} 
                  onSelectChallenge={handleSelectChallenge}
                />
              )}

              {currentTab === "projects" && (
                <ProjectHub 
                  user={user} 
                  onClaimXP={(pts) => handleClaimXPReward(pts, "Full structural portfolio completed successfully!")}
                />
              )}

              {currentTab === "ai_assistant" && (
                <AiAssistant />
              )}

              {currentTab === "career" && (
                <CareerPrep />
              )}

              {currentTab === "community" && (
                <CommunityForum />
              )}

              {currentTab === "settings" && (
                <ProfileSettings 
                  user={user} 
                  onUpdateUser={handleUpdateUserProfile} 
                  onResetProgress={handleResetProgressAll}
                />
              )}

            </motion.div>
          </AnimatePresence>

        </main>

      </div>

      {/* DUST OF REY TOAST FLASH PANEL */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-none space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className={`p-4 rounded-xl shadow-xl flex gap-3 items-center border pointer-events-auto shrink-0 relative overflow-hidden text-sans ${
                t.type === "level_up" 
                ? "bg-slate-900 border-indigo-700 text-white" 
                : t.type === "award"
                ? "bg-indigo-900 text-white border-indigo-500"
                : "bg-white text-slate-800 border-slate-150"
              }`}
            >
              {/* Colored top gradient highlights */}
              {t.type === "level_up" && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-amber-500" />
              )}

              <div className="flex-1 text-xs font-semibold font-sans">
                {t.type === "award" ? "⭐ " : t.type === "level_up" ? "🏆 " : ""}
                {t.message}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-200 shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
