/* NCLEX Pass Rate Decoder logic */
(function () {
  'use strict';

  function band(rate) {
    if (rate >= 90) {
      return { cls: 'good', label: 'Excellent', text: 'A 90%+ first-time pass rate signals a top-tier program: strong teaching, good clinical placements, and effective student support. This is the kind of outcome you want to pay for.' };
    }
    if (rate >= 85) {
      return { cls: 'good', label: 'Strong', text: 'Most well-regarded nursing schools land here. The program reliably prepares students — pair this with ACEN or CCNE accreditation and you have a safe choice.' };
    }
    if (rate >= 80) {
      return { cls: 'warn', label: 'Acceptable — ask questions', text: 'This clears most state minimums, but it is worth asking the school what tutoring, remediation, and re-test coaching it offers. Check whether the trend is rising or falling over 3–5 years.' };
    }
    if (rate >= 75) {
      return { cls: 'bad', label: 'Caution', text: 'Many states flag programs that stay under 80%. Ask for a multi-year trend: one weak year differs from a weak pattern. Ask what changed and what the school is doing about it.' };
    }
    return { cls: 'bad', label: 'Red flag', text: 'Below 75% is a serious warning sign. Steer clear unless the school can show clear, documented improvement — most students are better served by programs with stronger outcomes.' };
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('nclex-form');
    var out = document.getElementById('nclex-results');
    if (!form || !out) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var rate = parseFloat(document.getElementById('passrate').value);
      if (isNaN(rate) || rate < 0 || rate > 100) {
        out.innerHTML = '<div class="verdict bad"><p>Please enter a pass rate between 0 and 100.</p></div>';
        return;
      }
      var b = band(rate);
      out.innerHTML =
        '<div class="verdict ' + b.cls + '">' +
        '<div class="big-number">' + rate.toFixed(1) + '%</div>' +
        '<p><strong>' + b.label + '</strong></p>' +
        '<p>' + b.text + '</p>' +
        '<p style="color:var(--muted);font-size:.9rem">Always verify pass rates with your state board of nursing — schools sometimes advertise the most flattering single year.</p>' +
        '</div>';
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
