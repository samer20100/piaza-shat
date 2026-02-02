import { ModelType, Attachment, Settings } from "../types";

// Use local proxy server instead of direct API connection
const PROXY_API_URL = '/api/chat';

class AIService {
  async *streamChat(
    model: ModelType,
    history: { role: string; content: string }[],
    message: string,
    attachments: Attachment[] = [],
    settings?: Settings
  ) {
    // Convert history to OpenAI format
    const messages: any[] = [];

    // System instruction
    let systemInstruction = "You are biaza, a helpful AI assistant. You mimic the interface and persona of a helpful AI called biaza.";

    if (settings) {
      systemInstruction += `\n\nUser Context:
        - Name/Nickname: ${settings.nickname || settings.fullName}
        ${settings.workFunction ? `- Work Function: ${settings.workFunction}` : ''}
        ${settings.preferences ? `- User Preferences/Instructions: ${settings.preferences}` : ''}
        
        Please adapt your responses according to the user's work function and preferences listed above.`;
    }

    messages.push({ role: "system", content: systemInstruction });

    // Add history
    history.forEach(h => {
      messages.push({ role: h.role === 'model' ? 'assistant' : 'user', content: h.content });
    });

    // Add current message with attachments
    let currentContent = message;
    if (attachments.length > 0) {
      currentContent += `\n[Attachments: ${attachments.map(a => a.name).join(', ')}]`;
    }
    messages.push({ role: "user", content: currentContent });

    try {
      // Send request to local proxy server
      const response = await fetch(PROXY_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages,
          stream: true,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Proxy API error:', response.status, error);
        throw new Error(`Proxy API error: ${response.status} ${error}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;
            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              try {
                const data = JSON.parse(jsonStr);
                const chunk = data.choices[0]?.delta?.content;
                if (chunk !== undefined && chunk !== null && chunk !== '') {
                  yield chunk;
                }
              } catch (e) {
                console.warn('Failed to parse SSE chunk:', jsonStr, e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      throw error;
    }
  }
}

export const aiService = new AIService();
