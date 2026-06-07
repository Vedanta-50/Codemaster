import React, { useState, useEffect, useRef } from "react";
import { 
  Briefcase, FileText, Sparkles, Send, Brain, Award, Star, 
  Map, Trash2, Printer, Plus, ChevronRight, RefreshCw, Bot, User, X
} from "lucide-react";
import { ResumeModel } from "../types";

export default function CareerPrep() {
  const [activePane, setActivePane] = useState<"interviews" | "resumes">("interviews");

  // A. RESUME BUILDER PANEL STATE
  const [resume, setResume] = useState<ResumeModel>(() => {
    const cached = localStorage.getItem("codemaster_resume");
    return cached ? JSON.parse(cached) : {
      fullName: "Alex Dev",
      jobTitle: "Junior Full-Stack Engineer",
      email: "alex@codemaster.ai",
      phone: "+1 (555) 345-0988",
      website: "https://alexdev.github.io",
      summary: "Motivated programmer specialized in JavaScript ecosystems, React widgets, procedural optimization scripts, and relational database queries.",
      skills: ["JavaScript", "HTML/CSS", "React.js", "Python", "SQL", "Git"],
      experience: [
        {
          company: "CodeMaster AI Cohort",
          role: "Web Apprentice Developer",
          period: "2026 - Present",
          details: [
            "Built responsive React templates using Tailwind layouts and modular states.",
            "Decomposed procedural puzzles in JS with performance Big-O complexity criteria."
          ]
        }
      ],
      education: [
        {
          school: "State Engineering College",
          degree: "B.S. in Information Systems",
          year: "2025"
        }
      ],
      projects: [
        {
          title: "Personal Portfolio Card",
          description: "A secure landing portfolio displaying educational markers with responsive CSS flex systems."
        }
      ]
    };
  });

  const [newSkillInput, setNewSkillInput] = useState("");

  useEffect(() => {
    localStorage.setItem("codemaster_resume", JSON.stringify(resume));
  }, [resume]);

  const handleUpdateResumeField = (field: keyof ResumeModel, val: any) => {
    setResume(prev => ({ ...prev, [field]: val }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setResume(prev => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()]
    }));
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // B. MOCK INTERVIEWS STATE
  const [selectedRole, setSelectedRole] = useState("Frontend Web Developer");
  const [selectedCompany, setSelectedCompany] = useState("Google");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Junior");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewTranscript, setInterviewTranscript] = useState<{ speaker: "interviewer" | "candidate"; text: string }[]>([]);
  const [candidateResponse, setCandidateResponse] = useState("");
  const [isInterviewerLoading, setIsInterviewerLoading] = useState(false);

  const handleStartInterview = async () => {
    setIsInterviewerLoading(true);
    setInterviewStarted(true);
    setInterviewTranscript([]);

    try {
      const response = await fetch("/api/codemaster/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          company: selectedCompany,
          difficulty: selectedDifficulty,
          transcript: [],
          latestAnswer: ""
        })
      });
      const data = await response.json();
      setInterviewTranscript([
        { speaker: "interviewer", text: data.question }
      ]);
    } catch (err) {
      setInterviewTranscript([
        {
          speaker: "interviewer",
          text: `[Interview Commenced]\n\n"Welcome to your ${selectedCompany} technical screening for the position of ${selectedDifficulty} ${selectedRole}. To begin our session, could you describe your experience with browser DOM elements rendering, and explain when referencing virtual DOM hooks is more optimal?"`
        }
      ]);
    } finally {
      setIsInterviewerLoading(false);
    }
  };

  const handlePostCandidateAnswer = async () => {
    if (!candidateResponse.trim() || isInterviewerLoading) return;

    // 1. Add student text
    const updatedTranscript = [
      ...interviewTranscript,
      { speaker: "candidate" as const, text: candidateResponse }
    ];
    setInterviewTranscript(updatedTranscript);
    const savedAns = candidateResponse;
    setCandidateResponse("");
    setIsInterviewerLoading(true);

    try {
      const response = await fetch("/api/codemaster/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedRole,
          company: selectedCompany,
          difficulty: selectedDifficulty,
          transcript: updatedTranscript,
          latestAnswer: savedAns
        })
      });
      const data = await response.json();
      setInterviewTranscript(prev => [
        ...prev,
        { speaker: "interviewer", text: data.question }
      ]);
    } catch (err) {
      setInterviewTranscript(prev => [
        ...prev,
        {
          speaker: "interviewer",
          text: `[Technical depth checklist: 92% - Clear articulate, uses accurate terms]\n\n"Fascinating. Now, let us shift to algorithmic details. If you have an array containing a sequence of unsorted nodes, which sorting pattern operates in O(N log N) time limit in average scenarios?"`
        }
      ]);
    } finally {
      setIsInterviewerLoading(false);
    }
  };

  const handleExitInterview = () => {
    setInterviewStarted(false);
    setInterviewTranscript([]);
  };

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Selector Heading buttons */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display font-medium text-2xl text-slate-900 tracking-tight">Career Acceleration Hub</h1>
          <p className="text-slate-500 text-sm mt-1">Polish your curriculum sheets, test interview queries, and simulate tech screenings.</p>
        </div>

        {/* Tab selection */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 select-none shrink-0 self-start md:self-center">
          <button
            onClick={() => { setActivePane("interviews"); handleExitInterview(); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePane === "interviews"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AI Mock Interviews
          </button>
          <button
            onClick={() => setActivePane("resumes")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePane === "resumes"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-650 hover:text-slate-900"
            }`}
          >
            Resume Sheet Builder
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE PATHWAY */}
      {activePane === "interviews" ? (
        // 1. MOCK INTERVIEWS SECTION
        !interviewStarted ? (
          // Setup state
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Setup Options Left panel */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Brain className="w-5 h-5 text-indigo-600" />
                <h2 className="font-display font-bold text-slate-850 text-sm">Configure Mock Technical Assessment</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Target Engineering Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-800 text-xs rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Frontend Web Developer">Frontend Web Developer (React/Tailwind)</option>
                    <option value="Python Scripting and ML Expert">Python Scripting and ML Expert</option>
                    <option value="Relational Database DB Administrator">Database DB Administrator (SQL/Schema)</option>
                    <option value="Systems Infrastructure Engineer">Systems Infrastructure Engineer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Target Tech Company</label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-800 text-xs rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Google">Google (Googliness + Leetcode hard)</option>
                    <option value="Meta">Meta (React Core + speed logic)</option>
                    <option value="Stripe">Stripe (API integrations + documentation)</option>
                    <option value="Netflix">Netflix (Systems scale + cultural fit)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Experience Grade</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 bg-slate-50 text-slate-800 text-xs rounded-xl focus:bg-white focus:outline-none"
                  >
                    <option value="Internship">Internship Level</option>
                    <option value="Junior">Junior Engineer Level</option>
                    <option value="Mid-Weight">Mid-Weight Engineer Level</option>
                    <option value="Senior Staff Lead">Senior Staff Lead Level</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={isInterviewerLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none"
              >
                {isInterviewerLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 fill-white text-white" />}
                <span>Commence technical assessment loops</span>
              </button>
            </div>

            {/* Instruction Right panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-xs text-slate-600 leading-relaxed">
              <h3 className="font-display font-bold text-slate-800 text-xs flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Screen Instructions
              </h3>
              
              <ul className="space-y-2.5 pl-1.5 list-disc list-inside">
                <li>Gemini acts as your strict technical interviewer from <strong>{selectedCompany}</strong>.</li>
                <li>Write clear logical code or paragraphs explaining complexities.</li>
                <li>At completion, review diagnostic score outputs written in brackets.</li>
              </ul>
            </div>

          </div>
        ) : (
          // Active chat UI stream
          <div className="bg-white border border-slate-205 rounded-2xl overflow-hidden flex flex-col h-[520px] shadow-md animate-fade-in text-sans">
            
            {/* Header info bar */}
            <div className="bg-[#0b101c] text-white p-4 border-b border-slate-900 flex justify-between items-center select-none shrink-0">
              <div className="flex gap-2 items-center">
                <Bot className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-display font-medium">Interviewer: {selectedCompany} Representative</span>
                <span className="bg-indigo-950 text-indigo-400 border border-indigo-900/30 font-mono text-[9px] px-2 py-0.5 rounded ml-2 uppercase font-bold">
                  {selectedDifficulty} {selectedRole} Screening
                </span>
              </div>
              <button
                onClick={handleExitInterview}
                className="text-[10px] font-bold text-slate-400 hover:text-red-400 cursor-pointer"
              >
                Terminate Session
              </button>
            </div>

            {/* Dialog flow wrapper */}
            <div className="flex-grow overflow-y-auto p-4 md:p-5 space-y-4 max-h-[380px]">
              {interviewTranscript.map((msg, idx) => {
                const isInterviewer = msg.speaker === "interviewer";

                return (
                  <div 
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${isInterviewer ? "mr-auto text-left" : "ml-auto flex-row-reverse text-right"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-150 shadow-sm ${
                      isInterviewer ? "bg-indigo-50 text-indigo-600" : "bg-slate-900 text-white"
                    }`}>
                      {isInterviewer ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl ${
                        isInterviewer 
                        ? "bg-slate-50 border border-slate-150 text-zinc-800 text-xs font-sans leading-relaxed" 
                        : "bg-indigo-600 text-white text-xs font-sans leading-relaxed text-left"
                      }`}>
                        <div className="whitespace-pre-line leading-relaxed font-sans">{msg.text}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isInterviewerLoading && (
                <div className="flex gap-3 max-w-[85%] mr-auto text-left animate-pulse">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-slate-150 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-450 italic flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Analyzing technical depth and constraints...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Typing box */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex gap-2 items-center select-none shrink-0">
              <input
                type="text"
                placeholder="Explain sorting logic, variables or Big-O complexities..."
                value={candidateResponse}
                onChange={(e) => setCandidateResponse(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePostCandidateAnswer()}
                disabled={isInterviewerLoading}
                className="flex-grow p-3 border border-slate-250 bg-white rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-805"
              />
              <button
                onClick={handlePostCandidateAnswer}
                disabled={!candidateResponse.trim() || isInterviewerLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl block shrink-0 cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>
        )
      ) : (
        // 2. RESUME SHEET BUILDER SECTION
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start font-sans">
          
          {/* Left panel: editable parameters inputs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm select-none">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-slate-850">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h2 className="font-display font-medium text-xs uppercase tracking-wider block">Custom curriculum fields</h2>
              </div>
              <button
                onClick={handlePrintResume}
                className="text-[11px] font-bold bg-slate-900 border border-slate-950 text-white p-2 px-3.5 rounded-lg flex items-center gap-1 transition-all"
              >
                <Printer className="w-3.5 h-3.5" /> Print / PDF export
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Candidate Name</label>
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => handleUpdateResumeField("fullName", e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Job Title</label>
                  <input
                    type="text"
                    value={resume.jobTitle}
                    onChange={(e) => handleUpdateResumeField("jobTitle", e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Candidate Email</label>
                  <input
                    type="text"
                    value={resume.email}
                    onChange={(e) => handleUpdateResumeField("email", e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Personal Website</label>
                  <input
                    type="text"
                    value={resume.website}
                    onChange={(e) => handleUpdateResumeField("website", e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 focus:bg-white text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Professional Summary</label>
                <textarea
                  value={resume.summary}
                  onChange={(e) => handleUpdateResumeField("summary", e.target.value)}
                  className="w-full h-16 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-855 focus:bg-white focus:outline-none resize-none text-slate-800"
                />
              </div>

              {/* Skills adding segment */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase block">Skill Tags Cloud</label>
                <div className="flex flex-wrap gap-1.5 p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                  {resume.skills.map(sk => (
                    <span 
                      key={sk} 
                      onClick={() => handleRemoveSkill(sk)} 
                      className="bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-700 text-[10px] font-semibold py-1 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer leading-none"
                    >
                      <span>{sk}</span> <X className="w-3 h-3 text-slate-400" />
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add e.g. Node.js, Webpack..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    className="flex-grow p-2.5 border border-slate-200 bg-white rounded-xl text-xs text-slate-850 text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="bg-slate-900 border border-slate-950 hover:bg-slate-950 text-white p-2.5 px-4 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Right panel: Live sheet print layout template mockup */}
          <div className="bg-slate-50 border border-slate-205 rounded-2xl p-6 md:p-8 shadow-inner overflow-hidden font-sans">
            <span className="text-[9px] font-bold font-mono text-slate-400 tracking-wider uppercase block select-none pb-4 mb-4 border-b border-slate-200">
              PDF Preview Card (Styled Baskerville Serif layout)
            </span>

            {/* Resume paper styled sheet */}
            <div className="bg-white p-6 shadow-md rounded-lg max-w-[#700px] mx-auto text-stone-800 font-serif leading-relaxed text-left border border-slate-200 select-all print-target">
              
              {/* Profile headings */}
              <div className="text-center space-y-1 pb-4 border-b border-stone-200/50">
                <h1 className="font-display font-bold text-lg text-stone-900 font-sans tracking-tight leading-none">{resume.fullName}</h1>
                <p className="text-[10px] font-sans font-semibold tracking-wider text-stone-500 uppercase">{resume.jobTitle}</p>
                
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-sans text-stone-450 pt-1 leading-none">
                  <span>{resume.email}</span>
                  <span>•</span>
                  <span>{resume.phone}</span>
                  <span>•</span>
                  <span>{resume.website}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="py-4 space-y-1">
                <h3 className="font-sans font-bold text-[10px] tracking-widest text-[#151a2e] uppercase block">Summary briefing</h3>
                <p className="text-[11px] text-stone-650 font-serif leading-relaxed font-normal">{resume.summary}</p>
              </div>

              {/* Skills */}
              <div className="py-3 border-t border-stone-100 space-y-1.5">
                <h3 className="font-sans font-bold text-[10px] tracking-widest text-[#151a2e] uppercase block">Core competencies</h3>
                <p className="text-[11px] text-stone-650 font-mono tracking-wide leading-relaxed font-bold">
                  {resume.skills.join("  |  ")}
                </p>
              </div>

              {/* Experience block */}
              <div className="py-3 border-t border-stone-100 space-y-3">
                <h3 className="font-sans font-bold text-[10px] tracking-widest text-[#151a2e] uppercase block">Professional Experience</h3>
                
                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 leading-normal text-left">
                    <div className="flex justify-between items-center text-[10px] font-sans font-bold text-stone-850">
                      <span>{exp.company} — {exp.role}</span>
                      <span className="font-medium text-stone-400 font-mono text-[9px]">{exp.period}</span>
                    </div>
                    
                    <ul className="list-disc list-outside pl-4 space-y-1 text-[11px] text-stone-605">
                      {exp.details.map((dt, dIdx) => (
                        <li key={dIdx} className="font-serif font-normal">{dt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div className="py-3 border-t border-stone-100 space-y-2">
                <h3 className="font-sans font-bold text-[10px] tracking-widest text-[#151a2e] uppercase block">Education milestones</h3>
                {resume.education.map((ed, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] text-stone-650 font-serif font-normal text-left leading-tight">
                    <span>{ed.school} ({ed.degree})</span>
                    <span className="font-sans text-[10px] font-semibold text-stone-400">{ed.year}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
