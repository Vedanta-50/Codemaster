import React, { useState } from "react";
import { 
  FolderCode, Star, Clock, Laptop, Play, CheckSquare, 
  Square, ChevronRight, Award, Sparkles, BookOpen 
} from "lucide-react";
import { ProjectGuide, UserProfile } from "../types";
import { PROJECTS } from "../data";

interface ProjectHubProps {
  user: UserProfile;
  onClaimXP: (points: number) => void;
}

export default function ProjectHub({ user, onClaimXP }: ProjectHubProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectGuide | null>(null);
  
  // Track checked checkboxes by project-id-step-index-subtask-index
  const [checkedLogs, setCheckedLogs] = useState<Record<string, boolean>>({});

  const toggleSubtask = (projId: string, sIdx: number, subIdx: number) => {
    const key = `${projId}-${sIdx}-${subIdx}`;
    setCheckedLogs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateProgression = (proj: ProjectGuide) => {
    let totalSubtasks = 0;
    let checkedSubtasks = 0;

    proj.steps.forEach((step, sIdx) => {
      step.subtasks.forEach((_, subIdx) => {
        totalSubtasks++;
        const key = `${proj.id}-${sIdx}-${subIdx}`;
        if (checkedLogs[key]) {
          checkedSubtasks++;
        }
      });
    });

    if (totalSubtasks === 0) return 0;
    return Math.floor((checkedSubtasks / totalSubtasks) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Visual strip */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">Interactive Project Guides</h1>
          <p className="text-slate-500 text-sm mt-1">Translate theory into beautiful full-stack projects. Build portfolio-grade websites step-by-step.</p>
        </div>
        
        {selectedProject && (
          <button 
            onClick={() => setSelectedProject(null)}
            className="text-xs font-bold text-slate-550 hover:text-slate-850 cursor-pointer"
          >
            ← Back to Hub Overview
          </button>
        )}
      </div>

      {!selectedProject ? (
        // Grid lists of Projects available
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PROJECTS.map(proj => {
            const pct = calculateProgression(proj);

            return (
              <div 
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-350 hover:shadow-md cursor-pointer flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase leading-none border ${
                      proj.difficulty === "Beginner" 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-150" 
                      : proj.difficulty === "Intermediate"
                      ? "bg-amber-50 text-amber-600 border-amber-150"
                      : "bg-rose-50 text-rose-600 border-rose-150"
                    }`}>
                      {proj.difficulty}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 px-2 rounded border border-indigo-150">
                      +{proj.xpReward} XP
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-slate-900 text-sm">{proj.title}</h3>
                  <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{proj.description}</p>
                  
                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.technologies.map(tech => (
                      <span key={tech} className="bg-slate-100 text-slate-650 text-[9px] font-mono px-1.5 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Growth slider tracking */}
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-1.5 select-none">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-450 leading-none">
                    <span>Task Milestones List</span>
                    <span>{pct}% checklist</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-350 ${pct >= 100 ? "bg-emerald-500" : "bg-indigo-600"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        // Detailed Project Interactive steps list
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main detailed checkboxes column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <h2 className="font-display font-bold text-slate-900 text-base">{selectedProject.title}</h2>
                  <span className="bg-indigo-50 border border-indigo-150 font-bold font-mono text-[10px] text-indigo-700 p-1 px-2.5 rounded">
                    Completing tracks gains +{selectedProject.xpReward} XP
                  </span>
                </div>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Steps row rendering */}
              <div className="mt-6 space-y-6 select-none font-sans">
                {selectedProject.steps.map((step, sIdx) => (
                  <div key={sIdx} className="space-y-3.5 p-4 bg-slate-50 rounded-xl border border-slate-150">
                    <div className="flex justify-between items-center bg-white p-2.5 px-3.5 border border-slate-100 rounded-lg">
                      <span className="font-bold text-xs text-slate-800">{step.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">Phase {sIdx + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed pl-1">{step.explanation}</p>

                    {/* Checkboxes tasks */}
                    <div className="space-y-2 pt-1">
                      {step.subtasks.map((sub, subIdx) => {
                        const key = `${selectedProject.id}-${sIdx}-${subIdx}`;
                        const isChecked = checkedLogs[key];

                        return (
                          <div 
                            key={subIdx}
                            onClick={() => toggleSubtask(selectedProject.id, sIdx, subIdx)}
                            className="p-3 bg-white hover:bg-slate-50 border border-slate-150 rounded-lg flex items-center gap-3 cursor-pointer transition-colors"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-405 shrink-0" />
                            )}
                            <span className={`text-[11px] leading-relaxed ${isChecked ? "text-slate-400 line-through" : "text-slate-700 font-medium"}`}>
                              {sub}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar claim card */}
          <div className="space-y-6">
            
            {/* XP Claim box stats */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-850 text-xs">Project Checklist Progression</h3>
              
              <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100 font-mono text-slate-500">
                <span>Completed Tasks percent</span>
                <span className="font-bold text-slate-800">{calculateProgression(selectedProject)}%</span>
              </div>

              {calculateProgression(selectedProject) >= 100 ? (
                <button
                  onClick={() => {
                    onClaimXP(selectedProject.xpReward);
                    setSelectedProject(null);
                  }}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/15 cursor-pointer"
                >
                  <Award className="w-4 h-4" /> Claim Project Reward +{selectedProject.xpReward} XP
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-2.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-lg text-xs font-semibold leading-relaxed cursor-not-allowed"
                >
                  Verify all checkboxes to finish
                </button>
              )}

              <div className="p-3.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[11px] text-slate-600 leading-relaxed flex items-start gap-1.5 font-sans">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-950 block">AI Homework Advice:</span>
                  Open our Code Playground tab to test variables, write HTML scripts, or request code formatting templates in real-time.
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
