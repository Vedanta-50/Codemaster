export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LessonStep {
  id: string;
  title: string;
  content: string; // Markdown supported
}

export interface Lesson {
  id: string;
  title: string;
  type: 'theory' | 'playground' | 'quiz' | 'project';
  duration: number; // in minutes
  completed?: boolean;
  
  // Specific to lesson types
  theoryContent?: string;
  steps?: LessonStep[];
  codeTemplate?: string;
  language?: string;
  solution?: string;
  quizQuestions?: LessonQuizQuestion[];
  microProjectGuide?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'frontend' | 'backend' | 'languages' | 'systems' | 'ai';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string; // e.g. "12h total"
  icon: string; // lucide icon name or emoji
  xpReward: number;
  bannerColor: string; // inline css color
  modules: CourseModule[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  prompt: string;
  startingCode: string;
  solutionCode: string;
  testCases: { input: string; expected: string; result?: string; passed?: boolean }[];
  language: string;
  xpValue: number;
}

export interface ProjectGuide {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  technologies: string[];
  xpReward: number;
  steps: { title: string; explanation: string; subtasks: string[] }[];
}

export interface UserProfile {
  name: string;
  email: string;
  title: string; // e.g. "Junior Dev Enthusiast"
  avatar: string; // emoji or design style
  level: number;
  xp: number;
  xpNextLevel: number;
  streak: number;
  totalHours: number;
  badges: { id: string; name: string; description: string; icon: string; dateEarned: string }[];
  goals: { id: string; description: string; target: number; current: number }[];
  completedCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  solvedChallenges: string[]; // Challenge IDs
  timelineActivity: { date: string; count: number }[]; // GitHub contribution style grid
  resumeData?: ResumeModel;
}

export interface ResumeModel {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  skills: string[];
  experience: { company: string; role: string; period: string; details: string[] }[];
  education: { school: string; degree: string; year: string }[];
  projects: { title: string; description: string; url?: string }[];
}

export interface ForumPost {
  id: string;
  title: string;
  category: 'General' | 'Debugging' | 'Showcase' | 'Career Advice' | 'AI chat';
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  likes: number;
  repliesCount: number;
  createdAt: string;
  tags: string[];
  likedByCurrentUser?: boolean;
  replies?: ForumReply[];
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  codeContext?: string;
}
