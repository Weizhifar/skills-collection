# Slides Generator

A Claude Code skill that converts PDF/MD documents into interactive step-by-step web presentations with navigation UI.

## Overview

Slides Generator is a 4-step pipeline that transforms technical documents into engaging, navigable web presentations:

```
Input (PDF/MD) → Parse → Paginate → Enhance → Compile → Output (HTML/CSS/JS)
```
<div align="center">
<img src="./images/index-slide-generator.png" alt="slide-generator" width="400">
</div>

## Installation

This is a Claude Code skill. The skill is automatically available when Claude Code is running with the skills directory configured.

## Quick Start

```bash
python slides-generator/scripts/build.py input.md output_dir
```

## Usage

### Basic Usage

```bash
# From Markdown file
python slides-generator/scripts/build.py document.md slides

# From PDF file
python slides-generator/scripts/build.py document.pdf slides
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--level N` | Heading split granularity (2=H2, 3=H2+H3, 4=H2+H3+H4) | 3 |
| `--max-items N` | Split lists if > N items per slide | 0 (disabled) |
| `--max-chars N` | Split content if > N characters per slide | 0 (disabled) |
| `--images DIR` | Auto-match images from directory | none |

### Examples

```bash
# Split by H2 only (fewer, longer slides)
python slides-generator/scripts/build.py input.md dist --level 2

# Split by H2+H3+H4 (more, shorter slides)
python slides-generator/scripts/build.py input.md dist --level 4

# Split lists with max 3 items per slide
python slides-generator/scripts/build.py input.md dist --max-items 3

# Split content at ~800 characters
python slides-generator/scripts/build.py input.md dist --max-chars 800

# Auto-match images from directory
python slides-generator/scripts/build.py input.md dist --images ./images

# Combine multiple options
python slides-generator/scripts/build.py input.md dist --level 3 --max-items 4 --images ./images
```

## Adding Images

### Option 1: Auto-match (Recommended)

Create an images directory with numbered filenames matching slide titles:

```
images/
├── 1.1.png      # Matches "1.1 Introduction"
├── 2.1.png      # Matches "2.1 Background"
├── 3.1.png      # Matches "3.1 Methodology"
└── 3.2.png      # Matches "3.2 Results"
```

Then build with `--images` flag:

```bash
python slides-generator/scripts/build.py input.md dist --images ./images
```

### Option 2: Manual Edit

After generating, edit `dist/steps.js` to add custom media:

```javascript
{
  "title": "Step Title",
  "left": { ... },
  "right": {
    "type": "image",
    "src": "images/custom.png",
    "alt": "Description"
  }
}
```

### Supported Media Types

- **Image**: `{"type": "image", "src": "path/to/image.png", "alt": "Description"}`
- **Video**: `{"type": "video", "src": "path/to/video.mp4"}`
- **Iframe**: `{"type": "iframe", "iframeUrl": "https://example.com"}`
- **Placeholder**: `{"type": "placeholder", "placeholder": "Text description"}`

## Output Structure

```
output_dir/
├── index.html    # Main HTML with navigation
├── styles.css    # Styling
├── app.js        # Render logic
├── steps.js      # Step data
└── images/       # (optional) media files
```

Open `index.html` in a browser to view the presentation.

## Pipeline Details

### Step 1: Parse

Extracts semantic content from PDF or Markdown files.

```bash
python slides-generator/scripts/parse.py input.md output.json
```

### Step 2: Paginate

Injects `---` separators for slide breaks based on heading levels.

```bash
python slides-generator/scripts/paginate.py input.json output.md
```

### Step 3: Enhance

Converts LaTeX formulas to KaTeX and Mermaid diagrams to SVG.

```bash
python slides-generator/scripts/enhance.py input.md output.md
```

### Step 4: Compile

Generates final HTML with navigation UI.

```bash
python slides-generator/scripts/compile.py input.json output_dir
```

## Template Customization

Edit files in [assets/templates/](assets/templates/) to customize the presentation:

| File | Purpose |
|------|---------|
| `index.html` | Page structure and layout |
| `styles.css` | Visual styling and theme |
| `app.js` | Navigation and interaction logic |

## Features

- Step-by-step navigation (Previous/Next buttons)
- Dot indicators for current position
- Keyboard shortcuts: `←` `→` `Home` `End`
- Code blocks with syntax highlighting
- LaTeX math rendering (via KaTeX)
- Mermaid diagram support
- Responsive design (desktop/tablet/mobile)

## Requirements

- Python 3.8+
- pdfplumber (for PDF parsing)
- Additional dependencies in `requirements.txt`

## License

MIT
