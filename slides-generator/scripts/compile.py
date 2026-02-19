#!/usr/bin/env python3
"""
Step 4: Compile - Fill HTML template with structured Markdown data
Input: Parsed JSON + Template
Output: index.html
"""

import sys
import json
import os
import re
from pathlib import Path


def find_image_for_step(title: str, subtitle: str, images_dir: str) -> str | None:
    """Auto-match image based on title/subtitle."""
    if not images_dir or not os.path.isdir(images_dir):
        return None

    # Generate possible filenames from title
    # e.g., "3.1 多模态认知表征与评估" -> ["3.1.png", "3-1.png", "3.1.png", etc.]
    candidates = []

    # Extract number patterns like "3.1", "3.2.1"
    numbers = re.findall(r'[\d.]+', title)
    for num in numbers:
        # Convert "3.1" -> "3.1.png", "3-1.png"
        candidates.append(f"{num}.png")
        candidates.append(f"{num}.jpg")
        candidates.append(f"{num}.jpeg")
        candidates.append(f"{num}.webp")
        candidates.append(num.replace('.', '-') + '.png')
        candidates.append(num.replace('.', '-') + '.jpg')

    # Also try subtitle numbers
    if subtitle:
        sub_numbers = re.findall(r'[\d.]+', subtitle)
        for num in sub_numbers:
            candidates.append(f"{num}.png")
            candidates.append(f"{num}.jpg")
            candidates.append(f"{num}.jpeg")
            candidates.append(f"{num}.webp")
            candidates.append(num.replace('.', '-') + '.png')
            candidates.append(num.replace('.', '-') + '.jpg')

    # Check each candidate
    for candidate in candidates:
        img_path = os.path.join(images_dir, candidate)
        if os.path.exists(img_path):
            # Return relative path from output directory
            return f"images/{candidate}"

    return None


def load_template(template_dir: str = None) -> tuple:
    """Load HTML, CSS, and JS templates."""
    if template_dir is None or template_dir == '':
        # Default to assets/templates in skill directory
        skill_dir = Path(__file__).parent.parent
        template_dir = skill_dir / 'assets' / 'templates'

    template_dir = Path(template_dir)

    with open(template_dir / 'index.html', 'r', encoding='utf-8') as f:
        html_template = f.read()

    with open(template_dir / 'styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    with open(template_dir / 'app.js', 'r', encoding='utf-8') as f:
        js = f.read()

    return html_template, css, js


def convert_to_steps_json(data: dict, images_dir: str = None, has_cover: bool = False) -> str:
    """Convert parsed data to steps.js format."""
    title = data.get('title', 'Untitled')
    speaker = data.get('speaker', '')
    team = data.get('team', '')
    steps = data.get('steps', [])

    # Build steps array
    steps_array = []

    for i, step in enumerate(steps):
        step_title = step.get('title', f'Step {i + 1}')
        step_subtitle = step.get('subtitle', '')
        content = step.get('content', '')

        # Parse content into blocks
        blocks = parse_content_to_blocks(content)

        # Extract key points from bullet lists (first 3 items)
        key_points = extract_key_points(content)

        # Auto-match image if images_dir provided
        right = {'type': 'placeholder', 'placeholder': 'Add an image or video for this step'}
        if images_dir:
            img_path = find_image_for_step(step_title, step_subtitle, images_dir)
            if img_path:
                right = {
                    'type': 'image',
                    'src': img_path,
                    'alt': step_title
                }

        step_obj = {
            'id': f'step-{i + 1}',
            'order': i + 1,
            'stepLabel': f'{i + 1}. {step_title}',
            'title': step_title,
            'subtitle': step_subtitle,
            'left': {
                'blocks': blocks
            },
            'keyPoints': key_points,
            'right': right
        }

        steps_array.append(step_obj)

    # Create steps.js content
    js_content = f'''// Step data for "{title}"
const hasCover = {str(has_cover).lower()};
const coverTitle = "{title}";
const coverSpeaker = "{speaker}";
const coverTeam = "{team}";
const steps = {json.dumps(steps_array, ensure_ascii=False, indent=2)};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {{
  module.exports = {{ steps, hasCover, coverTitle, coverSpeaker, coverTeam }};
}}
'''

    return js_content


def strip_markdown(text: str) -> str:
    """Remove markdown formatting symbols from text."""
    import re
    # Remove bold markers **text** or __text__
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'__([^_]+)__', r'\1', text)
    # Remove italic markers *text* or _text_
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    text = re.sub(r'_([^_]+)_', r'\1', text)
    # Remove inline code markers `code`
    text = re.sub(r'`([^`]+)`', r'\1', text)
    # Remove link syntax [text](url) but keep text
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    # Remove reference-style links [text][ref]
    text = re.sub(r'\[([^\]]+)\]\[[^\]]+\]', r'\1', text)
    return text.strip()


