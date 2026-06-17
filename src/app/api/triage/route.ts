import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildTriagePrompt } from '@/lib/prompts';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const { defectDescription, module, context } = await request.json();

    if (!defectDescription) {
      return new Response(JSON.stringify({ error: 'Defect description is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemInstruction = buildTriagePrompt(context || []);
    
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemInstruction,
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const prompt = module 
      ? `Module: ${module}\n\nDefect Description: ${defectDescription}`
      : `Defect Description: ${defectDescription}`;
      
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch (e) {
      const cleaned = responseText.replace(/```json\n/g, '').replace(/```\n?/g, '');
      jsonResult = JSON.parse(cleaned);
    }

    // Validate required fields
    const validatedResult = {
      classification: jsonResult.classification || 'Training Issue',
      confidence: ['High', 'Medium', 'Low'].includes(jsonResult.confidence) ? jsonResult.confidence : 'Medium',
      reasoning: jsonResult.reasoning || 'Unable to determine reasoning.',
      recommended_action: jsonResult.recommended_action || 'Review with your project team.',
      suggested_next_steps: Array.isArray(jsonResult.suggested_next_steps) 
        ? jsonResult.suggested_next_steps 
        : [jsonResult.suggested_next_steps || 'Consult your project team.'],
    };

    return new Response(JSON.stringify(validatedResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Triage API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
