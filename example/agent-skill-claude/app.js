// Application State
let currentStepIndex = 0;
const totalSteps = steps.length;

// DOM Elements
const elements = {
  stepCounter: document.getElementById('stepCounter'),
  currentStepNum: document.getElementById('currentStepNum'),
  totalSteps: document.getElementById('totalSteps'),
  stepTitle: document.getElementById('stepTitle'),
  stepSubtitle: document.getElementById('stepSubtitle'),
  leftContent: document.getElementById('leftContent'),
  mediaContainer: document.getElementById('mediaContainer'),
  prevButton: document.getElementById('prevButton'),
  nextButton: document.getElementById('nextButton'),
  stepDots: document.getElementById('stepDots')
};

// Initialize App
function init() {
  // Set total steps
  elements.totalSteps.textContent = totalSteps;
  
  // Create step dots
  createStepDots();
  
  // Load saved step from localStorage
  const savedStep = localStorage.getItem('currentStep');
  if (savedStep !== null) {
    currentStepIndex = parseInt(savedStep, 10);
    if (currentStepIndex >= totalSteps) {
      currentStepIndex = 0;
    }
  }
  
  // Render initial step
  renderStep();
  
  // Add event listeners
  addEventListeners();
}

// Create Step Dots
function createStepDots() {
  elements.stepDots.innerHTML = '';
  
  steps.forEach((step, index) => {
    const dot = document.createElement('button');
    dot.className = 'step-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to step ${index + 1}`);
    dot.setAttribute('aria-selected', index === currentStepIndex);
    
    dot.addEventListener('click', () => {
      goToStep(index);
    });
    
    elements.stepDots.appendChild(dot);
  });
}

// Render Current Step
function renderStep() {
  const step = steps[currentStepIndex];
  
  // Update step counter
  elements.currentStepNum.textContent = currentStepIndex + 1;
  
  // Update header
  elements.stepTitle.textContent = step.title;
  elements.stepSubtitle.textContent = step.subtitle || '';
  
  // Render left panel content
  renderLeftPanel(step.left.blocks);
  
  // Render right panel media
  renderRightPanel(step.right);
  
  // Update navigation buttons
  updateNavigationButtons();
  
  // Update step dots
  updateStepDots();
  
  // Save to localStorage
  localStorage.setItem('currentStep', currentStepIndex);
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render Left Panel Content
function renderLeftPanel(blocks) {
  elements.leftContent.innerHTML = '';
  
  blocks.forEach(block => {
    const element = createContentBlock(block);
    if (element) {
      elements.leftContent.appendChild(element);
    }
  });
}

// Create Content Block Element
function createContentBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return createParagraph(block.text);
    
    case 'heading':
      return createHeading(block.level, block.text);
    
    case 'list':
      return createList(block.style, block.items);
    
    case 'callout':
      return createCallout(block.tone, block.text);
    
    case 'codeTabs':
      return createCodeTabs(block.tabs);
    
    default:
      return null;
  }
}

// Create Paragraph
function createParagraph(text) {
  const p = document.createElement('p');
  p.className = 'content-paragraph';
  p.textContent = text;
  return p;
}

// Create Heading
function createHeading(level, text) {
  const h = document.createElement(`h${level}`);
  h.className = `content-heading h${level}`;
  h.textContent = text;
  return h;
}

// Create List
function createList(style, items) {
  const listType = style === 'ordered' ? 'ol' : 'ul';
  const list = document.createElement(listType);
  list.className = `content-list ${style}`;
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
  
  return list;
}

// Create Callout
function createCallout(tone, text) {
  const callout = document.createElement('div');
  callout.className = `callout ${tone}`;
  callout.textContent = text;
  return callout;
}

