import { aiUpdated, blogUpdated, getAIIndex, getBlogIndex } from '../lib/content';
import { absoluteUrl } from '../lib/seo';

export const prerender = true;

export async function GET() {
  const [zhPosts, enPosts, zhProjects, enProjects] = await Promise.all([
    getBlogIndex('zh'),
    getBlogIndex('en'),
    getAIIndex('zh'),
    getAIIndex('en'),
  ]);
  const isoDate = (date: Date) => date.toISOString().slice(0, 10);

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
      `  Published: ${isoDate(entry.data.date)}${entry.data.updated ? `; Updated: ${isoDate(blogUpdated(entry))}` : ''}`,
      `  Summary: ${entry.data.summary}`,
    ]),
    '',
    '## Key Articles - English',
    '',
    ...enPosts.flatMap(({ entry }) => [
      `- [${entry.data.title}](${absoluteUrl(`/en/blog/${entry.data.key}`)})`,
      `  Published: ${isoDate(entry.data.date)}${entry.data.updated ? `; Updated: ${isoDate(blogUpdated(entry))}` : ''}`,
      `  Summary: ${entry.data.summary}`,
    ]),
    '',
    '## AI Practice - Chinese',
    '',
    ...zhProjects.flatMap(({ entry }) => [
      `- [${entry.data.title}](${absoluteUrl(entry.data.hasDetail ? `/ai/${entry.data.key}` : '/ai')})`,
      `  Updated: ${isoDate(aiUpdated(entry))}`,
      `  What it demonstrates: ${entry.data.value || entry.data.oneLiner}`,
      ...(entry.data.repo ? [`  Repository: ${entry.data.repo}`] : []),
    ]),
    '',
    '## AI Practice - English',
    '',
    ...enProjects.flatMap(({ entry }) => [
      `- [${entry.data.title}](${absoluteUrl(entry.data.hasDetail ? `/en/ai/${entry.data.key}` : '/en/ai')})`,
      `  Updated: ${isoDate(aiUpdated(entry))}`,
      `  What it demonstrates: ${entry.data.value || entry.data.oneLiner}`,
      ...(entry.data.repo ? [`  Repository: ${entry.data.repo}`] : []),
    ]),
    '',
    '## Other Important Pages',
    '',
    `- [About Henson](${absoluteUrl('/about')})`,
    `- [AI Practice](${absoluteUrl('/ai')})`,
    `- [Contact](${absoluteUrl('/contact')})`,
    `- [XML Sitemap](${absoluteUrl('/sitemap-index.xml')})`,
    `- [RSS Feed - Chinese](${absoluteUrl('/rss.xml')})`,
    `- [RSS Feed - English](${absoluteUrl('/en/rss.xml')})`,
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