def extract_key_points(content: str, max_points: int = 3) -> dict:
    """Extract key points from bullet lists in content, with label detection."""
    import re

    key_points = []
    label = "Key Points"
    icon = "💡"

    lines = content.split('\n')

    for line in lines:
        line = line.strip()
        # Match bullet points: - item, * item, or numbered lists
        match = re.match(r'^[-*]\s+(.+)$|^\d+\.\s+(.+)$', line)
        if match:
            item = match.group(1) or match.group(2)
            # Clean markdown formatting
            item = strip_markdown(item)
            if item and len(item) < 100:  # Skip too long items
                key_points.append(item)
        if len(key_points) >= max_points:
            break

    # Detect label based on content
    content_lower = content.lower()
    if any(word in content_lower for word in ['warning', '注意', '警告', 'caution', 'danger']):
        label = "Warning"
        icon = "⚠️"
    elif any(word in content_lower for word in ['tip', 'tips', '技巧', '提示', '建议']):
        label = "Tips"
        icon = "💡"
    elif any(word in content_lower for word in ['info', 'information', '信息', 'note']):
        label = "Info"
        icon = "ℹ️"
    elif any(word in content_lower for word in ['success', '成功', 'done']):
        label = "Success"
        icon = "✅"

    if not key_points:
        return None

    return {
        'label': label,
        'icon': icon,
        'items': key_points
    }


def parse_content_to_blocks(content: str) -> list:
    """Parse raw content into structured blocks."""
    import re

    blocks = []
    lines = content.split('\n')
    current_paragraph = []
    in_code_block = False
    code_content = []
    code_lang = ''

    def flush_paragraph():
        nonlocal current_paragraph
        if current_paragraph:
            text = ' '.join(current_paragraph).strip()
            if text:
                # Clean markdown formatting
                text = strip_markdown(text)
                if text:
                    blocks.append({
                        'type': 'paragraph',
                        'text': text
                    })
            current_paragraph = []

    for line in lines:
        line = line.strip()

        if not line:
            flush_paragraph()
            continue

        # Code block start/end
        if line.startswith('```'):
            if not in_code_block:
                flush_paragraph()
                in_code_block = True
                code_lang = line[3:].strip()
                code_content = []
            else:
                # End code block
                blocks.append({
                    'type': 'codeTabs',
                    'tabs': [{
                        'label': code_lang or 'Code',
                        'code': '\n'.join(code_content),
                        'lang': code_lang
                    }]
                })
                in_code_block = False
                code_content = []
            continue

        if in_code_block:
            code_content.append(line)
            continue

        # Headings
        heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
        if heading_match:
            flush_paragraph()
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            blocks.append({
                'type': 'heading',
                'level': min(level, 3),  # Cap at h3
                'text': text
            })
            continue

        # Lists
        list_match = re.match(r'^([\-\*]|\d+\.)\s+(.+)$', line)
        if list_match:
            flush_paragraph()
            # Clean markdown from list item
            item_text = strip_markdown(list_match.group(2))
            # Check if previous block was a list
            if blocks and blocks[-1].get('type') == 'list':
                blocks[-1]['items'].append(item_text)
            else:
                style = 'ordered' if list_match.group(1).isdigit() else 'unordered'
                blocks.append({
                    'type': 'list',
                    'style': style,
                    'items': [item_text]
                })
            continue

        # Regular text - accumulate paragraphs
        current_paragraph.append(line)

    # Flush remaining
    flush_paragraph()

    # If no blocks, add a default
    if not blocks:
        blocks.append({
            'type': 'paragraph',
            'text': content[:200] + '...' if len(content) > 200 else content
        })

    return blocks


def compile(data: dict, output_dir: str, template_dir: str = None, images_dir: str = None):
    """Compile data into HTML files."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load templates
    html_template, css, js = load_template(template_dir)

    # Get title
    title = data.get('title', 'Untitled Presentation')
    speaker = data.get('speaker', '')
    team = data.get('team', '')
    steps_count = len(data.get('steps', []))

    # Fill HTML template
    html_content = html_template
    html_content = html_content.replace('{{TITLE}}', title)
    html_content = html_content.replace('{{TOTAL_STEPS}}', str(steps_count))
    html_content = html_content.replace('{{SPEAKER}}', speaker if speaker else '')
    html_content = html_content.replace('{{TEAM}}', team if team else '')

    # Check if cover should be shown
    has_cover = bool(speaker or team)

    # Generate steps.js with auto-matched images
    steps_js = convert_to_steps_json(data, images_dir, has_cover)

    # Write files
    with open(output_dir / 'index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)

    with open(output_dir / 'styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

    with open(output_dir / 'app.js', 'w', encoding='utf-8') as f:
        f.write(js)

    with open(output_dir / 'steps.js', 'w', encoding='utf-8') as f:
        f.write(steps_js)

    print(f"Compiled presentation saved to: {output_dir}")
    return output_dir


def main():
    if len(sys.argv) < 2:
        print("Usage: compile.py <input.json> [output_dir] [template_dir] [images_dir]")
        sys.exit(1)

    input_path = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else 'dist'
    template_dir = sys.argv[3] if len(sys.argv) > 3 else None
    images_dir = sys.argv[4] if len(sys.argv) > 4 else None

    try:
        with open(input_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {input_path}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON: {e}")
        sys.exit(1)

    compile(data, output_dir, template_dir, images_dir)


if __name__ == '__main__':
    main()
