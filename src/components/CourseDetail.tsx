import React from "react";
import { 
  ArrowLeft, BookOpen, Clock, FileText, CheckCircle2, Play, 
  HelpCircle, Sparkles, Star, Award
} from "lucide-react";
import { Course, Lesson, UserProfile } from "../types";

interface CourseDetailProps {
  course: Course;
  user: UserProfile;
  onBack: () => void;
  onStartLesson: (lesson: Lesson) => void;
}

export default function CourseDetail({ course, user, onBack, onStartLesson }: CourseDetailProps) {
  
  // Calculate aggregate course markers
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = course.modules.reduce((acc, m) => {
    return acc + m.lessons.filter(l => user.completedLessons.includes(l.id)).length;
  }, 0);
  
  const pct = totalLessons > 0 ? Math.floor((completedLessons / totalLessons) * 105) : 0; // standard mapping

  const getLessonIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "theory": return FileText;
      case "quiz": return HelpCircle;
      default: return Play;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Course Catalogue
      </button>

      {/* Course Banner card summary */}
      <div className={`p-6 md:p-8 bg-gradient-to-br ${course.bannerColor} text-white rounded-2xl shadow-sm relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] font-bold py-0.5 px-3 rounded-full bg-white/20 uppercase tracking-widest font-mono text-white">
          {course.difficulty} Difficulty Level
        </span>
        
        <h1 className="font-display font-extrabold text-2xl md:text-3xl mt-4 text-white tracking-tight leading-tight">
          {course.title}
        </h1>
        <p className="text-white/80 text-xs md:text-sm mt-2 max-w-2xl font-sans">
          {course.description}
        </p>

        <div className="mt-6 pt-6 border-t border-white/20 flex flex-wrap items-center gap-6 text-xs text-white/90">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-white/80" />
            <span>{course.duration} curriculum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-white/80" />
            <span>{totalLessons} Modular Lessons</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-yellow-300 font-bold">
            <Award className="w-4 h-4" />
            <span>{course.xpReward} XP Reward on completion</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Syllabus List vs Progression Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Module Outlines Section */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold text-slate-700 font-display">COMMENCE STUDY TRACKS:</h2>
          
          {course.modules.length > 0 ? (
            <div className="space-y-4">
              {course.modules.map((module, mIdx) => (
                <div key={module.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  
                  {/* Module header strip */}
                  <div className="bg-slate-50 px-5 py-4 border-b border-slate-150 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-slate-450 uppercase block">MODULE {mIdx + 1}</span>
                      <h3 className="font-bold text-slate-800 text-xs mt-0.5">{module.title}</h3>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                      {module.lessons.length} sections
                    </span>
                  </div>

                  {/* Lessons detail checklist */}
                  <div className="divide-y divide-slate-100 bg-white">
                    {module.lessons.map((lesson) => {
                      const isCompleted = user.completedLessons.includes(lesson.id);
                      const Icon = getLessonIcon(lesson.type);

                      return (
                        <div 
                          key={lesson.id}
                          className="p-4 px-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors gap-4"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 fill-emerald-50" />
                            ) : (
                              <div className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-500 flex items-center justify-center shrink-0">
                                <Icon className="w-3 h-3" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <h4 className={`font-bold text-xs truncate ${isCompleted ? "text-slate-400 line-through" : "text-slate-700"}`}>
                                {lesson.title}
                              </h4>
                              <div className="flex gap-2 items-center text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wide">
                                <span>{lesson.duration} mins</span>
                                <span>•</span>
                                <span className="bg-slate-100 p-0.5 px-1.5 rounded">{lesson.type}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onStartLesson(lesson)}
                            className={`py-1.5 px-3.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                              isCompleted 
                              ? "bg-slate-100 hover:bg-slate-200 text-slate-650"
                              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15"
                            }`}
                          >
                            {isCompleted ? "Review lesson" : "Select Node"}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-1" />
              <span>Syllabus material compilation under preparation by AI. Check back soon!</span>
            </div>
          )}

        </div>

        {/* Course Performance card sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-slate-800 text-xs">Path Completion Metrics</h3>

            <div className="flex items-center justify-between py-2 border-y border-slate-100 font-mono text-[11px] text-slate-500">
              <span>Lessons Complete</span>
              <span className="font-bold text-slate-800">{completedLessons} / {totalLessons}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                <span>Subject progression rating</span>
                <span>{Math.min(100, pct)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 border-2 border-indigo-150 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-950 block">AI Homework Advice:</span>
                Submit three clean loops practice templates inside the terminal below to trigger an automated 100XP milestone reward!
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
