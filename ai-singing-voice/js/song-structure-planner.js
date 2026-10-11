// Song Structure Planner — templates, bar editing, duration estimator
document.addEventListener('DOMContentLoaded', function () {
  var TEMPLATES = {
    pop:     { name: 'Verse–Chorus (Pop)', sections: [['Intro',4],['Verse 1',8],['Pre-Chorus',4],['Chorus',8],['Verse 2',8],['Pre-Chorus',4],['Chorus',8],['Bridge',8],['Final Chorus',8],['Outro',4]] },
    ababcb:  { name: 'ABABCB (Classic Rock)', sections: [['Verse 1',8],['Chorus',8],['Verse 2',8],['Chorus',8],['Bridge',8],['Chorus',8]] },
    hiphop:  { name: 'Hip-Hop', sections: [['Intro',4],['Hook',8],['Verse 1',16],['Hook',8],['Verse 2',16],['Hook',8],['Outro',4]] },
    edm:     { name: 'EDM', sections: [['Intro',16],['Build-up',16],['Drop',16],['Breakdown',16],['Build-up',16],['Drop',16],['Outro',16]] },
    ballad:  { name: 'Ballad', sections: [['Intro',4],['Verse 1',8],['Chorus',8],['Verse 2',8],['Chorus',8],['Bridge',4],['Final Chorus',8],['Outro',4]] },
    country: { name: 'Country', sections: [['Intro',4],['Verse 1',8],['Chorus',8],['Verse 2',8],['Chorus',8],['Bridge',8],['Final Chorus',8],['Outro',2]] }
  };

  var tplSel = document.getElementById('tplSelect');
  var bpmEl = document.getElementById('bpm');
  var tsEl = document.getElementById('timesig');
  var tbody = document.getElementById('rows');
  var totalBarsEl = document.getElementById('totalBars');
  var totalTimeEl = document.getElementById('totalTime');
  var sweetEl = document.getElementById('sweetspot');
  var summaryEl = document.getElementById('summary');

  var sections = [];

  function beatsPerBar() {
    var parts = tsEl.value.split('/');
    var num = parseInt(parts[0], 10) || 4;
    var den = parseInt(parts[1], 10) || 4;
    return den === 8 ? num / 2 : num; // compound meters count dotted-quarter beats
  }

  function loadTemplate(key) {
    var t = TEMPLATES[key] || TEMPLATES.pop;
    sections = t.sections.map(function (s) { return { name: s[0], bars: s[1] }; });
    render();
  }

  function render() {
    tbody.innerHTML = '';
    sections.forEach(function (sec, i) {
      var tr = document.createElement('tr');

      var tdName = document.createElement('td');
      var nameIn = document.createElement('input');
      nameIn.type = 'text'; nameIn.value = sec.name; nameIn.setAttribute('aria-label', 'Section name');
      nameIn.addEventListener('input', function () { sec.name = nameIn.value; recalc(); });
      tdName.appendChild(nameIn);

      var tdBars = document.createElement('td');
      var barsIn = document.createElement('input');
      barsIn.type = 'number'; barsIn.min = '1'; barsIn.max = '64'; barsIn.value = sec.bars;
      barsIn.style.width = '80px'; barsIn.setAttribute('aria-label', 'Bars');
      barsIn.addEventListener('input', function () {
        sec.bars = Math.max(1, Math.min(64, parseInt(barsIn.value, 10) || 1));
        recalc();
      });
      tdBars.appendChild(barsIn);

      var tdDur = document.createElement('td');
      tdDur.className = 'secdur'; tdDur.dataset.i = i;

      var tdX = document.createElement('td');
      var del = document.createElement('button');
      del.className = 'btn ghost small'; del.textContent = '✕'; del.setAttribute('aria-label', 'Remove section');
      del.addEventListener('click', function () { sections.splice(i, 1); render(); });
      tdX.appendChild(del);

      tr.appendChild(tdName); tr.appendChild(tdBars); tr.appendChild(tdDur); tr.appendChild(tdX);
      tbody.appendChild(tr);
    });
    recalc();
  }

  function fmt(sec) {
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function recalc() {
    var bpm = Math.max(40, Math.min(220, parseFloat(bpmEl.value) || 120));
    var bpb = beatsPerBar();
    var secPerBar = (60 / bpm) * bpb;
    var totalBars = 0, totalSec = 0;
    var lines = [];
    sections.forEach(function (sec, i) {
      totalBars += sec.bars;
      var d = sec.bars * secPerBar;
      totalSec += d;
      var cell = tbody.querySelector('.secdur[data-i="' + i + '"]');
      if (cell) cell.textContent = fmt(d);
      lines.push((sec.name || 'Section ' + (i + 1)) + ' — ' + sec.bars + ' bars (' + fmt(d) + ')');
    });
    totalBarsEl.textContent = totalBars;
    totalTimeEl.textContent = fmt(totalSec);
    var sweet = totalSec >= 120 && totalSec <= 240;
    sweetEl.innerHTML = sweet
      ? '✅ In the streaming sweet spot (2:00–4:00).'
      : (totalSec < 120
        ? '⚠️ Under 2:00 — short for a full demo; consider adding a section.'
        : '⚠️ Over 4:00 — long for a demo; consider trimming a repeat.');
    summaryEl.textContent =
      'Song map (' + bpm + ' BPM, ' + tsEl.value + ')\n' +
      lines.map(function (l, i) { return (i + 1) + '. ' + l; }).join('\n') +
      '\nTotal: ' + totalBars + ' bars ≈ ' + fmt(totalSec);
  }

  tplSel.addEventListener('change', function () { loadTemplate(tplSel.value); });
  bpmEl.addEventListener('input', recalc);
  tsEl.addEventListener('change', recalc);
  document.getElementById('addSec').addEventListener('click', function () {
    sections.push({ name: 'New Section', bars: 8 }); render();
  });
  document.getElementById('resetBtn').addEventListener('click', function () { loadTemplate(tplSel.value); });

  loadTemplate('pop');
});
