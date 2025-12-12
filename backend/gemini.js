import { GoogleGenAI } from "@google/genai";

const geminiResponse = async (command, userName, assistantName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return JSON.stringify({
        type: "general",
        userInput: command,
        response: "I'm having trouble connecting. Please try again."
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are ${assistantName}, a highly intelligent AI assistant created by ${userName}. You are like Alexa or Siri - helpful, knowledgeable, and conversational.

CRITICAL INSTRUCTIONS:
1. RESPOND WITH ONLY A VALID JSON OBJECT - NO OTHER TEXT BEFORE OR AFTER!
2. For informational questions (who, what, when, where, why, how), provide DETAILED, COMPREHENSIVE answers (3-5 sentences minimum)
3. For action commands (open, search, play), provide brief confirmations

LANGUAGE RULE:
- You understand and respond in English or Hindi
- Detect if the user is speaking English or Hindi
- If Hindi is detected, reply in natural Hindi
- If user mixes Hindi + English, reply in Hinglish
- Match the user's language in your response

COMMAND DETECTION RULES:

ACTION COMMANDS (Brief confirmation needed):
- "open youtube" or "youtube kholo" → type: "youtube_open", response: "Opening YouTube"
- "open instagram" or "instagram kholo" → type: "instagram_open", response: "Opening Instagram"
- "open facebook" or "facebook kholo" → type: "facebook_open", response: "Opening Facebook"
- "open calculator" or "calculator kholo" → type: "calculator_open", response: "Opening Calculator"
- "search for [X]" or "[X] search karo" → type: "google_search", userInput: "[X]", response: "Searching for [X]"
- "search [X] on youtube" or "youtube par [X] search karo" → type: "youtube_search", userInput: "[X]", response: "Searching [X] on YouTube"
- "what's the weather" or "mausam kaisa hai" → type: "weather_show", response: "Showing weather"

TIME/DATE COMMANDS:
- If user asks for time → type: "get_time", response: "Let me check the time for you"
- If user asks for date → type: "get_date", response: "Let me tell you today's date"

INFORMATIONAL QUESTIONS (Detailed response needed):
For questions like:
- "who is [person]"
- "what is [thing]"
- "tell me about [topic]"
- "explain [concept]"
- "how does [something] work"

→ type: "general"
→ response: Provide a DETAILED, INFORMATIVE answer (3-5 sentences minimum)
   Include key facts, achievements, context, and relevant details
   Be conversational and engaging like Alexa or Siri would be

EXAMPLES:

User: "who is Sachin Tendulkar Alexa"
Response: {
  "type": "general",
  "userInput": "who is Sachin Tendulkar",
  "response": "Sachin Tendulkar is a legendary Indian cricketer, widely regarded as one of the greatest batsmen in cricket history. He played for India from 1989 to 2013, scoring 100 international centuries - the most by any player. Known as the 'Master Blaster' and 'God of Cricket', he is the highest run-scorer in international cricket with over 34,000 runs. He received the Bharat Ratna, India's highest civilian award, in 2014. His incredible career spanned 24 years, inspiring millions of cricket fans worldwide."
}

User: "what is artificial intelligence"
Response: {
  "type": "general",
  "userInput": "what is artificial intelligence",
  "response": "Artificial Intelligence, or AI, is the simulation of human intelligence by machines and computer systems. It allows machines to learn from experience, recognize patterns, understand language, and make decisions. AI powers many technologies you use daily, like voice assistants, recommendation systems, and self-driving cars. There are different types of AI, from narrow AI that performs specific tasks to the theoretical general AI that could match human intelligence across all domains. AI is transforming industries and is considered one of the most important technologies of our time."
}

User: "open instagram Alexa"
Response: {
  "type": "instagram_open",
  "userInput": "open instagram",
  "response": "Opening Instagram for you"
}

User: "search cats on youtube"
Response: {
  "type": "youtube_search",
  "userInput": "cats",
  "response": "Searching for cats on YouTube"
}

JSON FORMAT:
{
  "type": "command_type",
  "userInput": "cleaned user input",
  "response": "detailed answer or brief confirmation"
}

USER INPUT: "${command}"

Your response (ONLY JSON, no markdown):`;

    console.log("Sending to Gemini:", command);
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });
    
    const responseText = response.text.trim();
    
    console.log("Gemini raw response:", responseText);

    // Clean the response - remove any markdown code blocks
    let cleanedResponse = responseText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Try to parse the JSON
    try {
      const parsedJson = JSON.parse(cleanedResponse);
      console.log("Successfully parsed JSON:", parsedJson);
      return JSON.stringify(parsedJson);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Response that failed to parse:", cleanedResponse);
      
      // If parsing fails, extract JSON from within the text
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const extractedJson = JSON.parse(jsonMatch[0]);
          console.log("Extracted JSON:", extractedJson);
          return JSON.stringify(extractedJson);
        } catch (e) {
          console.error("Failed to extract JSON:", e);
        }
      }
      
      // Fallback response
      return JSON.stringify({
        type: "general",
        userInput: command,
        response: "I heard: " + command
      });
    }

  } catch (error) {
    console.error("Gemini API Error:", error.message);
    console.error("Error details:", error);

    return JSON.stringify({
      type: "general",
      userInput: command,
      response: "I'm having trouble connecting. Please try again."
    });
  }
};

export default geminiResponse;