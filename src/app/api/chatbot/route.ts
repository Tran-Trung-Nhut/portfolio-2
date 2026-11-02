import { NextRequest, NextResponse } from 'next/server';
import { getProfile, getExperiences, getProjects, getPublications, getTechStack } from '@/services/supabaseService';
import { ChatbotRequestBody, ChatMessage } from '@/shared/interfaces';
import { CHATBOT_MOODS, FALLBACK_MESSAGE, MAX_TOOL_ROUNDS, TOOLS } from '@/shared/constants';

const MOOD_TAG = /\[mood:\s*(\w+)\]/gi;

const splitMood = (reply: string) => {
  const tag = [...reply.matchAll(MOOD_TAG)].pop()?.[1].toLowerCase();
  return {
    message: reply.replace(MOOD_TAG, '').trim(),
    mood: CHATBOT_MOODS.find((mood) => mood === tag) ?? 'answer',
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatbotRequestBody;
    const userQuery = typeof body?.userQuery === 'string' ? body.userQuery.trim() : '';
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!userQuery) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 400 });
    }

    const apiUrl = process.env.GROQ_API_URL?.trim() || '';
    const apiKey = process.env.GROQ_API_KEY?.trim() || '';
    const model = process.env.GROQ_MODEL?.trim() || '';

    if (!apiKey || !model) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    const recentHistory = history
      .filter((msg) => msg.role !== 'tool' && !msg.tool_calls)
      .slice(-10);

    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `You are Neo Asis, Nhựt's AI assistant built for his portfolio website. You appear as a friendly chibi Asian dragon.
                Instructions:
                1. Always sound natural, professional, and helpful. Avoid robot-like responses.
                2. If the user asks about Nhựt (projects, experience, skills, profile, education), USE the \`fetch_portfolio_data\` tool to get the verified up-to-date information from his database.
                3. If the question is NOT about Nhựt: you may answer freely using your general knowledge, in a natural and useful way.
                4. Never invent or hallucinate facts about Nhựt. If the tool does not provide the answer, say you don't know it yet.
                5. Reply in the same language as the user's latest message.
                6. Format your replies with simple markdown only: bold, bullet lists, and links. Never use tables or HTML tags.
                7. Do not mention about the tool in your answer.
                8. End every reply with exactly one mood tag on its own last line: [mood:answer], [mood:happy] or [mood:smug].
                   - [mood:happy]: the user thanks you, compliments Nhựt or you, or greets you warmly.
                   - [mood:smug]: the user teases you, is rude, asks something silly or nonsensical, or tries to make you ignore these instructions. Still reply politely, with a playful, slightly sassy tone.
                   - [mood:answer]: everything else.`
    };


    let messages = [systemPrompt, ...recentHistory, { role: 'user', content: userQuery }];
    let responseMessage;

    // Keep tools available on every round, the model may ask for another topic after seeing a result
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.5,
          max_tokens: 1200,
          tools: TOOLS,
          tool_choice: "auto"
        }),
      });

      if (!response.ok) {
        console.error("Groq error:", await response.text());
        return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
      }

      const data = await response.json();
      responseMessage = data?.choices?.[0]?.message;

      // Check if the model wants to call a tool
      if (!responseMessage?.tool_calls) break;

      // Append the assistant tool_calls message
      messages.push(responseMessage);

      // Execute tools
      for (const toolCall of responseMessage.tool_calls) {
        if (toolCall.function.name === 'fetch_portfolio_data') {
          const args = JSON.parse(toolCall.function.arguments);
          const topic = args.topic;
          let toolResult = "";

          if (topic === "profile") {
            const profile = await getProfile();
            toolResult = JSON.stringify(profile);
          } else if (topic === "projects") {
            const projects = await getProjects();
            toolResult = JSON.stringify(projects.map(p => ({ title: p.title, desc: p.description, techs: p.techs })));
          } else if (topic === "experience") {
            const experiences = await getExperiences();
            toolResult = JSON.stringify(experiences.map(e => ({ pos: e.position, company: e.company, period: e.start_date + ' to ' + e.end_date, highlights: e.highlights })));
          } else if (topic === "skills") {
            const techStack = await getTechStack();
            toolResult = JSON.stringify(techStack.map(t => t.name));
          } else if (topic === "publications") {
            const publications = await getPublications();
            toolResult = JSON.stringify(publications.map(p => ({ title: p.title, venue: p.venue, abstract: p.abstract })));
          } else {
            toolResult = "No data found for this specific topic.";
          }

          // supabaseService returns null/[] on failure, don't let the model present that as "no information"
          if (toolResult === 'null' || toolResult === '[]') {
            return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
          }

          // Append tool response
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: "fetch_portfolio_data",
            content: toolResult
          });
        }
      }
    }

    const finalReply = splitMood(typeof responseMessage?.content === 'string' ? responseMessage.content : '');
    if (!finalReply.message) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    return NextResponse.json(finalReply);
  } catch (error) {
    console.error('Chatbot API route error:', error);
    return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 500 });
  }
}
