---
name: slides-generator
description: "Convert PDF/MD documents into interactive step-by-step web presentations. Use when user wants to create slide-style web guides from documents - pipeline: (1) Parse PDF/MD extracting semantic content, (2) Paginate with --- separators for Reveal-ready format, (3) Enhance with LaTeX/Mermaid support, (4) Compile to index.html with step navigation UI."
---

# Slides Generator

Convert documents (PDF/MD) into interactive step-based web presentations with navigation.

## Quick Start

Build a presentation from a Markdown or PDF file:

```bash
python scripts/build.py input.md dist
```

## Pipeline Overview

| Step | Action | Input | Output |
|------|--------|-------|--------|
| 1 | Parse | PDF/MD | Linear speech draft (JSON) |
| 2 | Paginate | JSON | Reveal-ready Markdown |
| 3 | Enhance | Markdown | Markdown + LaTeX/Mermaid |
| 4 | Compile | JSON | index.html + steps.js + CSS + app.js |

## Scripts

### scripts/build.py

Main build script - runs all 4 steps in sequence.

```bash
python scripts/build.py <input.pdf|input.md> [output_dir] [options]
```

**Options:**
| Flag | Description | Example |
|------|-------------|---------|
| `--level N` | Heading split granularity (2=H2, 3=H2+H3, 4=H2+H3+H4) | `--level 4` |
| `--max-items N` | Split list if > N items per slide | `--max-items 3` |
| `--max-chars N` | Split content if > N characters | `--max-chars 800` |
| `--images DIR` | Auto-match images from directory | `--images ./images` |

**Examples:**
```bash
# Default (split by H2+H3)
python scripts/build.py input.md dist

# Split by H2 only (fewer, longer slides)
python scripts/build.py input.md dist --level 2

# Split by H2+H3+H4 (more, shorter slides)
python scripts/build.py input.md dist --level 4

# Split lists with max 3 items per slide
python scripts/build.py input.md dist --max-items 3

# Split content at ~800 chars
python scripts/build.py input.md dist --max-chars 800

# Auto-match images from images/ directory
python scripts/build.py input.md dist --images ./images

# Combine options
python scripts/build.py input.md dist --level 3 --max-items 4 --images ./images
```

## Adding Images

### Option 1: Auto-match (recommended)

Place images in a directory with numbered filenames matching slide titles:
```
images/
├── 3.1.png      # Matches "3.1 多模态认知表征与评估"
├── 3.2.png      # Matches "3.2 大规模智能体社会仿真"
└── 3.3.png      # Matches "3.3 因果推断与传播机制"
```

Then build with `--images` flag:
```bash
python scripts/build.py input.md dist --images ./images
```

### Option 2: Manual edit

Edit `dist/steps.js` manually:
```javascript
"right": {
  "type": "image",
  "src": "images/custom.png",
  "alt": "Description"
}
```

### scripts/parse.py

Parse PDF or Markdown files into structured JSON.

```bash
python scripts/parse.py input.md output.json
```

### scripts/paginate.py

Inject `---` separators for slide breaks.

```bash
python scripts/paginate.py input.json output.md
```

### scripts/enhance.py

Convert LaTeX formulas and Mermaid diagrams.

```bash
python scripts/enhance.py input.md output.md
```

### scripts/compile.py

Fill HTML template with parsed data.

```bash
python scripts/compile.py input.json output_dir [template_dir]
```

## Output Structure

```
output_dir/
├── index.html    # Main HTML with navigation
├── styles.css    # Styling
├── app.js        # Render logic
├── steps.js      # Step data
└── images/       # (optional) media files
```

## Template Customization

Edit [assets/templates/](assets/templates/) to customize:
- `index.html` - Page structure
- `styles.css` - Visual styling
- `app.js` - Navigation/interaction logic

## Features

- Step navigation (Previous/Next buttons + dots)
- Keyboard shortcuts (← → Home End)
- Code blocks with tabs and copy button
- Responsive design (desktop/tablet/mobile)
- Optional: KaTeX for LaTeX math rendering
- Optional: Mermaid.js for diagrams
