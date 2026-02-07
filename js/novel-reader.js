(function () {
  'use strict';

  const CHAPTERS = [
    { file: '重生之高考逆袭/第01章-噩梦醒来.md', code: '01', shortTitle: '噩梦醒来' },
    { file: '重生之高考逆袭/第02章-前世记忆.md', code: '02', shortTitle: '前世记忆' },
    { file: '重生之高考逆袭/第03章-暗中观察.md', code: '03', shortTitle: '暗中观察' },
    { file: '重生之高考逆袭/第04章-学霸觉醒.md', code: '04', shortTitle: '学霸觉醒' },
    { file: '重生之高考逆袭/第05章-第一步棋.md', code: '05', shortTitle: '第一步棋' },
    { file: '重生之高考逆袭/第06章-装货姐的把柄.md', code: '06', shortTitle: '装货姐的把柄' },
    { file: '重生之高考逆袭/第07章-考场惊雷.md', code: '07', shortTitle: '考场惊雷' },
    { file: '重生之高考逆袭/第08章-结盟.md', code: '08', shortTitle: '结盟' },
    { file: '重生之高考逆袭/第09章-装货姐出手.md', code: '09', shortTitle: '装货姐出手' },
    { file: '重生之高考逆袭/第10章-将计就计.md', code: '10', shortTitle: '将计就计' },
    { file: '重生之高考逆袭/第11章-陷阱成型.md', code: '11', shortTitle: '陷阱成型' },
    { file: '重生之高考逆袭/第12章-自食其果.md', code: '12', shortTitle: '自食其果' },
    { file: '重生之高考逆袭/第13章-暗线浮现.md', code: '13', shortTitle: '暗线浮现' },
    { file: '重生之高考逆袭/第14章-卧底调查.md', code: '14', shortTitle: '卧底调查' }
  ];

  const chapterListEl = document.getElementById('chapter-list');
  const chapterTitleEl = document.getElementById('chapter-title');
  const chapterContentEl = document.getElementById('chapter-content');
  const chapterIndexEl = document.getElementById('chapter-index');
  const chapterFileEl = document.getElementById('chapter-file');
  const prevButton = document.getElementById('prev-chapter');
  const nextButton = document.getElementById('next-chapter');
  const sidebarEl = document.querySelector('.novel-sidebar');
  const tocToggleButton = document.getElementById('toc-toggle');
  const panelEl = document.querySelector('.novel-panel');

  if (!chapterListEl || !chapterTitleEl || !chapterContentEl || !chapterIndexEl || !chapterFileEl || !prevButton || !nextButton) {
    return;
  }

  const chapterButtons = [];
  let currentIndex = 0;

  function isCompactViewport() {
    return window.matchMedia('(max-width: 980px)').matches;
  }

  function setTocState(isOpen) {
    if (!sidebarEl || !tocToggleButton) {
      return;
    }
    sidebarEl.classList.toggle('is-open', isOpen);
    tocToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    tocToggleButton.textContent = isOpen ? '收起目录' : '展开目录';
  }

  function syncTocByViewport() {
    if (!sidebarEl || !tocToggleButton) {
      return;
    }
    if (isCompactViewport()) {
      if (!sidebarEl.classList.contains('is-open')) {
        setTocState(false);
      }
      return;
    }
    sidebarEl.classList.remove('is-open');
    tocToggleButton.setAttribute('aria-expanded', 'false');
    tocToggleButton.textContent = '展开目录';
  }

  function scrollToReaderTop() {
    if (!panelEl) {
      return;
    }
    const top = panelEl.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth'
    });
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderInline(value) {
    const escaped = escapeHtml(value);
    return escaped
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  function markdownToHtml(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const html = [];
    let paragraph = [];
    let listItems = [];

    function flushParagraph() {
      if (!paragraph.length) {
        return;
      }
      html.push('<p>' + paragraph.map(renderInline).join('<br>') + '</p>');
      paragraph = [];
    }

    function flushList() {
      if (!listItems.length) {
        return;
      }
      html.push('<ul>' + listItems.map(function (item) {
        return '<li>' + renderInline(item) + '</li>';
      }).join('') + '</ul>');
      listItems = [];
    }

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line) {
        flushParagraph();
        flushList();
        continue;
      }

      if (line === '---') {
        flushParagraph();
        flushList();
        html.push('<hr>');
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.*)$/);
      if (heading) {
        flushParagraph();
        flushList();
        const level = heading[1].length;
        const headingText = heading[2].trim();
        const className = /^下章预告(?:\s|$)/.test(headingText) ? ' class="novel-preview-heading"' : '';
        html.push('<h' + level + className + '>' + renderInline(headingText) + '</h' + level + '>');
        continue;
      }

      if (line.startsWith('- ')) {
        flushParagraph();
        listItems.push(line.slice(2));
        continue;
      }

      flushList();
      paragraph.push(line);
    }

    flushParagraph();
    flushList();

    return html.join('');
  }

  function normalizeHeading(text) {
    return text.trim().replace(/[：:]\s*$/, '');
  }

  function filterChapterSections(markdown) {
    const lines = markdown.replace(/\r\n/g, '\n').split('\n');
    const output = [];
    let skipping = false;
    let skipLevel = 0;
    let skipSectionName = '';
    let nextChapterPreview = '';

    for (const rawLine of lines) {
      const trimmed = rawLine.trim();
      const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);

      if (heading) {
        const level = heading[1].length;
        const headingText = normalizeHeading(heading[2]);

        if (skipping && level <= skipLevel) {
          skipping = false;
          skipLevel = 0;
          skipSectionName = '';
        }

        if (!skipping && (headingText === '本章概要' || headingText === '章节备注')) {
          skipping = true;
          skipLevel = level;
          skipSectionName = headingText;
          continue;
        }
      }

      if (skipping) {
        if (!nextChapterPreview && skipSectionName === '章节备注') {
          const previewMatch = trimmed.match(/^-\s*(?:\*\*)?下章预告(?:\*\*)?[：:]\s*(.+)$/);
          if (previewMatch && previewMatch[1]) {
            nextChapterPreview = previewMatch[1].trim();
          }
        }
        continue;
      }

      output.push(rawLine);
    }

    let cleaned = output.join('\n');
    cleaned = cleaned.replace(/^\s*---\s*\n+/, '');
    cleaned = cleaned.replace(/\n+\s*---\s*$/, '');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    if (nextChapterPreview && !/(^|\n)##\s*下章预告(?:\s|$)/.test(cleaned)) {
      cleaned += '\n\n## 下章预告\n\n' + nextChapterPreview;
    }

    return cleaned;
  }

  function chapterUrl(path) {
    return '/' + path.split('/').map(encodeURIComponent).join('/');
  }

  function chapterFromHash() {
    if (!window.location.hash.startsWith('#chapter-')) {
      return 0;
    }

    const code = window.location.hash.replace('#chapter-', '').trim();
    const index = CHAPTERS.findIndex(function (chapter) {
      return chapter.code === code;
    });

    return index >= 0 ? index : 0;
  }

  function setButtonState() {
    chapterButtons.forEach(function (button, index) {
      button.classList.toggle('is-active', index === currentIndex);
      button.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
    });

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === CHAPTERS.length - 1;
  }

  function updateHash() {
    const hash = '#chapter-' + CHAPTERS[currentIndex].code;
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash);
    }
  }

  async function loadChapter(targetIndex, fromHashChange) {
    if (targetIndex < 0 || targetIndex >= CHAPTERS.length) {
      return;
    }

    currentIndex = targetIndex;
    setButtonState();
    if (!fromHashChange) {
      updateHash();
      if (isCompactViewport()) {
        scrollToReaderTop();
      }
    }

    const chapter = CHAPTERS[currentIndex];
    chapterIndexEl.textContent = '第 ' + chapter.code + ' 章 / 共 ' + CHAPTERS.length + ' 章';
    chapterFileEl.textContent = chapter.shortTitle;
    chapterTitleEl.textContent = '正在加载...';
    chapterContentEl.innerHTML = '<p>正在加载章节内容，请稍候...</p>';

    try {
      const response = await fetch(chapterUrl(chapter.file));
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }

      const text = await response.text();
      const titleMatch = text.match(/^#\s+(.+)$/m);
      const chapterTitle = titleMatch ? titleMatch[1].trim() : ('第' + chapter.code + '章：' + chapter.shortTitle);
      const body = filterChapterSections(text.replace(/^#\s+.+(?:\n|$)/, '').trim());

      chapterTitleEl.textContent = chapterTitle;
      chapterContentEl.innerHTML = markdownToHtml(body);
    } catch (error) {
      chapterTitleEl.textContent = '章节加载失败';
      chapterContentEl.innerHTML = '<p class="novel-empty">无法读取章节文件，请检查部署是否包含 Markdown 源文件。</p>';
    }
  }

  function renderChapterList() {
    const fragment = document.createDocumentFragment();

    CHAPTERS.forEach(function (chapter, index) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chapter-button';
      button.setAttribute('role', 'tab');

      const shortTitle = chapter.shortTitle;
      button.innerHTML = '<span class="chapter-button-index">第' + chapter.code + '章</span><span>' + escapeHtml(shortTitle) + '</span>';

      button.addEventListener('click', function () {
        loadChapter(index, false);
        if (isCompactViewport()) {
          setTocState(false);
        }
      });

      chapterButtons.push(button);
      fragment.appendChild(button);
    });

    chapterListEl.appendChild(fragment);
  }

  prevButton.addEventListener('click', function () {
    loadChapter(currentIndex - 1, false);
  });

  nextButton.addEventListener('click', function () {
    loadChapter(currentIndex + 1, false);
  });

  window.addEventListener('hashchange', function () {
    const targetIndex = chapterFromHash();
    if (targetIndex !== currentIndex) {
      loadChapter(targetIndex, true);
    }
  });

  if (tocToggleButton) {
    tocToggleButton.setAttribute('aria-controls', 'chapter-list');
    tocToggleButton.addEventListener('click', function () {
      if (!sidebarEl) {
        return;
      }
      setTocState(!sidebarEl.classList.contains('is-open'));
    });
  }

  syncTocByViewport();
  window.addEventListener('resize', syncTocByViewport, { passive: true });

  renderChapterList();
  loadChapter(chapterFromHash(), true);
})();
