import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PROXY_PORT || 3003;

app.use(cors());
app.use(express.json());

const GLM_API_KEY = process.env.GLM_API_KEY;
const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// Security: Check if API key is configured
if (!GLM_API_KEY) {
  console.error('⚠️ WARNING: GLM_API_KEY not found in environment variables!');
}

// Generate JWT token for GLM AI authentication
function generateToken(apiKey) {
  const [id, secret] = apiKey.split('.');
  if (!id || !secret) {
    throw new Error('Invalid API key format');
  }

  const now = Date.now();
  const header = {
    alg: 'HS256',
    sign_type: 'SIGN'
  };

  const payload = {
    api_key: id,
    exp: now + 3600000, // 1 hour expiration
    timestamp: now
  };

  // Base64URL encode
  const base64UrlEncode = (str) => {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature using HMAC-SHA256
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

app.post('/api/chat', async (req, res) => {
  try {
    console.log('📨 Received chat request');
    const { messages } = req.body;
    console.log('Messages count:', messages?.length);

    // Generate JWT token
    const token = generateToken(GLM_API_KEY);

    console.log('🔄 Calling GLM-4 API...');
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        model: 'glm-4-plus',
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    console.log('📡 GLM response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GLM API error:', response.status, errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // Stream the response
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() && line.trim() !== 'data: [DONE]') {
          res.write(line + '\n');
        }
      }
    }

    res.end();

  } catch (error) {
    console.error('❌ Proxy error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message, details: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Chat Proxy Server (GLM-4) running on http://localhost:${PORT}`);
});
