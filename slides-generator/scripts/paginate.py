#!/usr/bin/env python3
"""
Step 2: Paginate - Inject --- separators to create Reveal-ready Markdown
Input: Parsed JSON (linear speech draft)
Output: Reveal-ready Markdown with --- slide separators
"""

import sys
import json
import re


def paginate(data: dict) -> str:
    """Convert parsed data into Reveal.js-ready Markdown."""
    title = data.get('title', 'Untitled')
    steps = data.get('steps', [])

    md_parts = [f"# {title}\n"]

    for i, step in enumerate(steps):
        step_title = step.get('title', f'Step {i + 1}')
        step_subtitle = step.get('subtitle', '')
        content = step.get('content', '')

        # Add slide separator
        if i > 0:
            md_parts.append('\n---\n')

        # Add slide header
        md_parts.append(f'## {step_title}\n')

        if step_subtitle:
            md_parts.append(f'*{step_subtitle}*\n')

        # Process content - convert to appropriate blocks
        md_parts.append(process_content(content))

    return ''.join(md_parts)


def process_content(content: str) -> str:
    """Process content and convert to Markdown blocks."""
    lines = content.split('\n')
    result = []
    in_code_block = False
    in_list = False

    for line in lines:
        line = line.strip()

        if not line:
            if in_list:
                result.append('')
                in_list = False
            continue

        # Code block markers
        if line.startswith('```'):
            if not in_code_block:
                in_code_block = True
            else:
                in_code_block = False
            result.append(line)
            continue

        if in_code_block:
            result.append(line)
            continue

        # List detection
        if re.match(r'^[\-\*\d]+\.?\s+', line):
            if not in_list:
                result.append('')
                in_list = True
            result.append(line)
            continue

        # Headings
        if re.match(r'^#{1,6}\s+', line):
            result.append(line)
            continue

        # Regular paragraph
        if not in_list:
            result.append(line)

    return '\n'.join(result) + '\n'


def main():
    if len(sys.argv) < 2:
        print("Usage: paginate.py <input.json> [output.md]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else None

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON: {e}")
        sys.exit(1)

    result = paginate(data)

    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(result)
        print(f"Paginated Markdown saved to: {output_path}")
    else:
        print(result)


if __name__ == '__main__':
    main()
