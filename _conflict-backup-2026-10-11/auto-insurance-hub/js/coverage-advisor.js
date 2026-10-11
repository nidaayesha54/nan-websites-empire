// Coverage advisor quiz: 5 questions -> liability limits + comp/collision advice
var QUIZ = [
  {
    q: 'What is the approximate value of your assets (home equity + savings + investments)?',
    name: 'assets',
    opts: [
      { t: 'Under $50,000', v: 'low' },
      { t: '$50,000 – $250,000', v: 'mid' },
      { t: 'Over $250,000', v: 'high' }
    ]
  },
  {
    q: 'What is your car worth today (Kelley Blue Book value)?',
    name: 'carval',
    opts: [
      { t: 'Under $5,000', v: 'low' },
      { t: '$5,000 – $20,000', v: 'mid' },
      { t: 'Over $20,000', v: 'high' }
    ]
  },
  {
    q: 'Do you have a loan or lease on the car?',
    name: 'loan',
    opts: [
      { t: 'Yes, financed or leased', v: 'yes' },
      { t: 'No, paid off', v: 'no' }
    ]
  },
  {
    q: 'Could you afford to replace your car out of pocket tomorrow?',
    name: 'replace',
    opts: [
      { t: 'Yes, easily', v: 'yes' },
      { t: 'It would hurt but possible', v: 'maybe' },
      { t: 'No way', v: 'no' }
    ]
  },
  {
    q: 'How much risk are you comfortable with?',
    name: 'risk',
    opts: [
      { t: 'I want maximum protection', v: 'low' },
      { t: 'Balanced — good protection, fair price', v: 'mid' },
      { t: 'Cheapest legal option', v: 'high' }
    ]
  }
];
var answers = {};
var qi = 0;

function renderQuiz() {
  var box = document.getElementById('quiz');
  var out = document.getElementById('result');
  out.className = 'result';
  if (qi >= QUIZ.length) { showAdvice(); return; }
  var item = QUIZ[qi];
  var html = '<div class="progress"><div style="width:' + Math.round(qi / QUIZ.length * 100) + '%"></div></div>';
  html += '<div class="quiz-q"><p>Question ' + (qi + 1) + ' of ' + QUIZ.length + ': ' + item.q + '</p>';
  item.opts.forEach(function (o, i) {
    html += '<label><input type="radio" name="' + item.name + '" value="' + o.v + '"> ' + o.t + '</label>';
  });
  html += '</div><button class="calc" onclick="nextQ()">Next →</button>';
  box.innerHTML = html;
}
function nextQ() {
  var item = QUIZ[qi];
  var sel = document.querySelector('input[name="' + item.name + '"]:checked');
  if (!sel) { alert('Please choose an answer.'); return; }
  answers[item.name] = sel.value;
  qi++;
  renderQuiz();
}
function showAdvice() {
  var box = document.getElementById('quiz');
  var out = document.getElementById('result');
  box.innerHTML = '';

  var liability, liabNote;
  if (answers.assets === 'high' || answers.risk === 'low') {
    liability = '250/500/100';
    liabNote = 'With significant assets (or low risk tolerance), 250/500/100 protects what you own from a lawsuit after a serious at-fault accident.';
  } else if (answers.assets === 'mid' || answers.risk === 'mid') {
    liability = '100/300/100';
    liabNote = 'The sweet spot for most drivers: $100K per person / $300K per accident / $100K property damage. Far above state minimums, still affordable.';
  } else {
    liability = 'State minimum (e.g. 25/50/25)';
    liabNote = 'Meets the legal minimum, but one serious accident can exceed these limits — you would owe the rest personally.';
  }

  var needComp = (answers.loan === 'yes' || answers.carval !== 'low' || answers.replace === 'no');
  var compNote = needComp
    ? 'YES — add collision + comprehensive. Your car is financed, valuable, or not easily replaceable.'
    : 'Optional — with a low-value car you could replace, liability-only may make sense.';
  if (answers.loan === 'yes') compNote += ' (Lenders usually REQUIRE full coverage anyway.)';

  out.className = 'result show';
  out.innerHTML =
    '<h3 style="margin-top:0">Your recommended coverage</h3>' +
    '<p><strong>Bodily injury / property damage liability:</strong> <span style="font-size:1.3rem;color:#0b7a55">' + liability + '</span></p>' +
    '<p>' + liabNote + '</p>' +
    '<p><strong>Collision + comprehensive:</strong> <span style="font-size:1.3rem;color:#0b7a55">' + (needComp ? 'Recommended' : 'Probably skip') + '</span></p>' +
    '<p>' + compNote + '</p>' +
    '<p style="font-size:.92rem"><a href="premium-estimator.html">Estimate what this costs →</a></p>' +
    '<button class="calc" onclick="qi=0;answers={};renderQuiz()">Retake quiz</button>';
}
document.addEventListener('DOMContentLoaded', renderQuiz);
