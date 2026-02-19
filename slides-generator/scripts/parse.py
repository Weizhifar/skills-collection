#!/usr/bin/env python3
"""
Step 1: Parse PDF/MD and extract semantic content
Input: PDF or MD file
Output: Linear speech draft (structured text)

Options:
  --level N       Split granularity: 2 (H2), 3 (H2+H3), 4 (H2+H3+H4), etc.
  --max-items N   Split lists into separate slides if > N items
  --max-chars N   Split content if > N characters (approximate)
"""

import sys
import os
import re
import argparse
from pathlib import Path

try:
    import pypdf
except ImportError:
    pypdf = None


def split_by_headings(content: str, min_level: int = 2, max_level: int = 3) -> list:
    """Split content by headings from min_level to max_level."""
    if min_level > max_level:
        return [('', 0, content)]
    pattern = r'^(#{' + str(min_level) + r',' + str(max_level) + r'})\s+(.+)$'
    matches = list(re.finditer(pattern, content, re.MULTILINE))

    if not matches:
        return [('', 0, content)]

    result = []

    for i, match in enumerate(matches):
        heading_prefix = match.group(1)
        heading_title = match.group(2)
        heading_level = len(heading_prefix)
        start_pos = match.start()

        if i + 1 < len(matches):
            end_pos = matches[i + 1].start()
        else:
            end_pos = len(content)

        section_content = content[start_pos:end_pos].strip()
        section_content = re.sub(r'^' + re.escape(heading_prefix) + r'\s+' + re.escape(heading_title) + r'\n?', '', section_content, flags=re.MULTILINE)

        result.append((heading_title, heading_level, section_content))

    return result


def split_by_list_items(content: str, max_items: int) -> list:
    """Split content into multiple slides if there are too many list items."""
    lines = content.split('\n')
    items = []
    current_item = []
    result = []

    for line in lines:
        list_match = re.match(r'^([\-\*]|\d+\.)\s+(.+)$', line.strip())

        if list_match:
            items.append(line.strip())
        else:
            if items:
                # Process accumulated items
                for i in range(0, len(items), max_items):
                    chunk = items[i:i + max_items]
                    result.append('\n'.join(chunk))
                    if current_item:
                        result.append('\n'.join(current_item))
                        current_item = []
                items = []

            current_item.append(line)

    # Handle remaining
    if items:
        for i in range(0, len(items), max_items):
            chunk = items[i:i + max_items]
            result.append('\n'.join(chunk))

    if current_item:
        result.append('\n'.join(current_item))

    return result if result else [content]


