// Demo Song Builder — theme + mood + genre → original song skeleton
document.addEventListener('DOMContentLoaded', function () {

  var THEMES = {
    love: { label: 'Love',
      titles: ['Gravity of You', 'Halfway to Forever', 'Your Name in Lights'],
      verse: ['Streetlights blur when you walk my way', 'Every little thing you do makes me stay', 'Coffee tastes like Sunday morning', 'I was lost, now the sky is clearing'],
      pre: ['And I feel it building, slow and true', 'Every heartbeat pulling me to you'],
      chorus: ['You\u2019re the gravity of my heart', 'Pulling every piece, never far apart', 'Hold me closer, don\u2019t let go', 'You\u2019re the only home I know'],
      bridge: ['If the world goes dark tonight', 'We\u2019ll be dancing in the light'] },
    heartbreak: { label: 'Heartbreak',
      titles: ['Empty Passenger Seat', 'Letters I Never Sent', 'Static on the Line'],
      verse: ['Your side of the bed is cold again', 'I replay the words we can\u2019t unsay', 'The radio plays our favorite song', 'I turn it off and drive along'],
      pre: ['And I\u2019m learning how to breathe alone', 'In a house that never felt like home'],
      chorus: ['This is the sound of letting go', 'Watching all our embers lose their glow', 'I loved you more than you could know', 'Now I\u2019m learning to walk alone'],
      bridge: ['Maybe someday we\u2019ll be fine', 'But tonight you\u2019re no longer mine'] },
    party: { label: 'Party Night',
      titles: ['Neon Confetti', 'Bassline Summer', 'Hands Up Higher'],
      verse: ['Lights go up, the bass kicks in', 'Tonight we let the night begin', 'Hands up high, don\u2019t stop the beat', 'Everybody move your feet'],
      pre: ['Turn it up, we\u2019re wide awake', 'This is the night we\u2019re gonna take'],
      chorus: ['Dance until the morning light', 'We\u2019re electric, burning bright', 'No worries and no goodbyes', 'Just the music and the sky'],
      bridge: ['One more song, don\u2019t let it end', 'This night with all my friends'] },
    dreams: { label: 'Chasing Dreams',
      titles: ['Paper Planes', 'Chasing Constellations', 'The Long Climb'],
      verse: ['I packed my doubts in yesterday', 'And watched them slowly drift away', 'The mountain\u2019s high, the road is long', 'But I was born to carry on'],
      pre: ['Every setback makes me strong', 'I\u2019ve been waiting far too long'],
      chorus: ['I\u2019m chasing constellations in the sky', 'No ceiling and no reason why', 'I\u2019ll fly on paper planes so high', 'My dreams will never say goodbye'],
      bridge: ['When the night is at its darkest hour', 'That\u2019s when dreamers find their power'] },
    nostalgia: { label: 'Nostalgia',
      titles: ['Polaroid Summer', 'The Old Dirt Road', 'Cassette Rewind'],
      verse: ['Polaroids stuck on the fridge door', 'Laughing like we did before', 'The old dirt road behind the pines', 'Takes me back to better times'],
      pre: ['And I\u2019d give it all to rewind', 'To the days we left behind'],
      chorus: ['Take me back to that polaroid summer', 'When the days were long and the nights were warmer', 'We were young and the world was ours', 'Dancing underneath the stars'],
      bridge: ['Memories fade but feelings stay', 'I\u2019ll keep them close, come what may'] },
    selfbelief: { label: 'Self-Belief',
      titles: ['Unbreakable', 'My Own Anthem', 'Rise Louder'],
      verse: ['They said I\u2019d never make it through', 'Watch me prove them wrong, it\u2019s true', 'I\u2019m the author of my story', 'Every scar becomes my glory'],
      pre: ['No more doubt, no more fear', 'My moment\u2019s finally here'],
      chorus: ['I am unbreakable, watch me rise', 'Fire in my heart and open skies', 'Nothing\u2019s gonna hold me down', 'I\u2019m taking back my crown'],
      bridge: ['Stronger than I was before', 'I\u2019m kicking down every door'] }
  };

  var MOODS = {
    happy:     { label: 'Happy',     shift: 5,  note: 'Bright major-key production, bouncy rhythm.' },
    sad:       { label: 'Sad',       shift: -8, note: 'Sparse piano or acoustic guitar, lots of space.' },
    energetic: { label: 'Energetic', shift: 8,  note: 'Driving drums, punchy bass, big chorus lift.' },
    chill:     { label: 'Chill',     shift: -10, note: 'Laid-back groove, soft pads, breathy vocal.' },
    hopeful:   { label: 'Hopeful',   shift: 0,  note: 'Builds from intimate verse to soaring chorus.' },
    rebellious:{ label: 'Rebellious',shift: 5,  note: 'Edgy guitars or gritty synths, attitude vocal.' }
  };

  var GENRES = {
    pop:     { label: 'Pop',     tempo: [100, 120] },
    country: { label: 'Country', tempo: [90, 110] },
    hiphop:  { label: 'Hip-Hop', tempo: [85, 95] },
    edm:     { label: 'EDM',     tempo: [124, 128] },
    rnb:     { label: 'R&B',     tempo: [85, 100] },
    rock:    { label: 'Rock',    tempo: [120, 140] }
  };

  var STRUCTS = {
    pop:    [['Intro', 4], ['Verse 1', 8], ['Pre-Chorus', 4], ['Chorus', 8], ['Verse 2', 8], ['Chorus', 8], ['Bridge', 8], ['Final Chorus', 8], ['Outro', 4]],
    ababcb: [['Verse 1', 8], ['Chorus', 8], ['Verse 2', 8], ['Chorus', 8], ['Bridge', 8], ['Chorus', 8]],
    hiphop: [['Intro', 4], ['Hook', 8], ['Verse 1', 16], ['Hook', 8], ['Verse 2', 16], ['Hook', 8], ['Outro', 4]],
    ballad: [['Intro', 4], ['Verse 1', 8], ['Chorus', 8], ['Verse 2', 8], ['Chorus', 8], ['Bridge', 4], ['Final Chorus', 8], ['Outro', 4]]
  };

  var SYL_EXCEPTIONS = { rhythm: 2, every: 2, evening: 2, business: 2, family: 3 };
  function countSyllables(word) {
    word = String(word).toLowerCase().replace(/[^a-z]/g, '');
    if (SYL_EXCEPTIONS[word]) return SYL_EXCEPTIONS[word];
    if (!word) return 0;
    if (word.length <= 3) return 1;
    var vowels = 'aeiouy', count = 0, prev = false;
    for (var i = 0; i < word.length; i++) {
      var v = vowels.indexOf(word[i]) !== -1;
      if (v && !prev) count++;
      prev = v;
    }
    if (word.slice(-1) === 'e') count--;
    return Math.max(count, 1);
  }
  function lineSyll(line) {
    return line.split(/\s+/).filter(Boolean).reduce(function (a, w) { return a + countSyllables(w); }, 0);
  }

  var themeEl = document.getElementById('themeSel');
  var moodEl = document.getElementById('moodSel');
  var genreEl = document.getElementById('genreSel');
  var structEl = document.getElementById('structSel');
  var singerEl = document.getElementById('singerName');
  var outEl = document.getElementById('songOut');
  var titleEl = document.getElementById('songTitle');
  var metaEl = document.getElementById('songMeta');
  var titleIdx = 0;

  Object.keys(THEMES).forEach(function (k) {
    var o = document.createElement('option'); o.value = k; o.textContent = THEMES[k].label; themeEl.appendChild(o);
  });
  Object.keys(MOODS).forEach(function (k) {
    var o = document.createElement('option'); o.value = k; o.textContent = MOODS[k].label; moodEl.appendChild(o);
  });
  Object.keys(GENRES).forEach(function (k) {
    var o = document.createElement('option'); o.value = k; o.textContent = GENRES[k].label; genreEl.appendChild(o);
  });

  function pickLines(pool, count, offset) {
    var lines = [];
    for (var i = 0; i < count; i++) lines.push(pool[(offset + i) % pool.length]);
    return lines;
  }

  function build() {
    var th = THEMES[themeEl.value], md = MOODS[moodEl.value], gn = GENRES[genreEl.value];
    var struct = STRUCTS[structEl.value];
    var tempo = Math.round((gn.tempo[0] + gn.tempo[1]) / 2 + md.shift);
    var singer = singerEl.value.trim();

    titleEl.textContent = '\u201C' + th.titles[titleIdx % th.titles.length] + '\u201D';
    var totalBars = struct.reduce(function (a, s) { return a + s[1]; }, 0);
    var secs = Math.round(totalBars * (60 / tempo) * 4);
    var dur = Math.floor(secs / 60) + ':' + (secs % 60 < 10 ? '0' : '') + (secs % 60);
    metaEl.innerHTML =
      '<div class="kv"><span>Genre / Mood</span><b>' + gn.label + ' · ' + md.label + '</b></div>' +
      '<div class="kv"><span>Suggested tempo</span><b>' + tempo + ' BPM</b></div>' +
      '<div class="kv"><span>Est. runtime</span><b>' + totalBars + ' bars ≈ ' + dur + '</b></div>' +
      '<div class="kv"><span>Production note</span><b>' + md.note + '</b></div>' +
      (singer ? '<div class="kv"><span>Vocal persona</span><b>' + esc(singer) + '</b></div>' : '');

    var txt = '\u201C' + th.titles[titleIdx % th.titles.length] + '\u201D — ' + gn.label + ' · ' + md.label + ' · ' + tempo + ' BPM\n\n';
    var vOff = 0;
    struct.forEach(function (s) {
      var name = s[0], bars = s[1], lines;
      if (/verse/i.test(name)) { lines = pickLines(th.verse, 4, vOff); vOff += 2; }
      else if (/pre/i.test(name)) { lines = th.pre.slice(); }
      else if (/chorus|hook/i.test(name)) { lines = th.chorus.slice(); }
      else if (/bridge/i.test(name)) { lines = th.bridge.slice(); }
      else { lines = ['(instrumental — ' + bars + ' bars)']; }
      txt += '[' + name.toUpperCase() + '] (' + bars + ' bars)\n';
      lines.forEach(function (ln) {
        txt += ln.indexOf('(instrumental') === 0 ? ln : ln + '  (' + lineSyll(ln) + ' syll)';
        txt += '\n';
      });
      txt += '\n';
    });
    txt += '— Placeholder lyrics are 100% original. Replace with your own lines, then paste into your AI vocal tool.';
    outEl.textContent = txt;
  }

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]); }); }

  document.getElementById('buildBtn').addEventListener('click', build);
  document.getElementById('newTitleBtn').addEventListener('click', function () { titleIdx++; build(); });
  [themeEl, moodEl, genreEl, structEl].forEach(function (el) { el.addEventListener('change', build); });
  singerEl.addEventListener('input', build);

  build();
});
