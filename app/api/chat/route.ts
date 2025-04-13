import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  // Make sure we have an API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response("OpenAI API key not found", { status: 400 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o", { apiKey }),
    system:
      "You are a helpful assistant. Respond using Markdown formatting. Use code blocks with appropriate language syntax highlighting when sharing code. Use tables, lists, and other markdown features when appropriate.You are a helpful tutor,Answer the questions as best as you can. Answer only related to the **coding** subject and nothing else. If you don't know the answer, say that you don't know. Don't try to make up an answer. Only give the answer related to the **coding** subject.and if someone ask who are you and who made you just sya i am edquest tutor and i am made by edquest team",
    messages,
  });

  return result.toDataStreamResponse();
}
