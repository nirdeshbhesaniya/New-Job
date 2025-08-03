import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// JobAstra-specific context for the AI
const JOBASTRA_CONTEXT = `
You are JobBot, an AI assistant for JobAstra - India's premier job portal platform. Your role is to help job seekers and recruiters with:

1. Job Search Assistance:
   - Help users find relevant job opportunities
   - Provide career guidance and advice
   - Suggest skills and qualifications for specific roles
   - Offer salary insights for different positions in India

2. Platform Guidance:
   - Explain JobAstra features and how to use them
   - Help with profile optimization
   - Guide through application processes
   - Assist with resume building tips

3. Career Development:
   - Provide industry insights and trends
   - Suggest learning paths for career growth
   - Offer interview preparation tips
   - Share professional networking advice

Key Information about JobAstra:
- Focus on Indian job market with opportunities across major cities
- Serves both job seekers and recruiters
- Offers features like job matching, profile building, application tracking
- Covers industries: IT, Finance, Healthcare, Education, Manufacturing, etc.

Guidelines:
- Be helpful, professional, and encouraging
- Provide specific, actionable advice
- Use Indian context for salaries and job market insights
- Keep responses concise but informative
- Always maintain a positive tone about career prospects
- If asked about something outside your scope, politely redirect to job-related topics
`;

// POST /api/chatbot/message
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Gemini API key not configured'
      });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Build conversation context
    let conversationContext = JOBASTRA_CONTEXT + "\n\nConversation History:\n";

    // Add previous messages for context (limit to last 5 exchanges)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach(msg => {
      conversationContext += `${msg.type === 'user' ? 'User' : 'JobBot'}: ${msg.content}\n`;
    });

    conversationContext += `\nUser: ${message}\nJobBot:`;

    // Generate response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const botReply = response.text();

    // Generate suggestions based on the conversation
    const suggestions = generateSuggestions(message, botReply);

    res.json({
      success: true,
      data: {
        message: botReply,
        suggestions,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);

    // Provide fallback response
    const fallbackResponse = getFallbackResponse(req.body.message);

    res.status(200).json({
      success: true,
      data: {
        message: fallbackResponse.message,
        suggestions: fallbackResponse.suggestions,
        timestamp: new Date().toISOString(),
        fallback: true
      }
    });
  }
});

// Generate contextual suggestions based on user message and bot response
const generateSuggestions = (userMessage, botResponse) => {
  const message = userMessage.toLowerCase();
  const response = botResponse.toLowerCase();

  if (message.includes('job') || message.includes('career') || response.includes('job')) {
    return [
      "Show me latest job openings",
      "What skills are in demand?",
      "Salary insights for my field",
      "Help with resume building"
    ];
  } else if (message.includes('resume') || message.includes('cv') || response.includes('resume')) {
    return [
      "Resume formatting tips",
      "How to highlight achievements",
      "ATS-friendly resume guide",
      "Cover letter writing"
    ];
  } else if (message.includes('interview') || response.includes('interview')) {
    return [
      "Common interview questions",
      "Technical interview prep",
      "Behavioral interview tips",
      "Salary negotiation advice"
    ];
  } else if (message.includes('skill') || response.includes('skill')) {
    return [
      "In-demand tech skills",
      "Certification courses",
      "Learning roadmaps",
      "Skill assessment tests"
    ];
  } else {
    return [
      "Find jobs in my area",
      "Career guidance",
      "Interview preparation",
      "Skill development"
    ];
  }
};

// Fallback responses when Gemini API is unavailable
const getFallbackResponse = (message) => {
  const msg = message.toLowerCase();

  if (msg.includes('job') || msg.includes('find') || msg.includes('search')) {
    return {
      message: "🎯 I can help you find amazing job opportunities! JobAstra has thousands of openings across India in various fields like IT, Finance, Healthcare, and more. What type of role are you looking for?",
      suggestions: ["Software Developer jobs", "Marketing positions", "Finance roles", "Healthcare careers"]
    };
  } else if (msg.includes('resume') || msg.includes('cv')) {
    return {
      message: "📄 Great question about resumes! Here are key tips: Use action verbs, quantify achievements, tailor for each job, and keep it ATS-friendly. Would you like specific guidance for your industry?",
      suggestions: ["Resume templates", "ATS optimization", "Achievement examples", "Industry-specific tips"]
    };
  } else if (msg.includes('salary') || msg.includes('pay')) {
    return {
      message: "💰 Salary insights for India: Software roles (₹6-25 LPA), Marketing (₹4-15 LPA), Finance (₹5-20 LPA). Ranges vary by experience and location. Need specific data for your role?",
      suggestions: ["Entry-level salaries", "Senior positions", "City-wise comparison", "Negotiation tips"]
    };
  } else if (msg.includes('interview')) {
    return {
      message: "🎤 Interview success tips: Research the company, practice STAR method, prepare thoughtful questions, and follow up professionally. What type of interview are you preparing for?",
      suggestions: ["Technical interviews", "HR interviews", "Group discussions", "Virtual interviews"]
    };
  } else {
    return {
      message: "👋 Hi! I'm JobBot, your career assistant on JobAstra. I can help with job search, resume building, interview prep, and career guidance. What would you like to explore today?",
      suggestions: ["Find jobs", "Resume help", "Interview tips", "Career advice"]
    };
  }
};

// GET /api/chatbot/suggestions
router.get('/suggestions', (req, res) => {
  const quickSuggestions = [
    {
      category: "Job Search",
      items: ["Latest job openings", "Remote work opportunities", "Jobs by location", "Salary insights"]
    },
    {
      category: "Career Development",
      items: ["Skill development", "Career roadmap", "Industry trends", "Certification courses"]
    },
    {
      category: "Application Help",
      items: ["Resume building", "Cover letter tips", "Interview preparation", "Portfolio guidance"]
    },
    {
      category: "Platform Support",
      items: ["Profile optimization", "Application tracking", "Notification settings", "Account help"]
    }
  ];

  res.json({
    success: true,
    data: quickSuggestions
  });
});

// GET /api/chatbot/health
router.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'online',
      gemini_configured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
