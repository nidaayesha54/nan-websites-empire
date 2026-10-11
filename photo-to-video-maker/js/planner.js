/* Slideshow Planner — builds a timeline + export checklist */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  function fmt(sec) {
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ':' + (s < 10 ? '0' + s : s);
  }

  function build() {
    var photos = Math.max(1, Math.min(500, parseInt($('photoCount').value, 10) || 60));
    var perPhoto = parseFloat($('secPerPhoto').value) || 4;
    var intro = Math.max(0, parseFloat($('introSec').value) || 0);
    var outro = Math.max(0, parseFloat($('outroSec').value) || 0);
    var musicMin = Math.max(0, parseFloat($('musicMin').value) || 0);
    var trans = Math.max(0, parseFloat($('transitionSec').value) || 0);

    var photoSection = photos * perPhoto + photos * trans;
    var total = intro + photoSection + outro;

    $('totalTime').textContent = fmt(total);
    $('photoTime').textContent = fmt(photoSection);

    var musicSec = musicMin * 60;
    var fitPct = musicSec > 0 ? Math.round((musicSec / total) * 100) : 0;
    $('musicFit').textContent = musicSec > 0 ? fitPct + '%' : '—';

    var advice = '';
    if (musicSec <= 0) {
      advice = 'No music track entered — add one to give your slideshow rhythm. Match the track length to your total runtime of ' + fmt(total) + '.';
    } else if (musicSec < total * 0.9) {
      advice = 'Your music (' + fmt(musicSec) + ') is shorter than your slideshow (' + fmt(total) + '). Loop the track, add a second song, or reduce photos to about ' + Math.max(1, Math.floor((musicSec - intro - outro - photos * trans) / perPhoto)) + '.';
    } else if (musicSec > total * 1.15) {
      advice = 'Your music (' + fmt(musicSec) + ') runs longer than your slideshow (' + fmt(total) + '). Trim the track, fade out at ' + fmt(total) + ', or add ~' + Math.ceil((musicSec - total) / perPhoto) + ' more photos.';
    } else {
      advice = 'Perfect fit: your music (' + fmt(musicSec) + ') matches your slideshow runtime (' + fmt(total) + '). Fade out the last 3 seconds for a clean ending.';
    }
    $('musicAdvice').textContent = advice;

    // Timeline (show first 15 + last 3 rows for big lists)
    var tl = $('timeline');
    tl.innerHTML = '';
    var rows = [];
    function row(time, label, body) {
      return '<div class="tl-row"><div class="tl-time">' + time + '</div><div class="tl-body"><b>' + label + '</b><br>' + body + '</div></div>';
    }
    var t = 0;
    if (intro > 0) {
      rows.push(row(fmt(0) + ' – ' + fmt(intro), 'Intro title card', 'Title text, date, music fades in.'));
      t = intro;
    }
    var showAll = photos <= 25;
    for (var i = 1; i <= photos; i++) {
      var start = t, end = t + perPhoto + trans;
      var label = 'Photo ' + i + ' of ' + photos;
      var body = perPhoto.toFixed(1) + 's on screen' + (trans > 0 ? ' + ' + trans.toFixed(2) + 's transition' : '') + '.';
      if (showAll || i <= 12) rows.push(row(fmt(start) + ' – ' + fmt(end), label, body));
      else if (i === 13) rows.push(row('…', '…', '…and so on — same timing for each photo…'));
      t = end;
    }
    if (photos > 25) {
      // add last 2 real photo rows
      var t2 = intro;
      for (var j = photos - 1; j <= photos; j++) {
        var t0 = t2 + (j - 1) * (perPhoto + trans), t1 = t0 + perPhoto + trans;
        rows.splice(rows.length - 1, 0, row(fmt(t0) + ' – ' + fmt(t1), 'Photo ' + j + ' of ' + photos, perPhoto.toFixed(1) + 's on screen.'));
      }
    }
    if (outro > 0) {
      rows.push(row(fmt(t) + ' – ' + fmt(t + outro), 'Outro / credits', 'Thank-you card, credits, music fades out.'));
      t += outro;
    }
    tl.innerHTML = rows.join('');

    // Checklist
    var items = [
      'Collect & order ' + photos + ' photos (remove duplicates)',
      'Crop/resize photos to 16:9 (1920×1080) for clean edges',
      'Set ' + perPhoto.toFixed(1) + 's per photo with ' + (trans > 0 ? trans.toFixed(2) + 's transitions' : 'no transitions'),
      musicSec > 0 ? 'Prepare music: ' + fmt(musicSec) + ' of audio for a ' + fmt(total) + ' slideshow' : 'Choose background music (~' + fmt(total) + ' needed)',
      'Add intro title card' + (intro > 0 ? ' (' + intro + 's)' : ''),
      'Add captions/titles to key photos',
      'Add outro / thank-you card' + (outro > 0 ? ' (' + outro + 's)' : ''),
      'Export 1080p MP4 (H.264) — total target ' + fmt(total),
      'Watch full export once; check timing, typos & audio sync'
    ];
    var cl = $('checklist');
    cl.innerHTML = items.map(function (it) { return '<li>' + it + '</li>'; }).join('');
    cl.querySelectorAll('li').forEach(function (li) {
      li.addEventListener('click', function () { li.classList.toggle('done'); });
    });

    $('planResult').style.display = 'block';
    $('planResult').scrollIntoView({ behavior: 'smooth' });
  }

  function init() {
    if (!$('planBtn')) return;
    $('secPerPhoto').addEventListener('input', function () {
      $('secLabel').textContent = parseFloat(this.value).toFixed(1) + 's';
    });
    $('planBtn').addEventListener('click', build);
    build(); // initial render
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
