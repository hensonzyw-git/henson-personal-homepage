import { fromMarkdown } from 'mdast-util-from-markdown';

// Estimates for prose, not a promise of comprehension. Count each translation
// independently; mixed-language articles add both contributions.
export const READING_RATES = Object.freeze({ hanCharacters: 400, words: 200 });

/** @param {string} markdown @param {'zh' | 'en'} lang */
export function readingTime(markdown, lang) {
  const parts = [];
  /** @param {import('mdast').Nodes} node */
  function visit(node) {
    if (node.type === 'code' || node.type === 'image' || node.type === 'imageReference'
        || node.type === 'definition') return;
    if (node.type === 'link' && node.children.length === 1
        && node.children[0].type === 'text' && node.children[0].value === node.url) return;
    if (node.type === 'text' || node.type === 'inlineCode') parts.push(node.value);
    else if (node.type === 'html') {
      // Embedded diagrams and invisible markup are not article prose.
      parts.push(node.value
        .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&(?:#\d+|#x[\da-f]+|\w+);/gi, ' '));
    } else if ('children' in node) node.children.forEach(visit);
  }
  visit(fromMarkdown(markdown));
  const text = parts.join(' ').replace(/https?:\/\/[^\s<>]+/g, ' ');
  const hanCharacters = (text.match(/\p{Script=Han}/gu) ?? []).length;
  const segmenter = new Intl.Segmenter(lang === 'zh' ? 'zh-CN' : 'en', { granularity: 'word' });
  const words = [...segmenter.segment(text.replace(/\p{Script=Han}/gu, ' '))]
    .filter((segment) => segment.isWordLike).length;
  const minutes = Math.max(1, Math.ceil(
    hanCharacters / READING_RATES.hanCharacters + words / READING_RATES.words,
  ));
  return { minutes, hanCharacters, words };
}
