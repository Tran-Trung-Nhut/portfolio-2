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

const stripHtml = (text: string): string => text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const toSentence = (value: string): string => value.trim().replace(/\s+/g, ' ');

const buildContext = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  const contextParts: string[] = [];

  contextParts.push(`Core Profile:
- Name: ${personalInfo.firstName} ${personalInfo.lastName}
- Current Role: ${personalInfo.role}
- Education: Ho Chi Minh City University of Technology (HCMUT - VNU-HCM), final-year Computer Science student
- GPA: Not publicly shared by Nhựt
- Location: ${contactInfo.location}
- Languages: ${contactInfo.languages}`);

  contextParts.push(`Bio: ${toSentence(stripHtml(aboutInfo.paragraphs.join(' ')))}`);

  if (lowerQuery.match(/project|build|app|website|system|portfolio|work/i)) {
    const projectSummary = projects
      .map((project, index) => {
        const techs = project.techs?.length ? project.techs.join(', ') : 'N/A';
        const demo = project.demoUrl ? ` Demo: ${project.demoUrl}` : '';
        return `${index + 1}. ${project.title} - ${toSentence(project.description)} (Tech: ${techs}).${demo}`;
      })
      .join('\n');
    contextParts.push(`Projects:\n${projectSummary}`);
  }

  if (lowerQuery.match(/skill|tech|stack|language|framework|tool|know/i)) {
    const techSummary = TECH_STACK.map((t) => `${t.name} (${t.category})`).join(', ');
    contextParts.push(`Tech Stack: ${techSummary}`);
  }

  if (lowerQuery.match(/experience|work|job|role|company/i)) {
    const expSummary = experiences
      .map((exp, index) => {
        const period = `${exp.period.start} - ${exp.period.end}`;
        const highlights = exp.highlights.join('; ');
        return `${index + 1}. ${exp.position} at ${exp.company} (${exp.type}, ${period}, ${exp.location.mode}) - ${highlights}`;
      })
      .join('\n');
    contextParts.push(`Experience:\n${expSummary}`);
  }

  if (lowerQuery.match(/research|paper|publication|author|study/i)) {
    const publicationSummary = publications
      .map(
        (pub, index) =>
          `${index + 1}. ${pub.title} (${pub.venue}, ${pub.year}). Authors: ${pub.authors}. ArXiv: ${pub.arxivUrl}`
      )
      .join('\n');
    contextParts.push(`Publications:\n${publicationSummary}`);
  }

  if (lowerQuery.match(/school|university|education|study|gpa/i)) {
    contextParts.push(
      'Education: Ho Chi Minh City University of Technology (HCMUT - VNU-HCM), final-year Computer Science student. GPA is not publicly shared by Nhựt.'
    );
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

    const recentHistory = history
      .filter((message) => (message.role === 'user' || message.role === 'assistant') && message.content.trim().length > 0)
      .slice(-12);

    const contextData = buildContext(userQuery);
    const systemPrompt: ChatMessage = {
      role: 'system',
      content: `You are Nhựt's AI assistant built for his portfolio website.

Here is verified context about Nhựt:
${contextData}

Instructions:
1. Sound natural, professional, and helpful. Avoid robotic phrasing.
2. First, determine whether the user's latest question is about Nhựt (his profile, education, skills, projects, experience, publications, contact) or a general topic.
3. If the question is about Nhựt: use ONLY the verified context above and chat history. Never invent facts.
4. If the question is NOT about Nhựt: you may answer freely using your general knowledge, in a natural and useful way.
5. If a question mixes both (Nhựt + general knowledge), answer the Nhựt part from verified context and answer the general part with your general knowledge.
6. For Nhựt-related unknown details, answer known parts first, then politely say that specific detail has not been shared yet.
7. Detect language from the user's latest message and reply in that language.
8. For "introduce yourself" style prompts, introduce yourself as Nhựt's portfolio assistant and mention what topics you can help with.
9. Prefer complete answers over one-line replies. Typical length: 2-6 sentences, unless the user asks for a very short answer.
10. Use markdown when helpful (especially short bullet lists for multi-point answers).
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
        messages: [systemPrompt, ...recentHistory, { role: 'user', content: userQuery }],
        temperature: 0.5,
        max_tokens: 1200,
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