// Create Code Tabs
function createCodeTabs(tabs) {
  const container = document.createElement('div');
  container.className = 'code-tabs';
  
  // Create tab buttons
  const tabButtons = document.createElement('div');
  tabButtons.className = 'tab-buttons';
  
  // Create tab contents
  const tabContents = document.createElement('div');
  tabContents.className = 'tab-contents';
  
  tabs.forEach((tab, index) => {
    // Create button
    const button = document.createElement('button');
    button.className = `tab-button ${index === 0 ? 'active' : ''}`;
    button.textContent = tab.label;
    button.setAttribute('data-tab-index', index);
    
    // Create content
    const content = document.createElement('div');
    content.className = `tab-content ${index === 0 ? 'active' : ''}`;
    content.setAttribute('data-tab-index', index);
    
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = tab.code;
    pre.appendChild(code);
    
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => copyCode(tab.code, copyButton));
    
    codeBlock.appendChild(pre);
    codeBlock.appendChild(copyButton);
    content.appendChild(codeBlock);
    
    tabButtons.appendChild(button);
    tabContents.appendChild(content);
  });
  
  // Add tab switching logic
  tabButtons.addEventListener('click', (e) => {
    if (e.target.classList.contains('tab-button')) {
      const tabIndex = e.target.getAttribute('data-tab-index');
      
      // Update buttons
      tabButtons.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');
      
      // Update contents
      tabContents.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      tabContents.querySelector(`[data-tab-index="${tabIndex}"]`).classList.add('active');
    }
  });
  
  container.appendChild(tabButtons);
  container.appendChild(tabContents);
  
  return container;
}

// Copy Code to Clipboard
function copyCode(code, button) {
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    button.classList.add('copied');
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

// Render Right Panel Media
function renderRightPanel(media) {
  elements.mediaContainer.innerHTML = '';
  
  let mediaElement;
  
  switch (media.type) {
    case 'image':
      mediaElement = document.createElement('img');
      mediaElement.className = 'media-image';
      mediaElement.src = media.src || '';
      mediaElement.alt = media.alt || 'Step illustration';
      
      // Fallback for missing images
      mediaElement.onerror = () => {
        const placeholder = createMediaPlaceholder('📸 Image Preview');
        elements.mediaContainer.innerHTML = '';
        elements.mediaContainer.appendChild(placeholder);
      };
      break;
    
    case 'video':
      mediaElement = document.createElement('video');
      mediaElement.className = 'media-video';
      mediaElement.src = media.src || '';
      mediaElement.controls = true;
      mediaElement.alt = media.alt || 'Step video';
      
      // Fallback for missing videos
      mediaElement.onerror = () => {
        const placeholder = createMediaPlaceholder('🎥 Video Preview');
        elements.mediaContainer.innerHTML = '';
        elements.mediaContainer.appendChild(placeholder);
      };
      break;
    
    case 'iframe':
      mediaElement = document.createElement('iframe');
      mediaElement.className = 'media-iframe';
      mediaElement.src = media.iframeUrl || '';
      mediaElement.title = media.alt || 'Embedded content';
      break;
    
    default:
      mediaElement = createMediaPlaceholder('📄 Media Content');
  }
  
  elements.mediaContainer.appendChild(mediaElement);
}

// Create Media Placeholder
function createMediaPlaceholder(text) {
  const placeholder = document.createElement('div');
  placeholder.className = 'media-placeholder';
  placeholder.textContent = text;
  return placeholder;
}

// Update Navigation Buttons
function updateNavigationButtons() {
  elements.prevButton.disabled = currentStepIndex === 0;
  elements.nextButton.disabled = currentStepIndex === totalSteps - 1;
}

// Update Step Dots
function updateStepDots() {
  const dots = elements.stepDots.querySelectorAll('.step-dot');
  dots.forEach((dot, index) => {
    if (index === currentStepIndex) {
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');
    } else {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
    }
  });
}

// Navigation Functions
function nextStep() {
  if (currentStepIndex < totalSteps - 1) {
    currentStepIndex++;
    renderStep();
  }
}

function prevStep() {
  if (currentStepIndex > 0) {
    currentStepIndex--;
    renderStep();
  }
}

function goToStep(index) {
  if (index >= 0 && index < totalSteps) {
    currentStepIndex = index;
    renderStep();
  }
}

// Add Event Listeners
function addEventListeners() {
  // Button clicks
  elements.nextButton.addEventListener('click', nextStep);
  elements.prevButton.addEventListener('click', prevStep);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        prevStep();
        break;
      case 'ArrowRight':
        nextStep();
        break;
      case 'Home':
        goToStep(0);
        break;
      case 'End':
        goToStep(totalSteps - 1);
        break;
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
