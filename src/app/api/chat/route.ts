import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildCoachSystemPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'No messages provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Build system instruction
    const systemInstruction = buildCoachSystemPrompt(context || []);
    
    // Get the model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction 
    });

    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1);

    // Start chat session
    const chat = model.startChat({ history });

    // Send the message and get streaming response
    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    // Create a readable stream for the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
