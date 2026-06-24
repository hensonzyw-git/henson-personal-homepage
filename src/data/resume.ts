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
    name: '朱亚威 Henson',
    role: '开放平台产品经理 · AI × 平台生态 · 10 年经验',
    pdfPending: 'PDF 即将提供',
    pdfNote: 'PDF-pending · 降级态 · 无死链',
    sampleChip: '示例履历 · 待替换',
    sections: {
      experience: {
        label: '经历',
        rows: [
          {
            period: '2025 — 至今',
            title: '高级产品经理 · 得物 POIZON',
            desc: '负责开放平台；作为产品负责人独立推动国际商家 AI Agent（Google ADK 多 Agent 架构）从 0 到 1。',
          },
          {
            period: '2023 — 2025',
            title: '产品经理 · 字节跳动（TikTok）',
            desc: '负责 TikTok 开放平台的数据合规原则与机制设计。',
          },
          {
            period: '2022 — 2023',
            title: '产品经理 · 微软 Microsoft',
            desc: '负责开发者生态方向的产品。',
          },
          {
            period: '2017 — 2022',
            title: '产品经理 · 字节跳动',
            desc: '从 0 搭建开放平台框架、拓展行业生态，带 4 人小队。',
          },
          {
            period: '2016 — 2017',
            title: '产品 · 迅雷',
            desc: '职业起点，从需求调研与执行做起。',
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
          '平台治理',
          'API 基础设施',
          '开发者生态',
          '数据合规',
          'AI / Agent 产品',
          '多 Agent 架构',
          'Agent 评估与护栏',
          'AI coworking / vibe coding',
        ],
      },
    },
  },
  en: {
    name: 'Henson · Zhu Yawei',
    role: 'Open Platform Product Manager · AI × platform ecosystems · 10 years',
    pdfPending: 'PDF coming soon',
    pdfNote: 'PDF-pending · degraded state · no dead link',
    sampleChip: 'sample resume · placeholder',
    sections: {
      experience: {
        label: 'Experience',
        rows: [
          {
            period: '2025 — now',
            title: 'Senior Product Manager · POIZON (Dewu)',
            desc: 'Own the open platform; as product lead, drove an international merchant AI agent (Google ADK multi-agent architecture) from 0→1.',
          },
          {
            period: '2023 — 2025',
            title: 'Product Manager · ByteDance (TikTok)',
            desc: 'Owned data-compliance principles and mechanisms for the TikTok open platform.',
          },
          {
            period: '2022 — 2023',
            title: 'Product Manager · Microsoft',
            desc: 'Worked on developer-ecosystem products.',
          },
          {
            period: '2017 — 2022',
            title: 'Product Manager · ByteDance',
            desc: 'Built the open platform from scratch, grew the industry ecosystem, and led a team of 4.',
          },
          {
            period: '2016 — 2017',
            title: 'Product · Xunlei',
            desc: 'Career start — began in user research and execution.',
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
          'Platform governance',
          'API infrastructure',
          'Developer ecosystem',
          'Data compliance',
          'AI / Agent products',
          'Multi-agent architecture',
          'Agent evaluation & guardrails',
          'AI coworking / vibe coding',
        ],
      },
    },
  },
};
