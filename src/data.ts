import { Course, CodingChallenge, ProjectGuide, UserProfile, ForumPost } from "./types";

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Alex Dev",
  email: "alex@codemaster.ai",
  title: "Full-Stack Apprentice",
  avatar: "💻",
  level: 1,
  xp: 0,
  xpNextLevel: 500,
  streak: 0,
  totalHours: 0,
  badges: [],
  goals: [
    { id: "g1", description: "Solve Coding Challenges", target: 5, current: 0 },
    { id: "g2", description: "Daily Learning Streak", target: 7, current: 0 },
    { id: "g3", description: "Earn Progressive XP", target: 1000, current: 0 }
  ],
  completedCourses: [],
  completedLessons: [],
  solvedChallenges: [],
  timelineActivity: [
    { date: "2026-06-01", count: 0 },
    { date: "2026-06-02", count: 0 },
    { date: "2026-06-03", count: 0 },
    { date: "2026-06-04", count: 0 },
    { date: "2026-06-05", count: 0 },
    { date: "2026-06-06", count: 0 },
    { date: "2026-06-07", count: 0 }
  ],
  resumeData: {
    fullName: "Alex Dev",
    jobTitle: "Junior Software Engineer",
    email: "alex@codemaster.ai",
    phone: "+1 (555) 345-0988",
    website: "https://alexdev.github.io",
    summary: "Dedicated and motivated candidate. Polishing full-stack skills on CodeMaster AI.",
    skills: ["JavaScript", "HTML/CSS", "React.js", "Python", "SQL", "Git"],
    experience: [],
    education: [],
    projects: []
  }
};

