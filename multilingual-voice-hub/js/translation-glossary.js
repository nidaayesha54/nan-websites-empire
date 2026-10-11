// Translation Glossary Builder — localStorage CRUD + copy + CSV download
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const termEl = $('gl-term');
  if (!termEl) return;
  const KEY = 'mv-glossary-v1';
  let rows = [];

  try { rows = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { rows = []; }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) { /* private mode */ }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function render() {
    const wrap = $('gl-table-wrap');
    $('gl-count').textContent = rows.length;
    if (!rows.length) {
      wrap.innerHTML = '<p style="color:var(--muted);margin-top:14px">No terms yet \u2014 add your first one above. Example: <b>call to action</b> \u2192 Spanish \u2192 <b>llamada a la acci\u00f3n</b>.</p>';
      return;
    }
    let html = '<table class="gloss-table"><tr><th>#</th><th>Term</th><th>Language</th><th>Translation</th><th>Note</th><th></th></tr>';
    rows.forEach((r, i) => {
      html += '<tr><td>' + (i + 1) + '</td><td><b>' + esc(r.term) + '</b></td><td>' + esc(r.lang) +
        '</td><td>' + esc(r.trans) + '</td><td style="color:var(--muted)">' + esc(r.note || '') +
        '</td><td><button class="btn-sm ghost" data-del="' + i + '">\u2715</button></td></tr>';
    });
    wrap.innerHTML = html + '</table>';
    wrap.querySelectorAll('[data-del]').forEach(btn => {
      btn.addEventListener('click', () => {
        rows.splice(Number(btn.getAttribute('data-del')), 1);
        save(); render();
      });
    });
  }

  function addRow() {
    const term = termEl.value.trim(), lang = $('gl-lang').value,
          trans = $('gl-trans').value.trim(), note = $('gl-note').value.trim();
    if (!term || !lang || !trans) {
      alert('Please fill in Term, Language, and Translation before adding.');
      return;
    }
    rows.push({ term, lang, trans, note });
    termEl.value = ''; $('gl-lang').value = ''; $('gl-trans').value = ''; $('gl-note').value = '';
    termEl.focus();
    save(); render();
  }

  $('gl-add').addEventListener('click', addRow);
  [termEl, $('gl-trans')].forEach(el => el.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addRow(); }
  }));

  function toCSV() {
    const q = s => '"' + String(s).replace(/"/g, '""') + '"';
    return 'Term,Language,Translation,Note\r\n' +
      rows.map(r => [q(r.term), q(r.lang), q(r.trans), q(r.note || '')].join(',')).join('\r\n');
  }

  $('gl-copy').addEventListener('click', () => {
    if (!rows.length) { alert('Nothing to copy \u2014 add some terms first.'); return; }
    const tsv = 'Term\tLanguage\tTranslation\tNote\n' +
      rows.map(r => [r.term, r.lang, r.trans, r.note || ''].join('\t')).join('\n');
    (navigator.clipboard ? navigator.clipboard.writeText(tsv) : Promise.reject())
      .then(() => alert('Glossary copied \u2014 paste it into your doc or email.'))
      .catch(() => {
        const ta = document.createElement('textarea');
        ta.value = tsv; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta);
        alert('Glossary copied \u2014 paste it into your doc or email.');
      });
  });

  $('gl-csv').addEventListener('click', () => {
    if (!rows.length) { alert('Nothing to export \u2014 add some terms first.'); return; }
    const blob = new Blob(["\uFEFF" + toCSV()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'multilingual-glossary.csv';
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  });

  $('gl-clear').addEventListener('click', () => {
    if (!rows.length) return;
    if (confirm('Delete all ' + rows.length + ' terms? This cannot be undone.')) {
      rows = []; save(); render();
    }
  });

  render();
})();
