import type { Lang } from '../lib/i18n';

// Public "About me" data source, served at /about (UI: 关于我 / About me).
// No public PDF download entry is exposed; the full resume is available on request.

export type ResumeRow = { period: string; title: string; desc?: string };

type ResumeContent = {
  name: string;
  role: string;
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
    sampleChip: '简版 · 完整简历应要求提供',
    sections: {
      experience: {
        label: '经历',
        rows: [
          {
            period: '2025.01 — 至今',
            title: '产品经理 · 得物 POIZON',
            desc: '负责开放平台；作为产品负责人独立推动国际商家 AI Agent（Google ADK 多 Agent 架构）从 0 到 1。',
          },
          {
            period: '2023.06 — 2025.01',
            title: '产品经理 · 字节跳动',
            desc: 'TikTok 开放平台数据开放原则制定与 TikTok Minis 框架冷启动；抖音生活服务服务商平台。',
          },
          {
            period: '2022.05 — 2023.06',
            title: '产品经理 · 微软 Microsoft',
            desc: 'Excel add-in 开发者生态建设与维护。',
          },
          {
            period: '2017.11 — 2022.05',
            title: '产品经理 · 字节跳动',
            desc: '字节小程序 0→1（今日头条 / 抖音 SDK 与 API），抖音开放平台重点行业生态（电商 / 本地生活，带 4 人）。',
          },
          {
            period: '2016.04 — 2017.11',
            title: '产品经理 · 迅雷',
            desc: '职业起点，从需求调研与执行做起。',
          },
        ],
      },
      education: {
        label: '教育',
        rows: [
          { period: '2013 — 2016', title: '武汉邮电科学研究院 · 通信与信息系统 · 硕士' },
          { period: '2009 — 2013', title: '华中科技大学 · 电子与信息工程 · 本科' },
        ],
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
    sampleChip: 'Short version · full résumé available on request',
    sections: {
      experience: {
        label: 'Experience',
        rows: [
          {
            period: '2025.01 — now',
            title: 'Product Manager · POIZON (Dewu)',
            desc: 'Own the open platform; as product lead, drove an international merchant AI agent (Google ADK multi-agent architecture) from 0→1.',
          },
          {
            period: '2023.06 — 2025.01',
            title: 'Product Manager · ByteDance',
            desc: 'Data-openness principles for the TikTok open platform and the cold start of the TikTok Minis framework; Douyin local-services provider platform.',
          },
          {
            period: '2022.05 — 2023.06',
            title: 'Product Manager · Microsoft',
            desc: 'Built and maintained the Excel add-in developer ecosystem.',
          },
          {
            period: '2017.11 — 2022.05',
            title: 'Product Manager · ByteDance',
            desc: 'Mini-program platform 0→1 (Toutiao / Douyin SDK & API); key-industry ecosystems on the Douyin open platform (e-commerce / local services, led a team of 4).',
          },
          {
            period: '2016.04 — 2017.11',
            title: 'Product Manager · Xunlei',
            desc: 'Career start — began in user research and execution.',
          },
        ],
      },
      education: {
        label: 'Education',
        rows: [
          { period: '2013 — 2016', title: 'Wuhan Research Institute of P&T · Communication & Information Systems · M.S.' },
          { period: '2009 — 2013', title: 'Huazhong University of Science and Technology · Electronic & Information Engineering · B.S.' },
        ],
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