export const COURSES: Course[] = [
  {
    id: "javascript-basics",
    title: "Mastering JavaScript (ES6+)",
    description: "Go from total novice to building real interactive behaviors. Learn scope, variables, state, DOM manipulation, promises, async/await and array reductions.",
    category: "languages",
    difficulty: "Beginner",
    duration: "8h total",
    icon: "Code",
    xpReward: 800,
    bannerColor: "from-amber-400 to-yellow-600",
    modules: [
      {
        id: "js-mod-1",
        title: "First Steps & Variables",
        lessons: [
          {
            id: "js-intro-1",
            title: "Introduction to JavaScript",
            type: "theory",
            duration: 10,
            theoryContent: `# Introduction to JavaScript

JavaScript is the scripting language of the web. Alongside HTML (structure) and CSS (styling), JavaScript allows you to build dynamic, fully interactive user experiences.

### Key Characteristics
1. **Dynamic Typing**: Variables hold values, not rigid definitions.
2. **First-Class Functions**: Functions can be assigned to structures, passed as parameters, and returned securely.
3. **Event-Driven**: JS reacts to user clicks, input changes, fetches, and timed triggers.

### The Modern Engine (V8)
Your browser compilation utilizes the V8 engine (or similar, like SpiderMonkey) to compile JavaScript code directly to native machine instructions just-in-time (JIT). This allows websites to run calculations at amazing speeds.`
          },
          {
            id: "js-intro-2",
            title: "Variables and Data Types",
            type: "playground",
            duration: 15,
            codeTemplate: `// Let's declare some variables!
let developerName = "Alex";
const graduationYear = 2026;
let isLearning = true;

// 1. Change the name of the developer to your own name:
developerName = "CodeMaster Student";

// 2. Log them in the console!
console.log("Developer name is: " + developerName);
console.log("Graduation Year is: " + graduationYear);
console.log("Are they learning? " + isLearning);
`,
            language: "javascript",
            solution: "console.log"
          }
        ]
      },
      {
        id: "js-mod-2",
        title: "Logic & Control Flow",
        lessons: [
          {
            id: "js-logic-1",
            title: "Conditional Statements (If/Else)",
            type: "quiz",
            duration: 12,
            quizQuestions: [
              {
                id: "jsq1",
                question: "Which keyword is used to declare a variable that CANNOT be reassigned?",
                options: ["let", "var", "const", "static"],
                correctAnswerIndex: 2,
                explanation: "The 'const' keyword creates a read-only scientific reference. It cannot be reassigned after declaration."
              },
              {
                id: "jsq2",
                question: "What does the strict equality operator '===' compare in JavaScript?",
                options: ["Values only", "Values and Types", "Memory Addresses only", "Identifiers"],
                correctAnswerIndex: 1,
                explanation: "The '===' operator checks both value and type without performing implicit coercion, whereas '==' performs type coercion before testing."
              }
            ]
          },
          {
            id: "js-logic-2",
            title: "Loops: For & While iterations",
            type: "playground",
            duration: 20,
            codeTemplate: `// Let's write a loop to count even numbers between 1 and 10!
console.log("Starting countdown of even numbers:");

for (let i = 1; i <= 10; i++) {
  // Use modulo operator to check if 'i' is even
  if (i % 2 === 0) {
    console.log("Even: " + i);
  }
}
`,
            language: "javascript",
            solution: "Even: 2"
          }
        ]
      }
    ]
  },
  {
    id: "python-fundamentals",
    title: "Python Data Analysis core",
    description: "Unlock python scripts, data structures, dictionary parsing, list comprehensions, and automation routines easily.",
    category: "languages",
    difficulty: "Beginner",
    duration: "10h total",
    icon: "Terminal",
    xpReward: 1000,
    bannerColor: "from-blue-500 to-indigo-600",
    modules: [
      {
        id: "py-mod-1",
        title: "Syntax & Simple Structs",
        lessons: [
          {
            id: "py-intro-1",
            title: "Python Variables and Indentation",
            type: "theory",
            duration: 8,
            theoryContent: `# Python Syntax & Zen

Python is renowned for readable, clean scripting syntax. Rather than relying on semicolons and curly braces, Python uses **strict whitespace indentation** to group statements or scopes.

### Variable Definitions
Variable bindings are dynamic and clean:
\`\`\`python
username = "Sridevi"
score = 98.4
is_graduated = True
\`\`\`

### Loops & Scopes
Notice the colon and indent:
\`\`\`python
if score > 90:
    print("Exceptional grade!")
\`\`\`
Indents must be unified (usually 4 spaces) or the script crashes with an \`IndentationError\`.`
          }
        ]
      }
    ]
  },
  {
    id: "react-framework",
    title: "Modern React (v19) & Hooks",
    description: "Master React state management, virtual DOM reconciliation, custom hooks, and Tailwind CSS assembly.",
    category: "frontend",
    difficulty: "Intermediate",
    duration: "12h total",
    icon: "Layout",
    xpReward: 1200,
    bannerColor: "from-cyan-400 to-blue-600",
    modules: [
      {
        id: "react-mod-1",
        title: "Components & State Hooks",
        lessons: [
          {
            id: "react-intro-1",
            title: "React components & JSX",
            type: "theory",
            duration: 15,
            theoryContent: `# React Components & JSX

React focuses on state-driven, component-oriented development. JSX (JavaScript XML) is a declarative syntax extension that lets you write HTML markup directly inside JavaScript files.

### Simple Component
\`\`\`jsx
function ProfileCard({ name }) {
  return (
    <div className="p-4 bg-slate-100 rounded-xl">
      <h2>Developer: {name}</h2>
    </div>
  );
}
\`\`\`

### Virtual Document Object Model (DOM)
React renders to a Virtual DOM model in background buffers, performs a diff comparison when state shifts, and updates the real screen layout selectively. This avoids slow full-page layouts.`
          }
        ]
      }
    ]
  },
  {
    id: "sql-databases",
    title: "SQL & Relational Databases",
    description: "Write flawless SELECT queries, INNER JOINs, GROUP BYs, index schemas, and optimize database queries.",
    category: "systems",
    difficulty: "Intermediate",
    duration: "6h total",
    icon: "Database",
    xpReward: 700,
    bannerColor: "from-emerald-400 to-teal-700",
    modules: []
  },
  {
    id: "ai-ml-basics",
    title: "Prompt Engineering & Gemini API",
    description: "Implement modern LLM prompts, structured outputs, function calling, multimodal media, and custom chatbots.",
    category: "ai",
    difficulty: "Advanced",
    duration: "14h total",
    icon: "Sparkles",
    xpReward: 1500,
    bannerColor: "from-purple-500 via-pink-500 to-indigo-700",
    modules: []
  }
];

