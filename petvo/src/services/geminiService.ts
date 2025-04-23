interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface Message {
  content: string;
  sender: 'user' | 'pet';
  timestamp: Date;
}

export const getPetResponse = async (message: string, conversationHistory: Message[]): Promise<string> => {
  try {
    // Get messages from the last 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const recentMessages = conversationHistory
      .filter(msg => msg.timestamp >= threeDaysAgo)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Format conversation history
    const historyText = recentMessages
      .map(msg => `${msg.sender === 'user' ? 'User' : 'Pet'}: ${msg.content}`)
      .join('\n');

    const prompt = `You are a friendly digital pet. Here is our conversation history from the last 3 days:
${historyText}

User: ${message}

Please respond naturally, taking into account our conversation history. If you remember something from our past conversations, feel free to reference it.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error getting response from Gemini API:', error);
    throw error;
  }
}; 