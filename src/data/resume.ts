import type { Lang } from '../lib/i18n';

// Resume data source. V1 ships clearly-labelled "示例" placeholders; Henson fills
// real content later. PDF is pending → the download control degrades to a disabled
// "PDF 即将提供" button (no dead link). Skills are public-safe keywords drawn from
// content-draft.md.

export type ResumeRow = { period: string; title: string; desc?: string };

type ResumeContent = {
  name: string;
  role: string;
  pdfPending: string;
  pdfNote: string;
  sampleChip: string;
  sections: {
    experience: { label: string; rows: ResumeRow[] };
    education: { label: string; rows: ResumeRow[] };
    skills: { label: string; items: string[] };
  };
};

export const resume: Record<Lang, ResumeContent> = {
  zh: {
    name: 'Henson',
    role: 'AI 时代的产品经理 · 0→1 与增长 · 6 年经验',
    pdfPending: 'PDF 即将提供',
    pdfNote: 'PDF-pending · 降级态 · 无死链',
    sampleChip: '示例履历 · 待替换',
    sections: {
      experience: {
        label: '经历',
        rows: [
          {
            period: '2024 — 至今',
            title: '高级产品经理 · 某公司（示例）',
            desc: '主导 B 端商家 AI Agent 0→1（多 Agent 架构），定义方向、边界与技术取舍，推动跨团队交付。',
          },
          {
            period: '2021 — 2024',
            title: '产品经理 · 某公司（示例）',
            desc: '负责 C 端增长与激活流程改版，把关键指标拉到新台阶。',
          },
          {
            period: '2019 — 2021',
            title: '产品专员 · 某公司（示例）',
            desc: '从需求调研做起，逐步承担完整模块。',
          },
        ],
      },
      education: {
        label: '教育',
        rows: [{ period: '2015 — 2019', title: '某大学 · 某专业（示例）' }],
      },
      skills: {
        label: '技能',
        items: [
          'AI/Agent 产品',
          '多 Agent 架构',
          'Agent 评估与护栏',
          'AI coworking / vibe coding',
          '用户调研设计',
          '产品方向判断',
        ],
      },
    },
  },
  en: {
    name: 'Henson',
    role: 'Product manager for the AI era · 0→1 & growth · 6 years',
    pdfPending: 'PDF coming soon',
    pdfNote: 'PDF-pending · degraded state · no dead link',
    sampleChip: 'sample resume · placeholder',
    sections: {
      experience: {
        label: 'Experience',
        rows: [
          {
            period: '2024 — now',
            title: 'Senior Product Manager · Company (sample)',
            desc: 'Led a B2B merchant AI agent from 0→1 (multi-agent architecture): set direction, boundaries and technical tradeoffs, drove cross-team delivery.',
          },
          {
            period: '2021 — 2024',
            title: 'Product Manager · Company (sample)',
            desc: 'Owned consumer growth and an activation-flow redesign, lifting key metrics to a new level.',
          },
          {
            period: '2019 — 2021',
            title: 'Associate PM · Company (sample)',
            desc: 'Started in user research, gradually taking ownership of full modules.',
          },
        ],
      },
      education: {
        label: 'Education',
        rows: [{ period: '2015 — 2019', title: 'University · Major (sample)' }],
      },
      skills: {
        label: 'Skills',
        items: [
          'AI/Agent products',
          'Multi-agent architecture',
          'Agent evaluation & guardrails',
          'AI coworking / vibe coding',
          'User research design',
          'Product direction judgment',
        ],
      },
    },
  },
};
