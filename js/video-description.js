// 视频页简介展开/收起：按实际渲染高度判断是否溢出，
// 只有内容确实超过收起行数（--desc-clamp-lines，默认 2 行）时才显示按钮。
// 渐进增强：禁用 JS 或未溢出时全文直接展示，无按钮、无裁剪。
(function () {
  'use strict';

  var updates = [];

  function clampHeight(content) {
    var style = getComputedStyle(content);
    var lines = parseFloat(style.getPropertyValue('--desc-clamp-lines'));
    if (!isFinite(lines) || lines < 1) lines = 2;
    // lineHeight 为 "normal" 时 parseFloat 得到 NaN，回退为 1.6 倍字号
    var lineHeight = parseFloat(style.lineHeight);
    if (!isFinite(lineHeight) || lineHeight <= 0) {
      lineHeight = (parseFloat(style.fontSize) || 16) * 1.6;
    }
    return lines * lineHeight;
  }

  function setup(description) {
    var content = description.querySelector('.description-content');
    var toggle = description.querySelector('.description-toggle');
    if (!content || !toggle) return;

    var expanded = false;

    if (!content.id) content.id = 'video-description-content';
    toggle.setAttribute('aria-controls', content.id);

    function update() {
      // overflow:hidden 下 scrollHeight 始终是完整内容高度，与当前展开与否无关，
      // 因此展开状态下窗口变化也能正确重判是否仍需按钮
      var overflowing = content.scrollHeight > clampHeight(content) + 1;
      if (!overflowing) {
        expanded = false;
        content.classList.remove('collapsed');
        toggle.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        content.classList.toggle('collapsed', !expanded);
        toggle.classList.add('visible');
        toggle.textContent = expanded ? '收起' : '展开';
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    }

    toggle.addEventListener('click', function () {
      expanded = !expanded;
      update();
    });

    updates.push(update);
    update();
  }

  function updateAll() {
    for (var i = 0; i < updates.length; i++) updates[i]();
  }

  // resize 用 rAF 节流，避免连续强制重排
  var rafPending = false;
  window.addEventListener('resize', function () {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      updateAll();
    });
  });

  // 字体加载完成后行高可能变化，重新测量
  window.addEventListener('load', updateAll);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateAll);
  }

  document.querySelectorAll('.video-description').forEach(setup);
})();