export const CODING_CHALLENGES: CodingChallenge[] = [
  {
    id: "add-nums",
    title: "Simple Summation Check",
    difficulty: "Easy",
    category: "Math & Arrays",
    prompt: `Write a function named 'addNumbers' that takes two parameters, 'a' and 'b', and returns their sum.`,
    startingCode: `function addNumbers(a, b) {
  // Your code here
  return 0;
}`,
    solutionCode: `function addNumbers(a, b) {
  return a + b;
}`,
    testCases: [
      { input: "1, 2", expected: "3" },
      { input: "5, 10", expected: "15" },
      { input: "-10, 20", expected: "10" }
    ],
    language: "javascript",
    xpValue: 100
  },
  {
    id: "reverse-str",
    title: "Reverse a String",
    difficulty: "Easy",
    category: "String Processing",
    prompt: `Write a function named 'reverseString' that takes a string and returns it backwards.`,
    startingCode: `function reverseString(str) {
  // Your code here
  return str;
}`,
    solutionCode: `function reverseString(str) {
  return str.split("").reverse().join("");
}`,
    testCases: [
      { input: '"hello"', expected: '"olleh"' },
      { input: '"Code"', expected: '"edoC"' },
      { input: '"Racecar"', expected: '"racecaR"' }
    ],
    language: "javascript",
    xpValue: 150
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz Logic Quiz",
    difficulty: "Easy",
    category: "Control Flow",
    prompt: `Write a function 'fizzBuzz' that takes a number 'n'.
- If 'n' is divisible by 3, return "Fizz".
- If 'n' is divisible by 5, return "Buzz".
- If divisible by both, return "FizzBuzz".
- Else, return 'n' as a string.`,
    startingCode: `function fizzBuzz(n) {
  // Your code here
  return "";
}`,
    solutionCode: `function fizzBuzz(n) {
  if (n % 15 === 0) return "FizzBuzz";
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  return n.toString();
}`,
    testCases: [
      { input: "9", expected: '"Fizz"' },
      { input: "10", expected: '"Buzz"' },
      { input: "30", expected: '"FizzBuzz"' },
      { input: "7", expected: '"7"' }
    ],
    language: "javascript",
    xpValue: 150
  },
  {
    id: "is-prime",
    title: "Prime Number Evaluator",
    difficulty: "Medium",
    category: "Mathematics",
    prompt: `Create a function 'isPrime' that returns true if a positive integer 'n' is prime, and false otherwise. Remember that 1 is not prime.`,
    startingCode: `function isPrime(n) {
  // Your code here
  return false;
}`,
    solutionCode: `function isPrime(n) {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}`,
    testCases: [
      { input: "1", expected: "false" },
      { input: "2", expected: "true" },
      { input: "17", expected: "true" },
      { input: "20", expected: "false" }
    ],
    language: "javascript",
    xpValue: 250
  },
  {
    id: "find-duplicates",
    title: "Find Duplicate Elements",
    difficulty: "Medium",
    category: "Arrays & Objects",
    prompt: `Write a function 'findDuplicates' that takes an array and returns an array of only the values that appear more than once, sorted in ascending order.`,
    startingCode: `function findDuplicates(arr) {
  // Your code here
  return [];
}`,
    solutionCode: `function findDuplicates(arr) {
  const counts = {};
  const duplicates = [];
  for (const val of arr) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] === 2) {
      duplicates.push(val);
    }
  }
  return duplicates.sort((a,b) => a - b);
}`,
    testCases: [
      { input: "[1, 2, 3, 1, 2, 4]", expected: "[1, 2]" },
      { input: "[5, 5, 5, 5]", expected: "[5]" },
      { input: "[1, 2, 3]", expected: "[]" }
    ],
    language: "javascript",
    xpValue: 300
  }
];

export const PROJECTS: ProjectGuide[] = [
  {
    id: "proj-1",
    title: "Dynamic Profile Landing Page",
    description: "Launch a custom personal portfolio representing your academic achievements, using high-impact animations, interactive skill bars, and a functional feedback box.",
    difficulty: "Beginner",
    category: "Web Frontend",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    xpReward: 400,
    steps: [
      {
        title: "1. Structure HTML5 Card",
        explanation: "Set up semantic layout tags like <header>, <section>, and <article> with clear class definitions.",
        subtasks: [
          "Create a container div for the avatar badge.",
          "Add target profile tags including display headings and project hyperlinks.",
          "Code a beautiful skill list using custom data-attributes."
        ]
      },
      {
        title: "2. Visual Custom CSS Layouts",
        explanation: "Style with custom properties (CSS variables), layouts, transitions, and eye-safe twilight canvases.",
        subtasks: [
          "Choose a slate background matching professional developer portfolios.",
          "Draft elegant font declarations pairing 'Space Grotesk' headings with 'Inter' text.",
          "Apply hover scale states (`transform: scale(1.05)`) on card entries."
        ]
      },
      {
        title: "3. Interactivity & Dark Mode Controls",
        explanation: "Incorporate localized JavaScript event listeners to switch colors dynamically or count profile clicks.",
        subtasks: [
          "Attach a click handler to a theme toggle input.",
          "Class map body parameters to switch from dark-mode to standard off-white.",
          "Validate contact feedback inputs for standard string criteria."
        ]
      }
    ]
  },
  {
    id: "proj-2",
    title: "Interactive Pomodoro Focus Timer",
    description: "Engineer an offline tool supporting customized work/break intervals, audio alarm sound clips, and progress completion rings.",
    difficulty: "Intermediate",
    category: "State Management",
    technologies: ["React.js", "Tailwind CSS", "Web Audio API"],
    xpReward: 600,
    steps: [
      {
        title: "1. Construct State Machines",
        explanation: "Establish active countdown variables, work state toggles, and session length state registers.",
        subtasks: [
          "Track remainingSeconds using integers.",
          "Instantiate active state flags (idle, running, paused).",
          "Set up useEffect clock triggers utilizing standard setInterval tickers."
        ]
      }
    ]
  },
  {
    id: "proj-3",
    title: "Semantic Article SEO Summarizer",
    description: "Leverage advanced Gemini REST APIs on an Express server to summarize long articles into tidy structured bullets with metadata parameters.",
    difficulty: "Advanced",
    category: "AI Integration",
    technologies: ["Node.js", "Express", "Gemini AI API", "Vite"],
    xpReward: 1000,
    steps: [
      {
        title: "1. Set Up Server Routes",
        explanation: "Construct Express POST hooks that receive prompt articles and validate standard security keys.",
        subtasks: [
          "Confirm GEMINI_API_KEY is active in local environments.",
          "Bind a standard parser to access request body strings.",
          "Format Gemini prompts cleanly to request JSON structured outputs."
        ]
      }
    ]
  }
];

