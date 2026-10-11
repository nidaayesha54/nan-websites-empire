// Lyric Writer — rhyme finder, syllable counter, verse organizer
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- built-in rhyme dictionary (word families by ending sound) ---------- */
  var RHYMES = {
    'ay':   ['day','say','play','away','stay','way','today','may','delay','sway','relay','highway','birthday','display'],
    'ee':   ['be','see','free','tree','me','we','deep','sleep','keep','dream','seem','gleam','believe','need'],
    'ow':   ['go','so','no','know','flow','glow','show','slow','home','alone','stone','roam','road','gold'],
    'ight': ['night','light','bright','right','fight','flight','high','sky','try','cry','fly','lie','my','die','why','sigh'],
    'art':  ['heart','start','apart','smart','art','part','dark','mark','spark','hard','car','far','star'],
    'ove':  ['love','above','dove','enough','rough','tough','glove','shove'],
    'ain':  ['rain','pain','again','train','brain','chain','gain','remain','explain','insane'],
    'ell':  ['well','tell','fell','sell','bell','yell','farewell','dwell','spell','hello'],
    'ore':  ['more','door','floor','before','shore','store','core','roar','pour','your'],
    'ing':  ['sing','ring','bring','king','wing','thing','spring','everything','swing','morning'],
    'oo':   ['you','too','through','new','true','blue','do','who','knew','lose','choose','moon','soon','tune'],
    'ation':['nation','station','creation','sensation','emotion','devotion','ocean','motion','patience','foundation'],
    'ear':  ['hear','near','dear','fear','clear','year','appear','disappear','steer','tears'],
    'ime':  ['time','rhyme','climb','shine','mine','line','fine','divine','behind','find'],
    'and':  ['hand','stand','land','understand','band','grand','demand','expand','planned'],
    'ever': ['forever','together','never','whatever','clever','weather','better','letter','surrender'],
    'own':  ['down','town','now','how','wow','brown','around','sound','ground','crown'],
    'ace':  ['place','face','chase','embrace','space','grace','trace','replace'],
    'ade':  ['made','fade','shade','afraid','parade','played','stayed','blade'],
    'ong':  ['song','long','strong','wrong','belong','gone','dawn'],
    'ire':  ['fire','desire','higher','wire','inspire','tired','require'],
    'ush':  ['rush','crush','hush','blush','brush','push'],
    'end':  ['friend','end','bend','send','trend','lend','defend','weekend','pretend'],
    'all':  ['all','call','fall','small','tall','ball','wall','hall','recall','crawl']
  };
  var KEYS = Object.keys(RHYMES).sort(function (a, b) { return b.length - a.length; });

  function clean(w) { return String(w).toLowerCase().replace(/[^a-z']/g, '').replace(/'s$/, ''); }

  function findRhymes(raw) {
    var word = clean(raw);
    if (!word) return { match: null, words: [] };
    var tries = [word];
    if (word.slice(-1) === 's') tries.push(word.slice(0, -1));
    for (var t = 0; t < tries.length; t++) {
      var w = tries[t];
      for (var k = 0; k < KEYS.length; k++) {
        if (w.length >= KEYS[k].length + 1 && w.slice(-KEYS[k].length) === KEYS[k]) {
          return { match: KEYS[k], words: RHYMES[KEYS[k]].filter(function (x) { return x !== w; }) };
        }
      }
    }
    // fallback: any words sharing the last 2 letters
    var tail = word.slice(-2), out = [];
    Object.keys(RHYMES).forEach(function (key) {
      RHYMES[key].forEach(function (x) {
        if (x !== word && x.slice(-2) === tail && out.indexOf(x) === -1) out.push(x);
      });
    });
    return { match: null, words: out.slice(0, 24) };
  }

  var rhymeIn = document.getElementById('rhymeInput');
  var rhymeOut = document.getElementById('rhymeOut');
  function runRhyme() {
    var r = findRhymes(rhymeIn.value);
    if (!rhymeIn.value.trim()) { rhymeOut.innerHTML = '<span class="hint">Type a word above to find rhymes.</span>'; return; }
    if (!r.words.length) { rhymeOut.innerHTML = '<span class="hint">No rhymes found — try a simpler word.</span>'; return; }
    var note = r.match ? 'Rhymes for <b>' + escapeHtml(clean(rhymeIn.value)) + '</b>:' : 'Near rhymes for <b>' + escapeHtml(clean(rhymeIn.value)) + '</b>:';
    rhymeOut.innerHTML = note + '<br>' + r.words.map(function (w) {
      return '<button class="chip" data-w="' + w + '">' + w + '</button>';
    }).join('');
    rhymeOut.querySelectorAll('[data-w]').forEach(function (b) {
      b.addEventListener('click', function () { rhymeIn.value = b.getAttribute('data-w'); runRhyme(); });
    });
  }
  rhymeIn.addEventListener('input', runRhyme);

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }

  /* ---------- syllable counter ---------- */
  var SYL_EXCEPTIONS = { rhythm: 2, every: 2, evening: 2, business: 2, family: 3 };
  function countSyllables(word) {
    word = String(word).toLowerCase().replace(/[^a-z]/g, '');
    if (SYL_EXCEPTIONS[word]) return SYL_EXCEPTIONS[word];
    if (!word) return 0;
    if (word.length <= 3) return 1;
    var vowels = 'aeiouy', count = 0, prev = false, i, v;
    for (i = 0; i < word.length; i++) {
      v = vowels.indexOf(word[i]) !== -1;
      if (v && !prev) count++;
      prev = v;
    }
    if (word.slice(-1) === 'e') count--;
    if (word.slice(-2) === 'le' && word.length > 2 && vowels.indexOf(word[word.length - 3]) === -1) count++;
    return Math.max(count, 1);
  }
  function lineSyllables(line) {
    return line.split(/\s+/).filter(Boolean).reduce(function (a, w) { return a + countSyllables(w); }, 0);
  }

  var lyricIn = document.getElementById('lyricInput');
  var syllOut = document.getElementById('syllOut');
  function runSyll() {
    var lines = lyricIn.value.split('\n');
    var total = 0, html = '';
    lines.forEach(function (ln, i) {
      if (!ln.trim()) return;
      var n = lineSyllables(ln);
      total += n;
      html += '<div class="kv"><span>Line ' + (i + 1) + ': ' + escapeHtml(ln.slice(0, 60)) + (ln.length > 60 ? '…' : '') + '</span><span class="syll">' + n + ' syll</span></div>';
    });
    syllOut.innerHTML = html
      ? html + '<div class="kv"><b>Total</b><b>' + total + ' syllables · ' + lines.filter(function (l) { return l.trim(); }).length + ' lines</b></div>'
      : '<span class="hint">Type or paste lyrics to count syllables per line.</span>';
  }
  lyricIn.addEventListener('input', runSyll);

  /* ---------- verse organizer ---------- */
  var orgWrap = document.getElementById('orgWrap');
  var sheetOut = document.getElementById('sheetOut');

  function addSection(name, text) {
    var div = document.createElement('div');
    div.className = 'panel';
    div.innerHTML =
      '<div class="row2"><div><label class="lbl">Section name</label><input type="text" class="secname" value="' + escapeHtml(name || 'Verse 1') + '"></div>' +
      '<div style="display:flex;align-items:flex-end;justify-content:flex-end"><button class="btn ghost small rmsec">Remove</button></div></div>' +
      '<label class="lbl">Lyrics</label><textarea class="sectext" placeholder="Write this section\u2019s lines here…">' + escapeHtml(text || '') + '</textarea>' +
      '<div class="secline"></div>';
    orgWrap.appendChild(div);
    var ta = div.querySelector('.sectext');
    var nm = div.querySelector('.secname');
    var lc = div.querySelector('.secline');
    function upd() {
      var lines = ta.value.split('\n').filter(function (l) { return l.trim(); });
      lc.innerHTML = lines.length
        ? '<span class="hint">' + lines.length + ' lines · ' + lines.map(lineSyllables).join(' / ') + ' syllables per line</span>'
        : '';
      buildSheet();
    }
    ta.addEventListener('input', upd);
    nm.addEventListener('input', buildSheet);
    div.querySelector('.rmsec').addEventListener('click', function () { div.remove(); buildSheet(); });
    upd();
  }

  function buildSheet() {
    var parts = [];
    orgWrap.querySelectorAll('.panel').forEach(function (div) {
      var nm = div.querySelector('.secname').value.trim() || 'Section';
      var tx = div.querySelector('.sectext').value.trim();
      if (tx) parts.push('[' + nm.toUpperCase() + ']\n' + tx);
    });
    sheetOut.textContent = parts.join('\n\n') || 'Your lyric sheet will appear here…';
  }

  document.getElementById('addSecBtn').addEventListener('click', function () { addSection('New Section', ''); });
  document.getElementById('loadExample').addEventListener('click', function () {
    orgWrap.innerHTML = '';
    addSection('Verse 1', 'Morning light is calling my name\nEvery shadow fades the same');
    addSection('Chorus', 'We are louder than the night\nHold the spark and hold it tight');
  });

  addSection('Verse 1', '');
  addSection('Chorus', '');
  runRhyme(); runSyll(); buildSheet();
});
