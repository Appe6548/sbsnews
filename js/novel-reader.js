(function () {
  'use strict';

  const CHAPTERS = [
    { file: '重生之高考逆袭 copy/第01章-噩梦醒来.md', code: '01', shortTitle: '噩梦醒来' },
    { file: '重生之高考逆袭 copy/第02章-前世记忆.md', code: '02', shortTitle: '前世记忆' },
    { file: '重生之高考逆袭 copy/第03章-暗中观察.md', code: '03', shortTitle: '暗中观察' },
    { file: '重生之高考逆袭 copy/第04章-学霸觉醒.md', code: '04', shortTitle: '学霸觉醒' },
    { file: '重生之高考逆袭 copy/第05章-第一步棋.md', code: '05', shortTitle: '第一步棋' },
    { file: '重生之高考逆袭 copy/第06章-装货姐的把柄.md', code: '06', shortTitle: '装货姐的把柄' },
    { file: '重生之高考逆袭 copy/第07章-考场惊雷.md', code: '07', shortTitle: '考场惊雷' },
    { file: '重生之高考逆袭 copy/第08章-结盟.md', code: '08', shortTitle: '结盟' },
    { file: '重生之高考逆袭 copy/第09章-装货姐出手.md', code: '09', shortTitle: '装货姐出手' },
    { file: '重生之高考逆袭 copy/第10章-将计就计.md', code: '10', shortTitle: '将计就计' },
    { file: '重生之高考逆袭 copy/第11章-陷阱成型.md', code: '11', shortTitle: '陷阱成型' },
    { file: '重生之高考逆袭 copy/第12章-自食其果.md', code: '12', shortTitle: '自食其果' },
    { file: '重生之高考逆袭 copy/第13章-暗线浮现.md', code: '13', shortTitle: '暗线浮现' },
    { file: '重生之高考逆袭 copy/第14章-卧底调查.md', code: '14', shortTitle: '卧底调查' },
    { file: '重生之高考逆袭 copy/第15章-月考震动.md', code: '15', shortTitle: '月考震动' },
    { file: '重生之高考逆袭 copy/第16章-昌老师的警觉.md', code: '16', shortTitle: '昌老师的警觉' },
    { file: '重生之高考逆袭 copy/第17章-暗箭难防.md', code: '17', shortTitle: '暗箭难防' },
    { file: '重生之高考逆袭 copy/第18章-针锋相对.md', code: '18', shortTitle: '针锋相对' },
    { file: '重生之高考逆袭 copy/第19章-铁证如山.md', code: '19', shortTitle: '铁证如山' },
    { file: '重生之高考逆袭 copy/第20章-昌老师的靠山.md', code: '20', shortTitle: '昌老师的靠山' },
    { file: '重生之高考逆袭 copy/第21章-深渊凝视.md', code: '21', shortTitle: '深渊凝视' },
    { file: '重生之高考逆袭 copy/第22章-水王的面具.md', code: '22', shortTitle: '水王的面具' },
    { file: '重生之高考逆袭 copy/第23章-拉锯战.md', code: '23', shortTitle: '拉锯战' },
    { file: '重生之高考逆袭 copy/第24章-盟友危机.md', code: '24', shortTitle: '盟友危机' },
    { file: '重生之高考逆袭 copy/第25章-绝地反击.md', code: '25', shortTitle: '绝地反击' },
    { file: '重生之高考逆袭 copy/第26章-声名远播.md', code: '26', shortTitle: '声名远播' },
    { file: '重生之高考逆袭 copy/第27章-水王的过去.md', code: '27', shortTitle: '水王的过去' },
    { file: '重生之高考逆袭 copy/第28章-暗棋浮出.md', code: '28', shortTitle: '暗棋浮出' },
    { file: '重生之高考逆袭 copy/第29章-风暴前夕.md', code: '29', shortTitle: '风暴前夕' },
    { file: '重生之高考逆袭 copy/第30章-图穷匕见.md', code: '30', shortTitle: '图穷匕见' },
    { file: '重生之高考逆袭 copy/第31章-至暗时刻.md', code: '31', shortTitle: '至暗时刻' },
    { file: '重生之高考逆袭 copy/第32章-决战前夜.md', code: '32', shortTitle: '决战前夜' },
    { file: '重生之高考逆袭 copy/第33章-语文战场.md', code: '33', shortTitle: '语文战场' },
    { file: '重生之高考逆袭 copy/第34章-数学风暴.md', code: '34', shortTitle: '数学风暴' },
    { file: '重生之高考逆袭 copy/第35章-理综之巅.md', code: '35', shortTitle: '理综之巅' },
    { file: '重生之高考逆袭 copy/第36章-英语收官.md', code: '36', shortTitle: '英语收官' },
    { file: '重生之高考逆袭 copy/第37章-审判日.md', code: '37', shortTitle: '审判日' },
    { file: '重生之高考逆袭 copy/第38章-大厦崩塌.md', code: '38', shortTitle: '大厦崩塌' },
    { file: '重生之高考逆袭 copy/第39章-墙倒众人推.md', code: '39', shortTitle: '墙倒众人推' },
    { file: '重生之高考逆袭 copy/第40章-等待.md', code: '40', shortTitle: '等待' },
    { file: '重生之高考逆袭 copy/第41章-一鸣惊人.md', code: '41', shortTitle: '一鸣惊人' },
    { file: '重生之高考逆袭 copy/第42章-众生相.md', code: '42', shortTitle: '众生相' },
    { file: '重生之高考逆袭 copy/第43章-选择.md', code: '43', shortTitle: '选择' },
    { file: '重生之高考逆袭 copy/第44章-新的起点.md', code: '44', shortTitle: '新的起点' }
  ];

  const chapterListEl = document.getElementById('chapter-list');
  const chapterTitleEl = document.getElementById('chapter-title');
  const chapterContentEl = document.getElementById('chapter-content');
  const chapterIndexEl = document.getElementById('chapter-index');
  const chapterFileEl = document.getElementById('chapter-file');
  const prevButton = document.getElementById('prev-chapter');
  const nextButton = document.getElementById('next-chapter');
  const layoutEl = document.getElementById('novel-layout');
  const tocPanelEl = document.getElementById('novel-toc-panel');
  const tocToggleButton = document.getElementById('toc-toggle');
  const tocLabelEl = tocToggleButton ? tocToggleButton.querySelector('.novel-toc-toggle-label') : null;
  const panelEl = document.querySelector('.novel-panel');

  if (!chapterListEl || !chapterTitleEl || !chapterContentEl || !chapterIndexEl || !chapterFileEl || !prevButton || !nextButton) {
    return;
  }

  const chapterButtons = [];
  let currentIndex = 0;

  function isCompactViewport() {
    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(max-width: 980px)').matches;
    }
    return window.innerWidth <= 980;
  }

  function setTocState(isOpen) {
    if (!layoutEl || !tocToggleButton) {
      return;
    }
    layoutEl.classList.toggle('is-toc-open', isOpen);
    tocToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    tocToggleButton.setAttribute('aria-label', isOpen ? '收起章节目录' : '展开章节目录');
    if (tocLabelEl) {
      tocLabelEl.textContent = isOpen ? '收起' : '目录';
    }
  }

  function isTocOpen() {
    return !!(layoutEl && layoutEl.classList.contains('is-toc-open'));
  }

  function scrollToReaderTop() {
    if (!panelEl) {
      return;
    }
    const top = panelEl.getBoundingClientRect().top + window.scrollY - 72;
    const targetTop = Math.max(top, 0);
    try {
      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    } catch (error) {
      window.scrollTo(0, targetTop);
    }
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
        const normalizedHeading = normalizeHeading(headingText);
        const className = normalizedHeading === '下章预告' ? ' class="novel-preview-heading"' : '';
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

  function extractNextChapterPreview(markdown) {
    const directHeadingMatch = markdown.match(/(?:^|\n)#{2,6}\s*下章预告(?:\s|：|:|$)[^\n]*\n+([\s\S]*?)(?=\n#{1,6}\s+|$)/);
    if (directHeadingMatch && directHeadingMatch[1]) {
      const directText = directHeadingMatch[1].trim();
      if (directText) {
        return directText;
      }
    }

    const bulletMatch = markdown.match(/^\s*-\s*(?:\*\*)?下章预告(?:\*\*)?[：:]\s*(.+)$/m);
    if (bulletMatch && bulletMatch[1]) {
      return bulletMatch[1].trim();
    }

    return '';
  }

  function removeSectionByHeading(markdown, headingName) {
    const escapedName = headingName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp('(?:^|\\n)#{2,6}\\s*' + escapedName + '\\s*[：: ]*\\n[\\s\\S]*?(?=\\n#{1,6}\\s+|$)', 'g');
    return markdown.replace(regex, '\n');
  }

  function filterChapterSections(markdown) {
    const normalized = markdown.replace(/\r\n/g, '\n');
    const nextChapterPreview = extractNextChapterPreview(normalized);

    let cleaned = normalized;
    cleaned = removeSectionByHeading(cleaned, '本章概要');
    cleaned = removeSectionByHeading(cleaned, '章节备注');
    cleaned = removeSectionByHeading(cleaned, '章节注释');
    cleaned = removeSectionByHeading(cleaned, '章节说明');

    cleaned = cleaned.replace(/^\s*---\s*\n+/, '');
    cleaned = cleaned.replace(/\n+\s*---\s*$/, '');
    cleaned = cleaned.replace(/\n{2,}\s*---\s*\n{2,}/g, '\n\n');
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

    if (nextChapterPreview && !/(^|\n)#{2,6}\s*下章预告(?:\s|：|:|$)/.test(cleaned)) {
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
        setTocState(false);
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
    tocToggleButton.setAttribute('aria-expanded', 'false');
    tocToggleButton.addEventListener('click', function () {
      setTocState(!isTocOpen());
    });
  }

  document.addEventListener('click', function (event) {
    if (!isTocOpen() || !tocPanelEl) {
      return;
    }
    if (tocPanelEl.contains(event.target)) {
      return;
    }
    setTocState(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isTocOpen()) {
      setTocState(false);
    }
  });

  setTocState(false);

  renderChapterList();
  loadChapter(chapterFromHash(), true);
})();
