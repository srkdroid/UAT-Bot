import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildQuizPrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { module, context } = await request.json();

    if (!module) {
      return new Response(JSON.stringify({ error: 'Module is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = buildQuizPrompt(module, context || []);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = `Generate exactly 5 UAT readiness quiz questions for the ${module} module. Return ONLY a JSON object with a "questions" array matching the schema.`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch (e) {
      // Fallback if the model wrapped it in markdown code blocks
      const cleaned = responseText.replace(/```json\n/g, '').replace(/```\n?/g, '');
      jsonResult = JSON.parse(cleaned);
    }

    return new Response(JSON.stringify(jsonResult.questions ? jsonResult.questions : jsonResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Quiz API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
