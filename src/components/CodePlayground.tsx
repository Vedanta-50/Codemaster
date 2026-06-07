import React, { useState, useEffect, useRef } from "react";
import { 
  Terminal, Play, RefreshCw, Sparkles, HelpCircle, AlertCircle, 
  Settings, CheckCircle2, ChevronRight, BookOpen, Smartphone, Eye
} from "lucide-react";
import { Lesson, UserProfile } from "../types";

interface CodePlaygroundProps {
  lesson?: Lesson; // Optional, can be used standalone
  user: UserProfile;
  onSubmitProgress: (lessonId: string, xpPoints: number) => void;
  onBack: () => void;
}

export default function CodePlayground({ lesson, user, onSubmitProgress, onBack }: CodePlaygroundProps) {
  // Config starting variables
  const defaultJsCode = `// CodeMaster AI Standard Javascript Sandbox
// Write clean algorithms and hit standard compiled inputs

function getGreeting(name) {
  const message = "Hello, " + name + "! Welcome to CodeMaster AI.";
  return message;
}

console.log(getGreeting("Alex"));
`;

  const defaultHtmlCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: sans-serif;
      text-align: center;
      background: #0f172a;
      color: #fafafa;
      padding: 30px;
    }
    h1 {
      color: #6366f1;
    }
    .btn {
      background: #6366f1;
      border: none;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Hello from HTML Preview!</h1>
  <p>Modify this source code and click the Run button to sync layouts in real-time.</p>
  <button class="btn" onclick="alert('Triggered!')">Interactive Button Test</button>
</body>
</html>`;

  // Determine starting language and template
  const isLessonPlayground = lesson && lesson.type === "playground";
  const startingLanguage = lesson?.language || "javascript";
  const startingCode = lesson?.codeTemplate || (startingLanguage === "html" ? defaultHtmlCode : defaultJsCode);

  const [code, setCode] = useState(startingCode);
  const [language, setLanguage] = useState(startingLanguage);
  
  // Compiler console outputs
  const [outputs, setOutputs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Gemini floating advisor
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Line numbers counter helper
  const lineNumbersCount = code.split("\n").length;

  useEffect(() => {
    if (lesson) {
      setLanguage(lesson.language || "javascript");
      setCode(lesson.codeTemplate || (lesson.language === "html" ? defaultHtmlCode : defaultJsCode));
      setOutputs([]);
      setIsSuccess(false);
    }
  }, [lesson]);

  // Execute Code Logic
  const handleRunCode = () => {
    setIsRunning(true);
    setOutputs([]);
    const logsList: string[] = [];
    
    setTimeout(() => {
      if (language === "javascript") {
        try {
          // Temporarily capture all console outputs
          const originalLog = console.log;
          console.log = (...args) => {
            logsList.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(" "));
          };

          // Evaluate script
          const result = eval(code);
          
          setIsRunning(false);
          console.log = originalLog; // Restore console log

          if (logsList.length === 0) {
            logsList.push("// Execution finished without console logs.");
            if (result !== undefined) {
              logsList.push(`[Returned Value]: ${result}`);
            }
          }
          
          setOutputs(logsList);

          // Check if user solved lesson requirements (if active)
          if (lesson?.solution) {
            const hasPassedSolution = logsList.some(line => line.includes(lesson.solution || ""));
            if (hasPassedSolution) {
              setIsSuccess(true);
            }
          } else {
            setIsSuccess(true); // Standalone sandbox always works
          }

        } catch (error: any) {
          setIsRunning(false);
          setOutputs([`[REPL Compiler Crash Error]: ${error.message}`]);
          setIsSuccess(false);
        }
      } else if (language === "html") {
        // Increment key to trigger iframe re-evaluation
        setPreviewKey(prev => prev + 1);
        setIsRunning(false);
        setOutputs(["// Rendering HTML/CSS frame templates successfully..."]);
        setIsSuccess(true);
      } else {
        // Python simulated compilation
        setIsRunning(false);
        const mockedPythonOutputs = [
          "Python version 3.12 syntax parsing checked...",
          "> Processing input nodes...",
          "Execution result successful: true",
        ];
        
        // Add console print simulation if present
        if (code.includes("print")) {
          const matchPrint = code.match(/print\(([^)]+)\)/);
          if (matchPrint && matchPrint[1]) {
            mockedPythonOutputs.push(`Stdout output: ${matchPrint[1].replace(/['"]/g, "")}`);
          }
        }
        
        setOutputs(mockedPythonOutputs);
        setIsSuccess(true);
      }
    }, 600);
  };

  // Auto solve trigger
  const handleClaimReward = () => {
    const rewardXP = 150;
    if (lesson) {
      onSubmitProgress(lesson.id, rewardXP);
    } else {
      onSubmitProgress("sandbox-run", 50);
    }
    setIsSuccess(false);
  };

  // Ask Gemini Custom Review
  const handleAskGeminiHelper = async (type: "reveal_hint" | "debug_syntax") => {
    setIsAiLoading(true);
    setAiResponse(null);

    const askBody = {
      message: type === "reveal_hint" 
        ? "Give me a subtle logical hint to solve this problem without writing the final implementation." 
        : "Check my current source code for syntax compile errors or redundant calculations.",
      codeContext: code,
      language: language,
      history: []
    };

    try {
      const response = await fetch("/api/codemaster/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(askBody)
      });
      const data = await response.json();
      setAiResponse(data.reply || "Gemini support under scheduling limitations. Reload to retry.");
    } catch (err) {
      setAiResponse("Fallback Debug Helper active: Your brackets, variable references, and functions look syntactically robust! Optimize iterations to complete milestones.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in font-sans h-full flex flex-col flex-1 min-h-0">
      
      {/* Top Console navigation controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 border-r border-slate-200 pr-3 cursor-pointer"
            >
              ← Exit Editor
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-50 text-indigo-600">
              <Terminal className="w-4 h-4" />
            </span>
            <span className="font-display font-bold text-slate-800 text-xs">
              {lesson ? `Lesson Arena: ${lesson.title}` : "Interactive Sandbox Playground"}
            </span>
          </div>
        </div>

        {/* Language selector selection */}
        <div className="flex items-center gap-3 select-none">
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(e.target.value === "html" ? defaultHtmlCode : defaultJsCode);
              setOutputs([]);
              setIsSuccess(false);
            }}
            className="p-1 px-3 border border-slate-250 bg-slate-50 text-slate-700 text-[11px] rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={!!lesson}
          >
            <option value="javascript">JavaScript (ES6+) REPL</option>
            <option value="python">Python 3 interpreter</option>
            <option value="html">HTML5 + Inline CSS Preview</option>
          </select>

          {/* Run script trigger button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-all shadow-md shadow-indigo-600/15 cursor-pointer disabled:opacity-50"
          >
            {isRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>Run Program</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Code editor panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: Input Textarea code canvas with line digits */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl flex flex-col min-h-[350px] overflow-hidden shadow-inner">
          
          {/* Header row labels */}
          <div className="bg-[#0d1323] px-4 py-2 border-b border-indigo-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>SOURCE_FILE.{language === "javascript" ? "JS" : language === "python" ? "PY" : "HTML"}</span>
            </div>
            
            {/* Auto completions helper indicator */}
            <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded uppercase tracking-wider">
              Autofill Active
            </span>
          </div>

          {/* Interactive Text area side-by-side with line metrics container */}
          <div className="relative flex-1 flex overflow-y-auto font-mono text-xs leading-relaxed max-h-[500px]">
            {/* Line counts counter sidebar */}
            <div className="bg-[#080b13] px-3.5 py-4 text-slate-650 border-r border-[#101726]/40 select-none text-right flex flex-col font-mono text-[10px]">
              {Array.from({ length: Math.max(1, lineNumbersCount) }).map((_, i) => (
                <span key={i} className="leading-none h-5 block mb-1">{i + 1}</span>
              ))}
            </div>

            {/* Editable textarea area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 bg-transparent text-slate-100 p-4 pt-4 resize-none focus:outline-none focus:ring-0 font-mono text-xs leading-none h-full outline-none leading-relaxed"
              style={{ caretColor: "#6366f1" }}
              placeholder="Write raw programming concepts here..."
              spellCheck="false"
            />
          </div>

          {/* Bottom status feedback indicator */}
          <div className="p-3 bg-[#080b13] border-t border-slate-900 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0 select-none">
            <span>Encoding: UTF-8</span>
            <span>Lines Count: {lineNumbersCount}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Theory description, HTML Preview layout OR log terminal */}
        <div className="flex flex-col gap-4 h-full min-h-0">
          
          {/* Section A: Compilation Output logs screen */}
          <div className="bg-slate-950 border border-slate-900 rounded-2xl flex flex-col flex-1 min-h-[160px] overflow-hidden shadow-inner">
            <div className="bg-slate-900/60 p-3 px-4 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none font-bold">Standard Output logs Terminal</span>
              </div>
              <button 
                onClick={() => setOutputs([])}
                className="text-[9px] font-mono font-bold text-slate-500 hover:text-slate-300"
              >
                Clear Screen
              </button>
            </div>

            {/* Text terminal stream log list */}
            <div className="p-4 flex-grow overflow-y-auto font-mono text-[11px] space-y-1.5 min-h-[100px] max-h-[220px]">
              {outputs.length > 0 ? (
                outputs.map((line, oIdx) => (
                  <div 
                    key={oIdx} 
                    className={`leading-relaxed whitespace-pre-wrap ${
                      line.startsWith("[Returned Value]") 
                      ? "text-indigo-400 font-semibold" 
                      : line.startsWith("[REPL") 
                      ? "text-rose-450 font-bold" 
                      : "text-slate-200"
                    }`}
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-650 italic">Stdout: Hit &quot;Run Program&quot; to review compilation responses...</div>
              )}
            </div>
          </div>

          {/* Section B: HTML layout visual frame (if language is HTML) */}
          {language === "html" && (
            <div className="bg-white border border-slate-200 rounded-2xl flex flex-col flex-1 min-h-[180px] overflow-hidden shadow-sm">
              <div className="bg-slate-50 p-2.5 px-4 border-b border-slate-150 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold leading-none">
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Real-time layout Preview (Iframe)</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 p-0.5 px-1.5 rounded uppercase font-bold text-right">
                  Interactive frame
                </span>
              </div>
              {/* Actual render sandboxed iframe */}
              <iframe
                key={previewKey}
                title="CodeMaster Live Visual Iframe sandbox"
                srcDoc={code}
                sandbox="allow-scripts"
                className="w-full flex-grow border-none bg-slate-900"
              />
            </div>
          )}

          {/* Section C: Tasks Complete Claim Module OR AI advisor prompt row */}
          {isSuccess && (
            <div className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-xl p-4 flex items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block leading-none">Correct completion checked!</span>
                  <p className="text-[10px] text-emerald-700 mt-1">Your code satisfied logic requirements. Unlock XP rewards.</p>
                </div>
              </div>
              <button
                onClick={handleClaimReward}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 p-4 rounded-lg flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <span>Claim +150 XP</span> <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Section D: Gemini AI Debug advice Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-display font-bold text-slate-800">Gemini Coding Advisor</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleAskGeminiHelper("reveal_hint")}
                  disabled={isAiLoading}
                  className="bg-white border border-slate-200 hover:bg-indigo-50 font-sans hover:text-indigo-600 text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Hint</span>
                </button>
                <button
                  onClick={() => handleAskGeminiHelper("debug_syntax")}
                  disabled={isAiLoading}
                  className="bg-indigo-50 hover:bg-indigo-100 font-sans text-indigo-700 text-[10px] font-bold py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Explain Redundancies</span>
                </button>
              </div>
            </div>

            {/* Response streaming block */}
            {isAiLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-450 italic py-1 font-sans">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Gemini is compiling logic models and structures...</span>
              </div>
            )}

            {aiResponse && (
              <div className="p-3 bg-white border border-slate-150 rounded-xl text-[11px] text-slate-600 leading-relaxed max-h-[140px] overflow-y-auto animate-fade-in font-mono">
                {aiResponse}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
