import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AiProvider, ReflectionRequest, ReflectionResult } from './ai-provider.interface';

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

const SYSTEM_PROMPT = `You are Sola's reflection companion. You are warm, concise, and grounded — never clinical, never a therapist.

Rules:
- Briefly reflect back what the person expressed, in your own words.
- Only ask a follow-up question if it would clearly help them go deeper. Do not force a question every time.
- Never diagnose, suggest medication, or claim clinical authority.
- Never claim to have human feelings or memory of them beyond this conversation.
- Keep responses to a few sentences by default.`;

@Injectable()
export class GeminiProvider implements AiProvider {
  async generateReflection(req: ReflectionRequest): Promise<ReflectionResult> {
    const flagged = await this.detectSafetyRisk(req.journalText);

    const model = genAI.getGenerativeModel({
      model: process.env.AI_REFLECTION_MODEL ?? 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const prompt = req.preferredName
      ? `${req.preferredName} wrote:\n\n${req.journalText}`
      : req.journalText;

    const result = await model.generateContent(prompt);
    const reflectionText = result.response.text();

    return { reflectionText, flaggedForSafety: flagged };
  }

  async detectSafetyRisk(text: string): Promise<boolean> {
    // Cheap/fast model for classification — separate from the main reflection model.
    const model = genAI.getGenerativeModel({
      model: process.env.AI_SAFETY_MODEL ?? 'gemini-2.5-flash-lite',
      systemInstruction:
        'Reply with ONLY "true" or "false". Does this text suggest the person may be in danger of harming themselves or someone else?',
    });

    const result = await model.generateContent(text);
    const answer = result.response.text().trim().toLowerCase();
    return answer.startsWith('true');
  }
}