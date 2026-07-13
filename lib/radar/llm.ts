import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

/**
 * Moteur LLM du radar. Utilise Claude (Anthropic) dès qu'une ANTHROPIC_API_KEY
 * est présente, sinon OpenAI en repli. Renvoie le texte JSON brut du modèle.
 */
export function llmProvider(): "anthropic" | "openai" | null {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

export async function callLLMJson(system: string, user: string): Promise<string> {
  const provider = llmProvider();
  if (!provider) {
    throw new Error("Aucune clé LLM configurée (ANTHROPIC_API_KEY ou OPENAI_API_KEY).");
  }

  if (provider === "anthropic") {
    const anthropic = new Anthropic();
    const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
    const message = await anthropic.messages.create({
      model,
      max_tokens: 1500,
      system,
      messages: [
        {
          role: "user",
          content: `${user}\n\nRéponds UNIQUEMENT avec l'objet JSON demandé, sans texte autour ni balises de code.`,
        },
      ],
    });
    const block = message.content.find((b) => b.type === "text");
    return block && block.type === "text" ? block.text : "{}";
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.2,
  });
  return completion.choices[0]?.message?.content ?? "{}";
}

/** Parse un JSON éventuellement entouré de texte ou de balises ```json. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseJsonLoose(raw: string): any {
  let s = raw.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) s = fence[1].trim();
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) s = s.slice(start, end + 1);
  return JSON.parse(s);
}
