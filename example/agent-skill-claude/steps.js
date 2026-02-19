// Step data following the schema from Claude.md
const steps = [
  {
    id: "install-antigravity",
    order: 1,
    stepLabel: "1. 安装 Antigravity",
    title: "Install Antigravity Extension",
    subtitle: "Get started with the AI coding assistant",
    left: {
      blocks: [
        {
          type: "paragraph",
          text: "Antigravity is a powerful AI coding assistant that helps you write better code faster. Let's get it installed!"
        },
        {
          type: "heading",
          level: 2,
          text: "Installation Steps"
        },
        {
          type: "list",
          style: "ordered",
          items: [
            "Open VS Code or your preferred IDE",
            "Navigate to the Extensions marketplace",
            "Search for 'Antigravity'",
            "Click Install and wait for completion"
          ]
        },
        {
          type: "callout",
          tone: "info",
          text: "💡 Tip: Make sure you have the latest version of your IDE for the best experience."
        }
      ]
    },
    right: {
      type: "image",
      src: "images/step1-install.png",
      alt: "Antigravity installation screenshot",
      aspect: "16:9"
    },
    meta: {
      tags: ["setup", "installation"],
      estimatedMinutes: 2
    }
  },
  {
    id: "configure-api",
    order: 2,
    stepLabel: "2. 配置 API",
    title: "Configure Your API Key",
    subtitle: "Connect to the AI service",
    left: {
      blocks: [
        {
          type: "paragraph",
          text: "To use Antigravity, you'll need to configure your API key. This connects the extension to the AI service."
        },
        {
          type: "heading",
          level: 2,
          text: "Platform-Specific Commands"
        },
        {
          type: "codeTabs",
          tabs: [
            {
              label: "macOS",
              code: "export ANTIGRAVITY_API_KEY='your-api-key-here'\necho $ANTIGRAVITY_API_KEY",
              lang: "bash"
            },
            {
              label: "Windows",
              code: "set ANTIGRAVITY_API_KEY=your-api-key-here\necho %ANTIGRAVITY_API_KEY%",
              lang: "cmd"
            }
          ]
        },
        {
          type: "callout",
          tone: "warning",
          text: "⚠️ Never commit your API key to version control. Use environment variables or a .env file."
        }
      ]
    },
    right: {
      type: "image",
      src: "images/step2-config.png",
      alt: "API configuration interface",
      aspect: "16:9"
    },
    meta: {
      tags: ["configuration", "api"],
      estimatedMinutes: 3
    }
  },
  {
    id: "create-skill",
    order: 3,
    stepLabel: "3. 创建技能",
    title: "Create Your First Skill",
    subtitle: "Extend Antigravity with custom capabilities",
    left: {
      blocks: [
        {
          type: "paragraph",
          text: "Skills are powerful extensions that teach Antigravity new capabilities. Let's create a simple skill!"
        },
        {
          type: "heading",
          level: 2,
          text: "Skill Structure"
        },
        {
          type: "list",
          style: "unordered",
          items: [
            "Create a new folder in .agent/skills/",
            "Add a SKILL.md file with instructions",
            "Include any helper scripts in scripts/",
            "Add example usage in examples/"
          ]
        },
        {
          type: "heading",
          level: 3,
          text: "Quick Start Template"
        },
        {
          type: "codeTabs",
          tabs: [
            {
              label: "SKILL.md",
              code: "---\nname: My Custom Skill\ndescription: Does something amazing\n---\n\n# Instructions\n\nDetailed steps on how to use this skill...",
              lang: "markdown"
            }
          ]
        },
        {
          type: "callout",
          tone: "success",
          text: "✅ Skills are automatically discovered and loaded when you restart Antigravity."
        }
      ]
    },
    right: {
      type: "image",
      src: "images/step3-skill.png",
      alt: "Skill creation interface",
      aspect: "16:9"
    },
    meta: {
      tags: ["skills", "customization"],
      estimatedMinutes: 5
    }
  },
  {
    id: "use-workflows",
    order: 4,
    stepLabel: "4. 使用工作流",
    title: "Master Workflows",
    subtitle: "Automate repetitive tasks",
    left: {
      blocks: [
        {
          type: "paragraph",
          text: "Workflows help you automate common development tasks. They're defined as markdown files with specific steps."
        },
        {
          type: "heading",
          level: 2,
          text: "Creating a Workflow"
        },
        {
          type: "list",
          style: "ordered",
          items: [
            "Create a .md file in .agent/workflows/",
            "Add YAML frontmatter with description",
            "Write step-by-step instructions",
            "Use // turbo annotation for auto-run steps"
          ]
        },
        {
          type: "callout",
          tone: "info",
          text: "💡 Workflows can be triggered with slash commands like /deploy or /test"
        }
      ]
    },
    right: {
      type: "image",
      src: "images/step4-workflow.mp4",
      alt: "Workflow demonstration",
      aspect: "16:9"
    },
    meta: {
      tags: ["workflows", "automation"],
      estimatedMinutes: 4
    }
  },
  {
    id: "advanced-features",
    order: 5,
    stepLabel: "5. 高级特性",
    title: "Explore Advanced Features",
    subtitle: "Take your productivity to the next level",
    left: {
      blocks: [
        {
          type: "paragraph",
          text: "Now that you've mastered the basics, let's explore some advanced features that will supercharge your development workflow."
        },
        {
          type: "heading",
          level: 2,
          text: "Advanced Capabilities"
        },
        {
          type: "list",
          style: "unordered",
          items: [
            "Knowledge Items (KI) - Persistent context across conversations",
            "Browser automation - Test and interact with web apps",
            "Multi-file refactoring - Complex code transformations",
            "Custom MCP servers - Extend with external tools"
          ]
        },
        {
          type: "heading",
          level: 3,
          text: "Learn More"
        },
        {
          type: "paragraph",
          text: "Check out the official documentation for detailed guides on each feature."
        },
        {
          type: "callout",
          tone: "success",
          text: "🎉 Congratulations! You're now ready to use Antigravity like a pro!"
        }
      ]
    },
    right: {
      type: "iframe",
      iframeUrl: "https://example.com/demo",
      alt: "Interactive demo",
      aspect: "16:9"
    },
    meta: {
      tags: ["advanced", "features"],
      estimatedMinutes: 6
    }
  }
];

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { steps };
}
