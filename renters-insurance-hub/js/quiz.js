// Coverage quiz — "How much renters insurance do I need?"
var QUESTIONS = [
  { q: '1. How big is your rental?', opts: [
    ['Studio / 1-bedroom', {base: 15000}],
    ['2-bedroom', {base: 25000}],
    ['3-bedroom', {base: 35000}],
    ['4+ bedrooms', {base: 50000}] ] },
  { q: '2. How much are your most valuable single items worth? (laptop, jewelry, instruments, camera gear)', opts: [
    ['Under $1,000', {add: 0}],
    ['$1,000 – $3,000', {add: 2000}],
    ['$3,000 – $5,000', {add: 4000}],
    ['Over $5,000', {add: 8000}] ] },
  { q: '3. Do you work from home with expensive gear, or run a small business from your rental?', opts: [
    ['No, just personal stuff', {add: 0}],
    ['Yes — extra gear worth a few thousand', {add: 5000}],
    ['Yes — my livelihood depends on my equipment', {add: 10000}] ] },
  { q: '4. How would you describe theft / storm risk in your area?', opts: [
    ['Low — safe neighborhood', {add: 0}],
    ['Moderate', {add: 2500, liab: 1}],
    ['High — break-ins or severe weather are common', {add: 5000, liab: 1}] ] },
  { q: '5. Do you have roommates?', opts: [
    ['No, I live alone (or with partner/family)', {add: 0}],
    ['Yes — 1 roommate', {add: 2500, liab: 1}],
    ['Yes — 2 or more roommates', {add: 5000, liab: 1}] ] },
  { q: '6. Do you own a dog or any pet that could injure someone?', opts: [
    ['No pets', {liab: 0}],
    ['Cat / small caged pet', {liab: 0}],
    ['Dog', {liab: 2}] ] },
  { q: '7. If everything you own burned down tomorrow, could you replace it all from savings without pain?', opts: [
    ['Yes, easily', {add: -5000}],
    ['It would hurt, but I could manage', {add: 0}],
    ['No — it would be a financial disaster', {add: 5000}] ] },
  { q: '8. Does your lease require renters insurance?', opts: [
    ['Yes — my landlord requires it', {req: true}],
    ['Not sure', {req: false}],
    ['No', {req: false}] ] }
];
var answers = new Array(QUESTIONS.length).fill(null);

function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }

function renderQuiz(){
  var wrap = document.getElementById('quiz');
  if (!wrap) return;
  var html = '';
  QUESTIONS.forEach(function(q, qi){
    html += '<div class="quiz-q"><h3>' + q.q + '</h3>';
    q.opts.forEach(function(o, oi){
      html += '<div class="opt" data-q="' + qi + '" data-o="' + oi + '">' + o[0] + '</div>';
    });
    html += '</div>';
  });
  wrap.innerHTML = html;
}

function showResult(){
  var base = 0, add = 0, liabHits = 0, req = false;
  QUESTIONS.forEach(function(q, qi){
    var a = answers[qi];
    if (a === null) return;
    var fx = q.opts[a][1];
    if (fx.base) base = fx.base;
    if (fx.add) add += fx.add;
    if (fx.liab) liabHits += fx.liab;
    if (fx.req) req = true;
  });
  var property = base + add;
  if (property < 10000) property = 10000;
  property = Math.ceil(property / 5000) * 5000;
  var liab = liabHits >= 2 ? 300000 : 100000;
  if (liabHits === 1) liab = 100000;

  var res = document.getElementById('result');
  res.classList.add('show');
  var notes = [];
  notes.push('Personal property coverage: ' + money(property));
  notes.push('Personal liability coverage: ' + money(liab) + (liab >= 300000 ? ' (recommended — roommates, pets, or higher-risk area raise your liability exposure)' : ' (the standard starting point)'));
  if (req) notes.push('Your lease requires insurance, so get a policy in place before move-in and send your landlord the proof-of-insurance certificate.');
  if (base >= 35000) notes.push('A larger rental usually means more belongings — a room-by-room inventory will confirm the number.');
  notes.push('Ask your insurer about "replacement cost" vs "actual cash value" — replacement cost pays what it takes to buy new, and costs only a few dollars more per month.');

  var html = '<h3>Your recommendation</h3>' +
    '<div class="big">' + money(property) + ' <span style="font-size:1rem;font-weight:400">personal property</span></div>' +
    '<div class="big" style="font-size:1.4rem;margin-top:8px">' + money(liab) + ' <span style="font-size:1rem;font-weight:400">liability</span></div>' +
    '<ul style="margin-top:14px;padding-left:20px">' + notes.map(function(n){ return '<li>' + n + '</li>'; }).join('') + '</ul>' +
    '<p class="note">Want to double-check the property number? Run our <a href="belongings-calculator.html">belongings calculator</a> for a room-by-room inventory.</p>';
  res.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function(){
  renderQuiz();
  document.getElementById('quiz').addEventListener('click', function(e){
    var o = e.target.closest('.opt');
    if (!o) return;
    var qi = parseInt(o.getAttribute('data-q'), 10);
    var oi = parseInt(o.getAttribute('data-o'), 10);
    answers[qi] = oi;
    var q = QUESTIONS[qi];
    document.querySelectorAll('.opt[data-q="' + qi + '"]').forEach(function(el){ el.classList.remove('sel'); });
    o.classList.add('sel');
    if (answers.every(function(a){ return a !== null; })) showResult();
  });
});
