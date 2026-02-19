# Presentation-Style Guide App

A beautiful, interactive step-by-step guide built with vanilla HTML, CSS, and JavaScript.

## 📁 Project Structure

```
far-claude/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS with glassmorphism
├── app.js             # Application logic
├── steps.js           # Step data (customize here!)
├── images/            # Step images
├── screenshots/       # Testing screenshots
├── WALKTHROUGH.md     # Full documentation
├── Claude.md          # Original design spec
└── README.md          # This file
```

## 🚀 Quick Start

1. **Run locally:**

   ```bash
   python3 -m http.server 8000
   ```

   Then open http://localhost:8000

2. **Customize content:**
   - Edit `steps.js` to change step content
   - Replace images in `images/` directory
   - Modify colors in `styles.css` (`:root` variables)

## ✨ Features

- ✅ Step-based navigation (buttons, dots, keyboard)
- ✅ Two-panel layout (instructions + media)
- ✅ Rich content (code tabs, callouts, lists)
- ✅ Glassmorphism design with lavender theme
- ✅ Fully responsive (desktop, tablet, mobile)
- ✅ State persistence via localStorage
- ✅ Keyboard shortcuts (←/→, Home/End)

## 🎨 Customization

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
  --accent-primary: #8b5cf6; /* Purple */
  --accent-secondary: #ec4899; /* Pink */
  --bg-primary: #f0ebf8; /* Lavender */
}
```

### Add/Edit Steps

Edit the `steps` array in `steps.js`:

```javascript
{
  id: "my-step",
  order: 1,
  title: "My Step Title",
  subtitle: "Subtitle here",
  left: {
    blocks: [
      { type: "paragraph", text: "Your content..." }
    ]
  },
  right: {
    type: "image",
    src: "images/my-image.png"
  }
}
```

## 📦 Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo to Vercel's web interface.

## 📖 Documentation

See [WALKTHROUGH.md](WALKTHROUGH.md) for:

- Complete feature documentation
- Testing results with screenshots
- Detailed implementation notes

## 🎯 Tech Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with custom properties
- **Vanilla JavaScript** - No frameworks needed
- **Google Fonts** - Inter & JetBrains Mono

## 📝 License

Free to use and modify for your projects!