def parse_markdown(file_path: str, level: int = 3, max_items: int = 0, max_chars: int = 0) -> dict:
    """Parse Markdown file with configurable granularity."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract title from first H1
    title_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else Path(file_path).stem

    # Extract speaker and team from metadata (frontmatter or special comments)
    speaker = ''
    team = ''

    # Check for frontmatter
    fm_match = re.search(r'^---\n(.*?)\n---', content, re.DOTALL)
    if fm_match:
        fm_content = fm_match.group(1)
        speaker_match = re.search(r'speaker:\s*(.+)$', fm_content, re.MULTILINE)
        team_match = re.search(r'team:\s*(.+)$', fm_content, re.MULTILINE)
        if speaker_match:
            speaker = speaker_match.group(1).strip()
        if team_match:
            team = team_match.group(1).strip()

    # Check for comment-style metadata after title
    if not speaker:
        speaker_match = re.search(r'^<!--\s*speaker:\s*(.+?)\s*-->', content, re.MULTILINE)
        if speaker_match:
            speaker = speaker_match.group(1).strip()

    if not team:
        team_match = re.search(r'^<!--\s*team:\s*(.+?)\s*-->', content, re.MULTILINE)
        if team_match:
            team = team_match.group(1).strip()

    # Remove title
    content_without_title = re.sub(r'^#\s+.+\n?', '', content, flags=re.MULTILINE)

    # Remove frontmatter from content
    content_without_title = re.sub(r'^---\n.*?\n---\n?', '', content_without_title, flags=re.DOTALL | re.MULTILINE)

    # Remove comment-style metadata from content
    content_without_title = re.sub(r'^<!--\s*speaker:\s*.+?\s*-->\n?', '', content_without_title, flags=re.MULTILINE)
    content_without_title = re.sub(r'^<!--\s*team:\s*.+?\s*-->\n?', '', content_without_title, flags=re.MULTILINE)

    # Split by headings
    sections = split_by_headings(content_without_title, min_level=2, max_level=level)

    steps = []

    # Skip intro content when cover is enabled (speaker or team present)
    # to avoid duplication with cover slide
    has_cover = bool(speaker or team)

    if not has_cover:
        # Only add intro step when there's no cover
        first_h2_match = re.search(r'^##\s+', content_without_title, re.MULTILINE)
        if first_h2_match:
            intro_content = content_without_title[:first_h2_match.start()].strip()
            if intro_content:
                steps.append({
                    'title': title,
                    'subtitle': 'Introduction',
                    'content': intro_content
                })

    # Process each section
    for heading_title, heading_level, section_content in sections:
        if not section_content.strip():
            continue

        # Check for sub-sections
        sub_pattern = r'^#{' + str(heading_level + 1) + r'}\s+'
        has_subs = re.search(sub_pattern, section_content, re.MULTILINE)

        if has_subs:
            # Split by sub-headings
            subsections = split_by_headings(section_content, min_level=heading_level + 1, max_level=level)
            for sub_title, sub_level, sub_content in subsections:
                if sub_content.strip():
                    # Use parent heading as title if sub_title is empty
                    final_title = sub_title if sub_title else heading_title
                    processed = process_content(sub_content.strip(), max_items, max_chars)
                    if isinstance(processed, list):
                        for p in processed:
                            steps.append({
                                'title': p['title'] if p['title'] else final_title,
                                'subtitle': heading_title,
                                'content': p['content']
                            })
                    else:
                        steps.append({
                            'title': final_title,
                            'subtitle': heading_title,
                            'content': processed
                        })
        else:
            processed = process_content(section_content.strip(), max_items, max_chars)
            if isinstance(processed, list):
                for p in processed:
                    final_title = p['title'] if p['title'] else heading_title
                    steps.append({
                        'title': final_title,
                        'subtitle': '',
                        'content': p['content']
                    })
            else:
                steps.append({
                    'title': heading_title if heading_title else 'Overview',
                    'subtitle': '',
                    'content': processed
                })

    if not steps:
        steps.append({
            'title': title,
            'subtitle': 'Overview',
            'content': content_without_title.strip()
        })

    return {
        'title': title,
        'speaker': speaker,
        'team': team,
        'steps': steps
    }


def process_content(content: str, max_items: int, max_chars: int) -> str | list:
    """Apply content splitting rules."""
    result = content

    # Split by list items if configured
    if max_items > 0:
        list_items = re.findall(r'^([\-\*]|\d+\.)\s+.+$', content, re.MULTILINE)
        if len(list_items) > max_items:
            # Split into multiple slides
            lines = content.split('\n')
            slides = []
            current_slide = []
            item_count = 0

            for line in lines:
                if re.match(r'^([\-\*]|\d+\.)\s+', line.strip()):
                    item_count += 1
                    if item_count > max_items and current_slide:
                        slides.append('\n'.join(current_slide))
                        current_slide = []
                        item_count = 1
                current_slide.append(line)

            if current_slide:
                slides.append('\n'.join(current_slide))

            # Convert to list of dicts with better titles
            return [{'title': f'({i+1}/{len(slides)})', 'content': s} for i, s in enumerate(slides)]

    # Split by character count if configured
    if max_chars > 0 and len(result) > max_chars:
        # Split at paragraph or list boundaries
        paragraphs = re.split(r'\n\n+', content)
        slides = []
        current = []

        for para in paragraphs:
            if sum(len(c) for c in current) + len(para) > max_chars and current:
                slides.append('\n\n'.join(current))
                current = []
            current.append(para)

        if current:
            slides.append('\n\n'.join(current))

        if len(slides) > 1:
            return [{'title': f'Part {i+1}', 'content': s} for i, s in enumerate(slides)]

    return result


def parse_pdf(file_path: str) -> dict:
    """Parse PDF file."""
    if pypdf is None:
        raise ImportError("pypdf is required for PDF parsing. Install with: pip install pypdf")

    reader = pypdf.PdfReader(file_path)
    full_text = []

    for page in reader.pages:
        text = page.extract_text()
        if text:
            full_text.append(text)

    all_text = '\n'.join(full_text)
    first_lines = all_text.strip().split('\n')
    title = first_lines[0][:100] if first_lines else Path(file_path).stem

    pages_text = [p.strip() for p in full_text if p.strip()]

    steps = []
    for i, page_text in enumerate(pages_text):
        steps.append({
            'title': f'Page {i + 1}',
            'subtitle': '',
            'content': page_text
        })

    return {
        'title': title,
        'steps': steps
    }


def main():
    parser = argparse.ArgumentParser(description='Parse PDF/MD to structured slides')
    parser.add_argument('input', help='Input PDF or MD file')
    parser.add_argument('output', nargs='?', help='Output JSON file')
    parser.add_argument('--level', type=int, default=3, choices=[2, 3, 4, 5, 6],
                        help='Heading level for splitting (2=H2, 3=H2+H3, etc.)')
    parser.add_argument('--max-items', type=int, default=0,
                        help='Split list into separate slides if > N items')
    parser.add_argument('--max-chars', type=int, default=0,
                        help='Split content if > N characters')

    args = parser.parse_args()

    if not os.path.exists(args.input):
        print(f"Error: File not found: {args.input}")
        sys.exit(1)

    ext = Path(args.input).suffix.lower()

    if ext == '.pdf':
        result = parse_pdf(args.input)
    elif ext in ['.md', '.markdown']:
        result = parse_markdown(args.input, args.level, args.max_items, args.max_chars)
    else:
        print(f"Error: Unsupported file format: {ext}")
        sys.exit(1)

    import json
    output = json.dumps(result, ensure_ascii=False, indent=2)

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            f.write(output)
        print(f"Parsed content saved to: {args.output}")
    else:
        print(output)


if __name__ == '__main__':
    main()
