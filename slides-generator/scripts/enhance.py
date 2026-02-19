#!/usr/bin/env python3
"""
Step 3: Enhance - Convert LaTeX formulas and Mermaid diagrams
Input: Reveal-ready Markdown
Output: Markdown with rendered formulas and diagrams
"""

import sys
import re


def enhance_latex(content: str) -> str:
    """Convert LaTeX formulas to Reveal.js compatible format."""
    # Match inline math: $...$
    inline_pattern = r'\$([^\$\n]+?)\$'

    # Match display math: $$...$$
    display_pattern = r'\$\$([^\$\n]+?)\$\$'

    # Replace display math with Reveal.js math plugin format
    def replace_display(match):
        formula = match.group(1).strip()
        return f'$$\n{formula}\n$$'

    # Replace inline math with Reveal.js math plugin format
    def replace_inline(match):
        formula = match.group(1).strip()
        return f'${formula}$'

    content = re.sub(display_pattern, replace_display, content)
    content = re.sub(inline_pattern, replace_inline, content)

    return content


def enhance_mermaid(content: str) -> str:
    """Convert Mermaid code blocks to Reveal.js format."""
    # Match ```mermaid blocks
    pattern = r'```mermaid\n(.*?)```'

    def replace_mermaid(match):
        diagram_code = match.group(1).strip()
        return f'```mermaid\n{diagram_code}\n```'

    content = re.sub(pattern, replace_mermaid, content, flags=re.DOTALL)

    return content


def add_math_plugin(html_content: str) -> str:
    """Add KaTeX/MathJax plugin to HTML head if math is detected."""
    math_import = '''    <!-- Math plugin for LaTeX rendering -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });"></script>
'''

    # Add before closing head tag
    if '</head>' in html_content:
        html_content = html_content.replace('</head>', math_import + '</head>')

    return html_content


def add_mermaid_plugin(html_content: str) -> str:
    """Add Mermaid.js plugin to HTML if mermaid diagrams are detected."""
    mermaid_import = '''    <!-- Mermaid.js for diagrams -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
'''

    if '</body>' in html_content:
        html_content = html_content.replace('</body>', mermaid_import + '</body>')

    return html_content


def enhance_markdown_file(file_path: str) -> str:
    """Enhance a Markdown file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    content = enhance_latex(content)
    content = enhance_mermaid(content)

    return content


def main():
    if len(sys.argv) < 2:
        print("Usage: enhance.py <input.md|input.html> [output]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        sys.exit(1)

    # Check file type
    if input_path.endswith('.html'):
        # For HTML files, add plugins if content has math/mermaid
        has_math = '$' in content or '$$' in content
        has_mermaid = 'mermaid' in content.lower()

        if has_math:
            content = add_math_plugin(content)
        if has_mermaid:
            content = add_mermaid_plugin(content)
    else:
        # For Markdown, convert LaTeX and Mermaid
        content = enhance_latex(content)
        content = enhance_mermaid(content)

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Enhanced content saved to: {output_path}")
    else:
        print(content)


if __name__ == '__main__':
    main()