export const FORUM_THREADS: ForumPost[] = [
  {
    id: "t1",
    title: "Why does my React state lag inside event handler click loops?",
    category: "Debugging",
    authorName: "Subhashini",
    authorRole: "Student Dev",
    authorAvatar: "👩‍💻",
    content: `Hey everyone! I'm trying to update a simple count variable in React and immediately log its value to the console like this:

\`\`\`jsx
const handleIncrement = () => {
  setCount(count + 1);
  console.log("Current count:", count); // <-- Logs the OLD count! Why?
};
\`\`\`

Is there a way to solve this so that I immediately get the new synchronized value? Any guidance is highly appreciated!`,
    likes: 12,
    repliesCount: 2,
    createdAt: "2026-06-06T14:24:00Z",
    tags: ["React", "State Hooks", "Async Loops"],
    likedByCurrentUser: false,
    replies: [
      {
        id: "rep1",
        authorName: "Sridevi K.",
        authorRole: "Senior Mentor",
        authorAvatar: "👩‍🏫",
        content: `Excellent question! In React, state updates generated through functions like \`setCount\` are fully **asynchronous** and batched for computational speed. 

When you print \`count\` immediately on the next line, the render cycles have not completed yet, so the variable holds the closure value. If you need to perform an action immediately following a state alteration, use the \`useEffect\` hook with \`count\` in its dependency array!`,
        createdAt: "2026-06-06T14:45:00Z"
      },
      {
        id: "rep2",
        authorName: "Devin AI",
        authorRole: "Apprentice",
        authorAvatar: "🤖",
        content: `Adding to Sridevi's answer: you can also use functional updates if your new state depends on the immediate old value:
\`setCount(prev => prev + 1)\`.`,
        createdAt: "2026-06-06T15:02:00Z"
      }
    ]
  },
  {
    id: "t2",
    title: "Best resources or roadmaps to learn DSA for MAANG companies?",
    category: "Career Advice",
    authorName: "Rohan",
    authorRole: "Career Shifter",
    authorAvatar: "👨‍💻",
    content: "Hi all, I'm aiming to transition from a business analyst to a software engineer in the next 12 months. Which topics should I double-down on? Should I learn Trees or Arrays first, and what complexity theory is crucial? Thank you!",
    likes: 8,
    repliesCount: 1,
    createdAt: "2026-06-05T09:30:00Z",
    tags: ["Career Advise", "DSA", "LeetCode"],
    replies: [
      {
        id: "rep3",
        authorName: "Alex Dev",
        authorRole: "Full-Stack Apprentice",
        authorAvatar: "💻",
        content: "I am using CodeMaster AI's Practice section right now! Highly recommend tackling Easy Arrays first, then understanding Big-O, and moving towards Hash Maps. That pattern is perfect.",
        createdAt: "2026-06-05T10:15:00Z"
      }
    ]
  },
  {
    id: "t3",
    title: "Showcase: Check out my semantic portfolio build with custom widgets!",
    category: "Showcase",
    authorName: "Meera",
    authorRole: "UI Enthusiast",
    authorAvatar: "🎨",
    content: "I built a fast portfolio card using Tailwind grid configurations, custom SVG vectors, and local preferences storing user click-counts. CodeMaster AI's project hub instructions were an immense help. Love this!",
    likes: 19,
    repliesCount: 0,
    createdAt: "2026-06-07T05:10:00Z",
    tags: ["HTML", "Portfolio", "CSSGrid"]
  }
];
