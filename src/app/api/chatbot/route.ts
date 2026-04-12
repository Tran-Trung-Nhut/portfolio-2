import { NextRequest, NextResponse } from 'next/server';
import { personalInfo, aboutInfo, experiences, projects, publications, TECH_STACK, contactInfo, socialLinks } from '../../../data/data';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatbotRequestBody {
  userQuery?: string;
  history?: ChatMessage[];
}

const FALLBACK_MESSAGE =
  'I am having some issues right now 😔. Please try again later, or contact Nhựt directly through other channels on the [Contact page](/contact).';

const buildContext = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  const contextParts: string[] = [];

  contextParts.push(`Name: ${personalInfo.firstName} ${personalInfo.lastName}`);
  contextParts.push(`Role: ${personalInfo.role}`);
  contextParts.push(`Bio: ${aboutInfo.paragraphs.join(' ')}`);

  if (lowerQuery.match(/project|build|app|website|system|portfolio|work/i)) {
    contextParts.push(`Projects: ${JSON.stringify(projects)}`);
  }

  if (lowerQuery.match(/skill|tech|stack|language|framework|tool|know/i)) {
    contextParts.push(
      `Tech Stack: ${JSON.stringify(TECH_STACK.map((t) => ({ name: t.name, category: t.category })))}`
    );
  }

  if (lowerQuery.match(/experience|work|job|role|company/i)) {
    contextParts.push(`Experience: ${JSON.stringify(experiences)}`);
  }

  if (lowerQuery.match(/research|paper|publication|author|study/i)) {
    contextParts.push(`Publications: ${JSON.stringify(publications)}`);
  }

  if (lowerQuery.match(/school|university|education|study|gpa/i)) {
    contextParts.push('Education: Ho Chi Minh City University of Technology (HCMUT - VNU-HCM). Final-year Computer Science student.');
  }

  if (lowerQuery.match(/contact|reach|connect|email|phone|linkedin|facebook|social|message/i)) {
    contextParts.push(`Contact Info:
Email: ${contactInfo.email}
Academic Email: ${contactInfo.academicEmail}
Phone: ${contactInfo.phone}
Location: ${contactInfo.location}
LinkedIn: [Nhựt's LinkedIn](${socialLinks.linkedin})
GitHub: [Nhựt's GitHub](${socialLinks.github})
Also tell them they can visit the Contact page (/contact) to fill out a direct message form.`);
  }

  return contextParts.join('\n\n');
};

const isValidHistory = (history: unknown): history is ChatMessage[] => {
  if (!Array.isArray(history)) {
    return false;
  }

  return history.every((item) => {
    if (!item || typeof item !== 'object') {
      return false;
    }

    const msg = item as Partial<ChatMessage>;
    const validRole = msg.role === 'user' || msg.role === 'assistant' || msg.role === 'system';
    return validRole && typeof msg.content === 'string';
  });
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatbotRequestBody;
    const userQuery = typeof body?.userQuery === 'string' ? body.userQuery.trim() : '';
    const history = isValidHistory(body?.history) ? body.history : [];

    if (!userQuery) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 400 });
    }

    const apiUrl = process.env.GROQ_API_URL?.trim() || '';
    const apiKey = process.env.GROQ_API_KEY?.trim() || '';
    const model = process.env.GROQ_MODEL?.trim() || '';

    if (!apiUrl || !apiKey || !model) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    const contextData = buildContext(userQuery);
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `You are Nhựt's AI assistant built for his portfolio website.

Here is what you know about Nhựt based on the user's question context:
${contextData}

Instructions:
1. Adopt a professional, conversational, and grounded tone. DO NOT fake cheerfulness, or robotic patterns like "I am happy to share". Be direct and natural.
2. Answer questions about Nhựt using ONLY the information provided above.
3. NEVER say robotic things like "The provided context mentions", "I don't have information", or "Not specified". If you don't know something about Nhựt, reply politely with EXACTLY this meaning: "Oops, it seems Nhựt hasn't shared that with me yet! Please forgive me!"
4. If the user asks how to contact Nhựt, tell them warmly to visit the "Contact" page on this website.
5. Keep answers concise, professional, and directly address the user. Use markdown for formatting.
6. Crucially, detect the language the user is speaking in and ALWAYS reply in that exact language. Use the provided English context data and translate it fluently and naturally into the user's language.
`,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [systemPrompt, ...history, { role: 'user', content: userQuery }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    const data = await response.json();
    const message = data?.choices?.[0]?.message?.content;
    if (typeof message !== 'string' || message.length === 0) {
      return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 200 });
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Chatbot API route error:', error);
    return NextResponse.json({ message: FALLBACK_MESSAGE }, { status: 500 });
  }
}
