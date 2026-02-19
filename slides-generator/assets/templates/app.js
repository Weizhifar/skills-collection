// Slide Generator - App Logic
// This file handles rendering and navigation

(function() {
  'use strict';

  // State
  let currentStepIndex = 0;

  // DOM Elements
  const elements = {
    stepTitle: document.getElementById('stepTitle'),
    stepSubtitle: document.getElementById('stepSubtitle'),
    leftContent: document.getElementById('leftContent'),
    mediaContainer: document.getElementById('mediaContainer'),
    currentStepNum: document.getElementById('currentStepNum'),
    totalSteps: document.getElementById('totalSteps'),
    prevButton: document.getElementById('prevButton'),
    nextButton: document.getElementById('nextButton'),
    stepDots: document.getElementById('stepDots')
  };

  // Initialize
  function init() {
    if (typeof steps === 'undefined' || !steps.length) {
      console.error('No steps data found');
      return;
    }

    elements.totalSteps.textContent = steps.length;
    renderStepDots();
    goToStep(0);
    bindEvents();
  }

  // Render step dots
  function renderStepDots() {
    elements.stepDots.innerHTML = steps.map((_, index) =>
      `<button class="step-dot" data-index="${index}" aria-label="Go to step ${index + 1}"></button>`
    ).join('');
  }

  // Go to specific step
  function goToStep(index) {
    if (index < 0 || index >= steps.length) return;

    currentStepIndex = index;
    const step = steps[index];

    // Update title and subtitle
    elements.stepTitle.textContent = step.title || 'Untitled';
    elements.stepSubtitle.textContent = step.subtitle || '';
    elements.currentStepNum.textContent = index + 1;

    // Render left panel content
    renderLeftContent(step.left);

    // Render right panel media
    renderRightContent(step.right);

    // Update navigation state
    elements.prevButton.disabled = index === 0;
    elements.nextButton.disabled = index === steps.length - 1;

    // Update dots
    document.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  // Render left panel content
  function renderLeftContent(left) {
    if (!left || !left.blocks) {
      elements.leftContent.innerHTML = '';
      return;
    }

    elements.leftContent.innerHTML = left.blocks.map(block => renderBlock(block)).join('');
  }

  // Render content block
  function renderBlock(block) {
    switch (block.type) {
      case 'paragraph':
        return `<p class="content-paragraph">${escapeHtml(block.text)}</p>`;

      case 'heading':
        return `<h${block.level} class="content-heading h${block.level}">${escapeHtml(block.text)}</h${block.level}>`;

      case 'list':
        const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
        return `<${ListTag} class="content-list ${block.style}">
          ${block.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </${ListTag}>`;

      case 'callout':
        return `<div class="callout ${block.tone}">${escapeHtml(block.text)}</div>`;

      case 'link':
        return `<a href="${escapeHtml(block.href)}" class="content-link" target="_blank" rel="noopener">${escapeHtml(block.text)}</a>`;

      case 'codeTabs':
        return renderCodeTabs(block.tabs);

      default:
        return '';
    }
  }

  // Render code tabs
  function renderCodeTabs(tabs) {
    if (!tabs || !tabs.length) return '';

    const tabButtons = tabs.map((tab, i) =>
      `<button class="tab-button ${i === 0 ? 'active' : ''}" data-tab="${i}">${escapeHtml(tab.label)}</button>`
    ).join('');

    const tabContents = tabs.map((tab, i) =>
      `<div class="tab-content ${i === 0 ? 'active' : ''}" data-tab="${i}">
        <div class="code-block">
          <pre><code class="language-${tab.lang || 'text'}">${escapeHtml(tab.code)}</code></pre>
          <button class="copy-button" data-code="${escapeHtml(tab.code)}">Copy</button>
        </div>
      </div>`
    ).join('');

    return `<div class="code-tabs">
      <div class="tab-buttons">${tabButtons}</div>
      <div class="tab-contents">${tabContents}</div>
    </div>`;
  }

  // Render right panel media
  function renderRightContent(right) {
    if (!right) {
      elements.mediaContainer.innerHTML = '<div class="media-placeholder">No content</div>';
      return;
    }

    switch (right.type) {
      case 'image':
        elements.mediaContainer.innerHTML = `<img class="media-image" src="${escapeHtml(right.src)}" alt="${escapeHtml(right.alt || '')}" />`;
        break;

      case 'video':
        elements.mediaContainer.innerHTML = `<video class="media-video" controls>
          <source src="${escapeHtml(right.src)}" type="video/mp4">
          Your browser does not support video playback.
        </video>`;
        break;

      case 'iframe':
        elements.mediaContainer.innerHTML = `<iframe class="media-iframe" src="${escapeHtml(right.iframeUrl)}" title="${escapeHtml(right.alt || 'Embedded content')}"></iframe>`;
        break;

      default:
        elements.mediaContainer.innerHTML = '<div class="media-placeholder">No media</div>';
    }
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Bind events
  function bindEvents() {
    // Previous button
    elements.prevButton.addEventListener('click', () => goToStep(currentStepIndex - 1));

    // Next button
    elements.nextButton.addEventListener('click', () => goToStep(currentStepIndex + 1));

    // Dot navigation
    elements.stepDots.addEventListener('click', (e) => {
      if (e.target.classList.contains('step-dot')) {
        const index = parseInt(e.target.dataset.index, 10);
        goToStep(index);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToStep(currentStepIndex - 1);
      if (e.key === 'ArrowRight') goToStep(currentStepIndex + 1);
      if (e.key === 'Home') goToStep(0);
      if (e.key === 'End') goToStep(steps.length - 1);
    });

    // Code tab switching
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-button')) {
        const tabsContainer = e.target.closest('.code-tabs');
        const tabIndex = e.target.dataset.tab;

        tabsContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        tabsContainer.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        e.target.classList.add('active');
        tabsContainer.querySelector(`.tab-content[data-tab="${tabIndex}"]`).classList.add('active');
      }

      // Copy button
      if (e.target.classList.contains('copy-button')) {
        const code = e.target.dataset.code;
        navigator.clipboard.writeText(code).then(() => {
          e.target.textContent = 'Copied!';
          e.target.classList.add('copied');
          setTimeout(() => {
            e.target.textContent = 'Copy';
            e.target.classList.remove('copied');
          }, 2000);
        });
      }
    });
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
