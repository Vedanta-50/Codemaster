import React, { useState } from "react";
import { 
  Search, Award, Clock, BookOpen, Star, ChevronRight, Sparkles, Filter 
} from "lucide-react";
import { Course, UserProfile } from "../types";

interface CoursesViewProps {
  user: UserProfile;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export default function CoursesView({ user, courses, onSelectCourse }: CoursesViewProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "frontend" | "backend" | "languages" | "systems" | "ai">("all");

  const categories = [
    { id: "all", label: "All Subjects" },
    { id: "languages", label: "Languages" },
    { id: "frontend", label: "Frontend/Web" },
    { id: "systems", label: "Architecture / Systems" },
    { id: "ai", label: "Generative AI / ML" }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                          course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Search Header banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">Structured Courses Syllabus</h1>
          <p className="text-slate-500 text-sm mt-1">Acquire real technical skills step-by-step with practical playground nodes.</p>
        </div>

        {/* Search Bar filter */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search variables, syntax or hooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-250 bg-slate-50 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-sans"
          />
        </div>
      </div>

      {/* Category Filter Pills slider */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 select-none scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
              activeCategory === cat.id
              ? "bg-slate-950 border-slate-950 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Courses Catalog listings */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map(course => {
            const completedCount = course.modules.reduce((acc, mod) => {
              return acc + mod.lessons.filter(l => user.completedLessons.includes(l.id)).length;
            }, 0);
            
            const totalCount = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
            const progressPercent = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;

            return (
              <div 
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="bg-white border border-slate-200 hover:border-slate-350 hover:shadow-md rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-200"
              >
                
                {/* Visual Header card */}
                <div className={`p-5 bg-gradient-to-br ${course.bannerColor} text-white relative`}>
                  <div className="absolute top-0 right-0 w-32 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold py-0.5 px-2.5 rounded-full bg-white/20 uppercase tracking-widest font-mono text-white">
                      {course.difficulty}
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-white/90">
                      {course.category}
                    </span>
                  </div>
                  
                  <h3 className="font-display font-bold text-lg mt-3 text-white tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-white/80 text-[11px] mt-1 line-clamp-2 max-w-sm">
                    {course.description}
                  </p>
                </div>

                {/* Core details body */}
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
                    <div className="flex items-center gap-1.5 font-sans">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-sans">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{totalCount} lessons loaded</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-indigo-650 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-150">
                      <Star className="w-3.5 h-3.5 fill-indigo-100" />
                      <span>+{course.xpReward} XP</span>
                    </div>
                  </div>

                  {/* Completion bar */}
                  {totalCount > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                        <span>Course Progression</span>
                        <span>{progressPercent}% Complete ({completedCount}/{totalCount})</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Syllabus button line */}
                  <div className="pt-2 border-t border-slate-150 flex items-center justify-between text-indigo-600 hover:text-indigo-800 text-xs font-bold transition-colors">
                    <span>Explore Syllabus modules</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500">
          <BookOpen className="w-8 h-8 text-slate-350 mx-auto mb-2" />
          <p className="font-semibold text-sm">No courses matching selected filters.</p>
          <button 
            onClick={() => { setSearch(""); setActiveCategory("all"); }}
            className="text-xs text-indigo-600 hover:underline font-semibold mt-1"
          >
            Clear current query constraints
          </button>
        </div>
      )}

    </div>
  );
}
