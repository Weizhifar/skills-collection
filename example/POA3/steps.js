// Step data for "多模态信息传播与认知致效评估：全球视野下的技术调研报告 (2021-2026)"
const hasCover = true;
const coverTitle = "多模态信息传播与认知致效评估：全球视野下的技术调研报告 (2021-2026)";
const coverSpeaker = "张三";
const coverTeam = "人工智能研究院";
const steps = [
  {
    "id": "step-1",
    "order": 1,
    "stepLabel": "1. 1. 概述",
    "title": "1. 概述",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "paragraph",
          "text": "本报告聚焦于多模态信息传播、认知致效评估、社会计算仿真及因果推断推荐等关键技术。在原有基于国内研究的调研基础上，本版本新增了全球（特别是美国、欧洲）的前沿研究进展，旨在通过对比分析，揭示不同地缘背景下的技术演进路径与应用侧重。"
        }
      ]
    },
    "keyPoints": null,
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-2",
    "order": 2,
    "stepLabel": "2. 2. 全球研究格局对比",
    "title": "2. 全球研究格局对比",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "中国（应用导向与社会治理）：",
            "侧重：舆情监测、文化安全、公共卫生传播、社会治理。",
            "特点：强调“生理-心理-行为”的多模态融合实验，注重宏观社会现象的复现与干预策略（如辟谣、正能量传播）。",
            "欧美（机制探索与底层架构）：",
            "侧重：涌现行为机制、认知安全、大模型说服力边界、基础仿真架构。",
            "特点：关注Agent个体的微观认知机制（Memory, Reflection），致力于构建通用的社会模拟器（Sandbox），以及从因果层面解释传播路径。"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Key Points",
      "icon": "💡",
      "items": [
        "中国（应用导向与社会治理）：",
        "侧重：舆情监测、文化安全、公共卫生传播、社会治理。",
        "特点：强调“生理-心理-行为”的多模态融合实验，注重宏观社会现象的复现与干预策略（如辟谣、正能量传播）。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-3",
    "order": 3,
    "stepLabel": "3. 3.1 多模态认知表征与评估 (2021-2026)",
    "title": "3.1 多模态认知表征与评估 (2021-2026)",
    "subtitle": "3.1 多模态认知表征与评估 (2021-2026)",
    "left": {
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "3.1.1 认知致效与说服力研究（欧美前沿）"
        },
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "MMPersuade (UCLA/Salesforce, 2025)：",
            "发现：多模态输入（图文结合）显著提升了LLM的说服力，尤其在虚假信息场景下。即使受众有先验偏好，多模态信息仍能有效改变观点。",
            "引用：MMPersuade: A Dataset and Evaluation Framework for Multimodal Persuasion",
            "PMIYC (UIUC, 2025)：",
            "进展：提出了自动化框架评估LLM的说服有效性与易感性。研究显示GPT-4o在抵御虚假信息说服方面比Llama-3强50%以上，揭示了模型安全性的差异。",
            "引用：How Do LLMs Persuade?"
          ]
        },
        {
          "type": "heading",
          "level": 3,
          "text": "3.1.2 生理心理融合评估（国内进展）"
        },
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "技术趋势：从单一文本分析转向“生理-心理-行为”多模态融合评估。",
            "关键进展：",
            "客观指标融合：脑电眼动协同实验在认知负荷预测中表现优异。",
            "引用：《基于多模态数据预测公共数字文化服务用户认知负荷》 (武汉大学, 2025)"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Info",
      "icon": "ℹ️",
      "items": [
        "MMPersuade (UCLA/Salesforce, 2025)：",
        "发现：多模态输入（图文结合）显著提升了LLM的说服力，尤其在虚假信息场景下。即使受众有先验偏好，多模态信息仍能有效改变观点。",
        "引用：MMPersuade: A Dataset and Evaluation Framework for Multimodal Persuasion"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-4",
    "order": 4,
    "stepLabel": "4. 3.2 大规模智能体社会仿真 (ABSS)",
    "title": "3.2 大规模智能体社会仿真 (ABSS)",
    "subtitle": "3.2 大规模智能体社会仿真 (ABSS)",
    "left": {
      "blocks": [
        {
          "type": "heading",
          "level": 3,
          "text": "3.2.1 通用社会模拟架构（国际主流）"
        },
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "Generative Agents (Stanford, 2023-2025)：",
            "地位：开创性工作，定义了基于LLM的Agent架构（记忆、反思、规划）。",
            "最新进展：2025年的后续研究验证了其模拟真实人类态度和行为的准确率达到85%，并扩展到了政策制定和社区设计领域。",
            "引用：Generative Agents: Interactive Simulacra of Human Behavior",
            "AgentSociety (2025)：",
            "突破：实现了10万+ Agent与500万+ 交互的超大规模仿真。",
            "应用：在普遍基本收入（UBI）、极端灾害（飓风）等复杂社会议题上进行了实验，结果与现实高度吻合。",
            "引用：AgentSociety: Large-Scale Simulation of LLM-Driven Generative Agents"
          ]
        },
        {
          "type": "heading",
          "level": 3,
          "text": "3.2.2 舆情与传播专用仿真（国内特色）"
        },
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "RumorSphere (2025)：实现了百万规模的谣言传播动态仿真，显著降低了意见偏差。",
            "引用：RumorSphere: A Framework for Million-scale Agent-based Dynamic Simulation",
            "MOSAIC (2025)：结合社交图谱与LLM Agent，分析内容审核策略。",
            "引用：MOSAIC: Modeling Social AI for Content Dissemination"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Key Points",
      "icon": "💡",
      "items": [
        "Generative Agents (Stanford, 2023-2025)：",
        "地位：开创性工作，定义了基于LLM的Agent架构（记忆、反思、规划）。",
        "最新进展：2025年的后续研究验证了其模拟真实人类态度和行为的准确率达到85%，并扩展到了政策制定和社区设计领域。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-5",
    "order": 5,
    "stepLabel": "5. 3.3 因果推断与传播机制",
    "title": "3.3 因果推断与传播机制",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "MILD (NeurIPS 2025)：",
            "创新：利用LLM的推理能力构建因果框架，解释信息传播路径。相比传统结构化方法，预测准确率提升12%。",
            "引用：Make Information Diffusion Explainable: LLM-based Causal Framework",
            "LLM as Causal Generators (2024)：",
            "思路：使用LLM定义因果机制，生成反事实数据，用于基准测试因果推断方法。",
            "引用：Language Models as Causal Effect Generators",
            "Diluvsion (2024)：",
            "应用：模拟受限信息环境下的认知极化。",
            "引用：Carthago Delenda Est: Co-opetitive Indirect Information Diffusion Model"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Info",
      "icon": "ℹ️",
      "items": [
        "MILD (NeurIPS 2025)：",
        "创新：利用LLM的推理能力构建因果框架，解释信息传播路径。相比传统结构化方法，预测准确率提升12%。",
        "引用：Make Information Diffusion Explainable: LLM-based Causal Framework"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-6",
    "order": 6,
    "stepLabel": "6. 4.1 经济与市场",
    "title": "4.1 经济与市场",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "国内：《2025年金融科技发展报告》 —— 侧重宏观舆情监测与风险预警。",
            "国际：利用AgentSociety类架构进行政策沙箱模拟（如UBI政策对经济行为的影响），侧重政策制定前的预演。"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Key Points",
      "icon": "💡",
      "items": [
        "国内：《2025年金融科技发展报告》 —— 侧重宏观舆情监测与风险预警。",
        "国际：利用AgentSociety类架构进行政策沙箱模拟（如UBI政策对经济行为的影响），侧重政策制定前的预演。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-7",
    "order": 7,
    "stepLabel": "7. 4.2 公共卫生与社会治理",
    "title": "4.2 公共卫生与社会治理",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "国内：《混合场景下的阅读投入预警模型》 —— 侧重个体认知状态监测与干预。",
            "国际：Stanford团队利用Agent模拟社区互动，设计更合理的公共设施布局与健康传播策略。"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Key Points",
      "icon": "💡",
      "items": [
        "国内：《混合场景下的阅读投入预警模型》 —— 侧重个体认知状态监测与干预。",
        "国际：Stanford团队利用Agent模拟社区互动，设计更合理的公共设施布局与健康传播策略。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-8",
    "order": 8,
    "stepLabel": "8. 4.3 文化传播",
    "title": "4.3 文化传播",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "案例：2025年某国际传播机构利用“多模态认知致效实验验证平台”，对海外受众进行分众化建模。通过模拟不同文化背景下的认知反应，生成了定制化的文化传播策略。"
          ]
        }
      ]
    },
    "keyPoints": {
      "label": "Key Points",
      "icon": "💡",
      "items": [
        "案例：2025年某国际传播机构利用“多模态认知致效实验验证平台”，对海外受众进行分众化建模。通过模拟不同文化背景下的认知反应，生成了定制化的文化传播策略。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  },
  {
    "id": "step-9",
    "order": 9,
    "stepLabel": "9. 5. 总结与启示",
    "title": "5. 总结与启示",
    "subtitle": "",
    "left": {
      "blocks": [
        {
          "type": "list",
          "style": "unordered",
          "items": [
            "技术融合趋势：",
            "LLM + ABM (Agent-Based Modeling)：单纯的LLM Agent计算成本高，趋势是向“LLM决策核心 + 传统ABM规则外壳”的混合架构发展（Hybrid Approach）。",
            "评估维度升级：",
            "从单一的“传播广度”评估，转向“认知致效”与“说服机制”的深度评估。MMPersuade等研究表明，多模态内容的说服力评估是未来的关键。",
            "因果推断落地：",
            "NeurIPS 2025的研究表明，LLM不仅是仿真器，更是因果推理机。利用LLM解释“为什么这条信息火了”比单纯预测“它会火”更具价值。",
            "平台建设建议：",
            "参考AgentSociety，构建支持万级以上Agent并发的社会模拟底座。",
            "集成MMPersuade类的多模态说服力评估模块，量化内容的认知影响力。"
          ]
        },
        {
          "type": "paragraph",
          "text": "--- 调研日期：2026年2月17日"
        }
      ]
    },
    "keyPoints": {
      "label": "Tips",
      "icon": "💡",
      "items": [
        "技术融合趋势：",
        "评估维度升级：",
        "从单一的“传播广度”评估，转向“认知致效”与“说服机制”的深度评估。MMPersuade等研究表明，多模态内容的说服力评估是未来的关键。"
      ]
    },
    "right": {
      "type": "placeholder",
      "placeholder": "Add an image or video for this step"
    }
  }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { steps, hasCover, coverTitle, coverSpeaker, coverTeam };
}
