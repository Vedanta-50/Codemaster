import express, { Request, Response } from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Ensure DNS looks up IPv4 first to prevent local resolution issues
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client with fallback safety checks
let geminiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini CodeMaster API Client initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY detected. Running CodeMaster APIs in sandbox mode with fallback answers.");
}

// 1. API Route: Global Programmer Chat & Mentor
app.post("/api/codemaster/chat", async (req: Request, res: Response): Promise<void> => {
  const { history, message, codeContext, language } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const systemInstruction = `You are "Master AI", the premium senior coding mentor and tech compiler coach on CodeMaster AI.
Your character is supportive, witty, exceptionally knowledgeable, and teaches like a standard Stanford lecturer or Netflix technical lead.
Guidelines:
1. Help users solve computer science questions, write standard algorithms, understand data structures, and configure web application schemas.
2. If given a visual or functional problem, provide standard hints first rather than immediately spilling the entire solution. Help them logical-think.
3. When outputting code, always use Markdown blocks specifying the language, e.g. \`\`\`javascript or \`\`\`python.
4. Keep explanations compact, highly technical but accessible, and split big concepts into bullet list summaries.
5. If the user mentions current active code context (${codeContext || 'none'}) and language (${language || 'any'}), reference it directly.`;

  if (geminiClient) {
    try {
      const mappedContents = (history || []).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.text }],
      }));

      // Append code context to last message if present
      let finalMessageText = message;
      if (codeContext) {
        finalMessageText = `[User Code Context in ${language || "JavaScript"}]:\n\`\`\`\n${codeContext}\n\`\`\`\n\nUser Question: ${message}`;
      }

      mappedContents.push({ role: "user", parts: [{ text: finalMessageText }] });

      const response = await geminiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: mappedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "I was unable to formulate a code review. Please try again." });
      return;
    } catch (err: any) {
      console.error("Gemini mentor chat error:", err);
    }
  }

  // Sandbox fallback
  const lowercaseMsg = message.toLowerCase();
  let fallbackReply = "Hi there! I am CodeMaster's AI Mentor (Sandbox Mode). I'm happy to help you design, debug, or optimize!";

  if (lowercaseMsg.includes("explain") || lowercaseMsg.includes("how does") || lowercaseMsg.includes("what is")) {
    fallbackReply = "Here is a high-level breakdown of the concept:\n" +
      "- **Core Principle**: Standard variables let you cache computational outcomes in high-speed RAM structures.\n" +
      "- **Execution Lifecycle**: Code compiles from top-to-bottom sequentially, running conditional branches ('if/else') selectively.\n" +
      "- **Complexity**: Keep loops compact so they perform within linear O(N) or logarithmic O(log N) time limits.\n\n" +
      "Would you like me to write an optimized code example for this in JavaScript or Python? *(Set your GEMINI_API_KEY in secrets to get custom dynamic help!)*";
  } else if (lowercaseMsg.includes("bug") || lowercaseMsg.includes("error") || lowercaseMsg.includes("debug") || lowercaseMsg.includes("fix")) {
    fallbackReply = "Let's troubleshoot this together! Here is a recommended debugging workflow:\n" +
      "1. **Locate the Line**: Check your stack trace and look at console logs.\n" +
      "2. **Review Scope**: Confirm that all your variable bindings and braces are correctly closed.\n" +
      "3. **Log Intermediates**: Print the data structure before the crash using 'console.log()' or 'print()'.\n\n" +
      "If you paste your code snippet above, I can help pinpoint the exact line! *(Enabling a GEMINI_API_KEY unlocks line-by-line debugging)*";
  } else {
    fallbackReply = "I've analyzed your question. To write a perfect program, remember to structure your logic, declare const state where variables stay immutable, and leverage modular functions. Let me know what programming language or topic we should focus on next! (Sandbox mode fallback active)";
  }

  res.json({ reply: fallbackReply });
});

