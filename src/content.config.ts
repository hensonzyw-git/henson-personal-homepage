import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Every Blog / AI / Project entry ships BOTH languages (GATE 1: 每条强制中英双份).
// Convention: one markdown file per language, named `<slug>.<lang>.md`, sharing
// the same `slug` field in frontmatter so the two halves can be paired.

const langField = z.enum(['zh', 'en']);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    key: z.string(),
    lang: langField,
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    category: z.string().default('文章'),
    readMins: z.number().default(6),
    draft: z.boolean().default(false),
    // en bodies may be labelled draft translations
    draftTranslation: z.boolean().default(false),
  }),
});

const ai = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ai' }),
  schema: z.object({
    key: z.string(),
    lang: langField,
    title: z.string(),
    date: z.coerce.date(),
    oneLiner: z.string(),
    tag: z.string().optional(),       // e.g. 自指实践
    featured: z.boolean().default(false),
    facts: z.string().optional(),     // facts card line on the detail page
    // index-card rows: 做了什么 / 怎么做 / 价值
    did: z.string().optional(),
    how: z.string().optional(),
    value: z.string().optional(),
    placeholderLabel: z.string().default('截图 · 待替换'),
    hasDetail: z.boolean().default(false),
    // detail-page media placeholders (data-driven, per entry):
    archDiagram: z.boolean().default(false),   // show the architecture-diagram band
    screens: z.array(z.string()).default([]),  // screenshot band labels (this lang)
    draftTranslation: z.boolean().default(false),
  }),
});

export const collections = { blog, ai };
