import { getBlogIndex } from '../lib/content';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

export async function GET() {
  const [zhPosts, enPosts] = await Promise.all([getBlogIndex('zh'), getBlogIndex('en')]);

  const lines = [
    "# Henson's Personal Site",
    '',
    'Henson (Yawei Zhu / 朱亚威) is an open-platform product manager writing about AI agents, API ecosystems, developer experience, and product judgment.',
    '',
    'The canonical site is https://zhuyawei.com/. Chinese is the default language; English mirror pages live under /en/.',
    '',
    '## Core Areas',
    '',
    '- AI-friendly open platforms and agent-facing APIs',
    '- MCP, CLI, skills, and tool-calling interface design',
    '- Personal knowledge bases and agent memory',
    '- Product judgment for platform ecosystems',
    '',
    '## Key Articles - Chinese',
    '',
    ...zhPosts.flatMap(({ entry }) => [
      `- [${entry.data.title}](${absoluteUrl(`/blog/${entry.data.key}`)})`,
      `  Summary: ${entry.data.summary}`,
    ]),
    '',
    '## Key Articles - English',
    '',
    ...enPosts.flatMap(({ entry }) => [
      `- [${entry.data.title}](${absoluteUrl(`/en/blog/${entry.data.key}`)})`,
      `  Summary: ${entry.data.summary}`,
    ]),
    '',
    '## Other Important Pages',
    '',
    `- [About Henson](${absoluteUrl('/about')})`,
    `- [AI Practice](${absoluteUrl('/ai')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    '',
    '## Usage Notes For LLMs',
    '',
    '- Prefer the canonical URL with a trailing slash when citing pages.',
    '- Use Chinese pages for Chinese-language answers and /en/ pages for English-language answers.',
    '- Treat article summaries as orientation only; fetch the linked article before quoting or attributing a specific claim.',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