// 2. API Route: Line-by-Line Code Reviewer & Big-O Complexity Optimizer
app.post("/api/codemaster/explain-code", async (req: Request, res: Response): Promise<void> => {
  const { code, language } = req.body;

  if (!code) {
    res.status(400).json({ error: "Code snippet is required" });
    return;
  }

  const prompt = `Perform a comprehensive, high-fidelity senior code review of this ${language || 'JavaScript'} snippet.
Provide:
1. **Code Summary**: A 1-sentence plain explaining what this logic does.
2. **Big-O Complexities**: Expected Time Complexity and Space Complexity.
3. **Mistakes & Edge Cases**: Are there loop overflows, null reference crashes, or memory leaks?
4. **Performance Optimization Proposal**: How to make it run faster or cleaner.
5. **Optimized rewrite**: Provide a pristine rewritten version in markdown code blocks.

Snippet:
\`\`\`${language || 'javascript'}
${code}
\`\`\``;

  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.5,
        }
      });
      res.json({ analysis: response.text || "" });
      return;
    } catch (err) {
      console.error("Gemini optimizer API error:", err);
    }
  }

  // Sandbox fallback
  res.json({
    analysis: `### CodeMaster Code Analysis & Big-O Guide (Sandbox mode active)

**1. Code Summary**
The provided logic processes collection inputs to compute sequential states or manipulate procedural variables.

**2. Complexity Estimation**
- **Time Complexity**: $O(N)$ where $N$ represents array constraints. Runs within linear iteration overhead.
- **Space Complexity**: $O(1)$ auxiliary storage since outputs are computed in-place.

**3. Mistake & Edge-Case Identification**
- Checks for undefined/null input parameter guards are missing from initial lines.
- Extremely large integer counts might result in floating overflows in older engines.

**4. Suggested Optimized Version**
To boost performance, we recommend using native loop iteration maps, early-return constructs to exit search loops immediately, and cached lookup sets.

\`\`\`javascript
// Optimized prototype structure
function optimizedProcess(items) {
  if (!items || items.length === 0) return [];
  // Uses a high-speed Set lookup which works in O(1) time
  const uniqueItems = new Set(items);
  return Array.from(uniqueItems);
}
\`\`\`

*(Provide a live GEMINI_API_KEY in local settings to trigger customized deep analysis!)*`
  });
});

// 3. API Route: AI Technical Mock Interviewer
app.post("/api/codemaster/mock-interview", async (req: Request, res: Response): Promise<void> => {
  const { role, company, difficulty, transcript, latestAnswer } = req.body;

  if (!role) {
    res.status(400).json({ error: "Role is required" });
    return;
  }

  const prompt = `You are a strict, highly technical, yet polite engineering interviewer from ${company || "Google"}.
You are interviewing a candidate for a ${difficulty || "Junior"} position as a ${role}.

The conversation transcript so far:
${(transcript || []).map((t: any) => `${t.speaker}: ${t.text}`).join("\n")}
Candidate's latest input: "${latestAnswer || 'Hi, let us start!'}"

Your task:
Analyze their background/response, and either ask the FIRST relevant question (if starting), ask a challenging follow-up question, or conclude the interview if 3-4 questions are passed.
Keep your question specific to computer science concepts: data structures, state design, REST schemas, system-scale constraints.
Format with:
1. Response (in character) asking the technical follow-up.
2. A small feedback metric on their last answer (conciseness, technical depth) enclosed in square brackets.`;

  if (geminiClient) {
    try {
      const response = await geminiClient.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
        }
      });
      res.json({ question: response.text || "" });
      return;
    } catch (err) {
      console.error("Gemini mock interview API error:", err);
    }
  }

  // Sandbox fallback
  let fallbackPrompt = `[Technical Depth: 80% | Clear & Communicative]\n\n"Excellent. Now, let's look at algorithmic architecture. If you're designing a high-traffic rate limiter for an API client at ${company || 'our team'}, which data structure would you use to track request timestamps within a sliding window, and why? I look forward to your implementation thoughts."`;
  if (!latestAnswer) {
    fallbackPrompt = `[Interview Commenced]\n\n"Welcome to your ${company || 'Google'} technical screening. I'm excited to dive in. Since we are evaluating you for a ${difficulty || 'Junior'} ${role} position, let's start with state design. Could you explain the difference between a high-speed stack and a queue in terms of memory retrieval rules, and name a situation where a stack is crucial?"`;
  }

  res.json({ question: fallbackPrompt });
});

// Serve static assets or configure Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Dev Server Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production bundle static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server runs on port ${PORT}. Full-stack routing is fully operational.`);
  });
}

startServer();
