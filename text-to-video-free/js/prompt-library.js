// Prompt library: search + category filter + copy
(function () {
  var list = document.getElementById('list');
  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var boxes = Array.prototype.slice.call(document.querySelectorAll('#catFilters input[type=checkbox]'));

  function activeCats() {
    return boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
  }

  function render() {
    var q = (search.value || '').toLowerCase().trim();
    var cats = activeCats();
    var shown = 0;
    list.innerHTML = '';
    PROMPTS.forEach(function (p, i) {
      if (cats.indexOf(p.cat) === -1) return;
      if (q && (p.title + ' ' + p.body + ' ' + p.cat).toLowerCase().indexOf(q) === -1) return;
      shown++;
      var card = document.createElement('div');
      card.className = 'prompt-card';
      card.innerHTML =
        '<div class="cat">' + escapeHtml(p.cat) + '</div>' +
        '<div class="title">' + escapeHtml(p.title) + '</div>' +
        '<div class="body">' + escapeHtml(p.body) + '</div>' +
        '<button class="copy-btn" data-idx="' + i + '">Copy prompt</button>';
      list.appendChild(card);
    });
    count.textContent = shown + ' of ' + PROMPTS.length + ' prompts shown';
    list.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyText(PROMPTS[parseInt(btn.getAttribute('data-idx'), 10)].body, btn);
      });
    });
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  search.addEventListener('input', render);
  boxes.forEach(function (b) { b.addEventListener('change', render); });
  render();
})();
