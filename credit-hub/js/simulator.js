// Credit Score Simulator — educational estimates based on FICO factor weights.
// Payment history 35%, Amounts owed 30%, Length of history 15%, New credit 10%, Credit mix 10%.
// These are ILLUSTRATIVE estimates, not predictions.
(function () {
  'use strict';

  function bracket(util) {
    if (util < 10) return 0;
    if (util < 30) return 1;
    if (util < 50) return 2;
    return 3;
  }
  var bracketGain = [0, 18, 14, 10]; // pts gained per bracket improved (diminishing)

  function clampScore(s) { return Math.max(300, Math.min(850, Math.round(s))); }

  function utilPts(before, after, score) {
    var b = bracket(before), a = bracket(after);
    if (a >= b) return 0;
    var pts = 0;
    for (var i = b; i > a; i--) pts += bracketGain[i];
    // Diminishing returns at high scores (harder to gain when already excellent)
    if (score >= 760) pts *= 0.5;
    else if (score >= 700) pts *= 0.75;
    return Math.round(pts);
  }

  function latePts(daysLate, score) {
    // Higher starting scores fall further. Illustrative ranges.
    var base = score >= 780 ? 100 : score >= 720 ? 85 : score >= 660 ? 70 : 55;
    if (daysLate >= 90) return Math.round(base * 1.25);
    if (daysLate >= 60) return Math.round(base * 1.1);
    return base;
  }

  function scenarioDelta(id, p, extra) {
    // p = profile {score, debt, limit, inquiries, oldestAge}
    var util = p.limit > 0 ? (p.debt / p.limit) * 100 : 0;
    switch (id) {
      case 'paydown': {
        var pay = Math.min(extra.pay || 0, p.debt);
        var newUtil = p.limit > 0 ? ((p.debt - pay) / p.limit) * 100 : 0;
        var gain = utilPts(util, newUtil, p.score);
        return { delta: gain, note: 'Utilization drops from ' + util.toFixed(0) + '% to ' + newUtil.toFixed(0) + '%. Amounts owed is ~30% of your score.' };
      }
      case 'newcard': {
        var newLimit = extra.newlimit || 0;
        var newUtil = (p.debt / (p.limit + newLimit)) * 100;
        var uGain = utilPts(util, newUtil, p.score);
        var inquiry = -4, newAcct = -8;
        var net = uGain + inquiry + newAcct;
        return { delta: net, note: 'Hard inquiry (~-4) + lower average account age (~-8), offset by lower utilization (' + (uGain >= 0 ? '+' : '') + uGain + ').' };
      }
      case 'late30': return { delta: -latePts(30, p.score), note: 'Payment history is ~35% of your score. A 30-day late mark can stay on reports for up to 7 years.' };
      case 'late60': return { delta: -latePts(60, p.score), note: 'Payment history is ~35% of your score. A 60-day late mark can stay on reports for up to 7 years.' };
      case 'late90': return { delta: -latePts(90, p.score), note: 'Payment history is ~35% of your score. 90+ days late is a serious delinquency, reported for up to 7 years.' };
      case 'closeoldest': {
        var drop = p.oldestAge >= 10 ? -25 : p.oldestAge >= 5 ? -15 : -8;
        return { delta: drop, note: 'Closing your oldest card shortens your average account age (length of history ~15% of score). The closed account still reports for ~10 years.' };
      }
      case 'ontime': {
        var g = p.score >= 760 ? 8 : p.score >= 700 ? 14 : 22;
        return { delta: g, note: 'Six months of on-time payments steadily rebuilds payment history — the single biggest scoring factor.' };
      }
      default: return { delta: 0, note: '' };
    }
  }

  function rating(s) {
    if (s >= 800) return ['Exceptional', 'good'];
    if (s >= 740) return ['Very Good', 'good'];
    if (s >= 670) return ['Good', 'mid'];
    if (s >= 580) return ['Fair', 'mid'];
    return ['Poor', 'bad'];
  }

  function renderGauge(el, before, after) {
    var pct = ((after - 300) / 550) * 100;
    var r = rating(after);
    var d = after - before;
    var dHtml = d > 0
      ? '<span class="tag good">+' + d + ' pts</span>'
      : d < 0 ? '<span class="tag bad">' + d + ' pts</span>' : '<span class="tag mid">no change</span>';
    el.innerHTML =
      '<h3>Estimated result</h3>' +
      '<div class="big-num">' + after + '</div>' +
      '<div style="margin:6px 0 10px"><span class="tag ' + r[1] + '">' + r[0] + '</span> ' + dHtml + '</div>' +
      '<div class="bar"><div style="width:' + pct.toFixed(1) + '%"></div></div>' +
      '<div class="hint">Range shown is an educational estimate (300–850 scale). Real bureaus weigh many more signals.</div>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('sim-form');
    if (!form) return;
    var scoreRange = document.getElementById('in-score');
    var scoreOut = document.getElementById('score-out');
    var out = document.getElementById('sim-result');

    function cur() {
      return {
        score: parseInt(scoreRange.value, 10),
        debt: parseFloat(document.getElementById('in-debt').value) || 0,
        limit: parseFloat(document.getElementById('in-limit').value) || 0,
        inquiries: parseInt(document.getElementById('in-inq').value, 10) || 0,
        oldestAge: parseFloat(document.getElementById('in-age').value) || 0
      };
    }
    function refreshLabel() { scoreOut.textContent = scoreRange.value; }
    scoreRange.addEventListener('input', refreshLabel);
    refreshLabel();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var p = cur();
      var scenario = document.querySelector('input[name=scenario]:checked');
      if (!scenario) { out.innerHTML = '<div class="result warn"><h3>Pick a scenario</h3><p>Choose one action above, then run the simulation.</p></div>'; return; }
      var extra = {
        pay: parseFloat(document.getElementById('ex-pay').value) || 0,
        newlimit: parseFloat(document.getElementById('ex-newlimit').value) || 0
      };
      var res = scenarioDelta(scenario.value, p, extra);
      var after = clampScore(p.score + res.delta);
      out.innerHTML = '<div class="result' + (res.delta < 0 ? ' bad' : res.delta > 0 ? '' : ' warn') + '"></div>';
      var box = out.firstChild;
      renderGauge(box, p.score, after);
      var note = document.createElement('p');
      note.style.marginTop = '12px';
      note.innerHTML = '<strong>Why:</strong> ' + res.note;
      box.appendChild(note);
    });
  });
})();
