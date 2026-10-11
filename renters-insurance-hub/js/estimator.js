// Renters insurance quote estimator — 2026 US averages model
// Base: ~$15/mo ($180/yr) national average for $30k personal property / $100k liability / $500 deductible.
var STATE_MULT = {
  AL:1.14, AK:0.95, AZ:0.95, AR:1.10, CA:1.03, CO:1.08, CT:1.00, DE:0.95, DC:1.05,
  FL:1.25, GA:1.12, HI:1.00, ID:0.78, IL:0.95, IN:0.88, IA:0.80, KS:1.10, KY:0.98,
  LA:1.28, ME:0.85, MD:0.98, MA:0.98, MI:0.95, MN:0.85, MS:1.32, MO:0.98, MT:0.68,
  NE:1.05, NV:1.05, NH:0.88, NJ:1.02, NM:1.00, NY:1.05, NC:0.90, ND:0.70, OH:0.88,
  OK:1.22, OR:0.88, PA:0.93, RI:1.02, SC:1.05, SD:0.72, TN:0.95, TX:1.15, UT:0.85,
  VT:0.85, VA:0.92, WA:0.90, WV:1.00, WI:0.82, WY:0.75
};
var STATE_NAMES = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California', CO:'Colorado',
  CT:'Connecticut', DE:'Delaware', DC:'Washington DC', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas',
  KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts',
  MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana',
  NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico',
  NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
  OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming'
};
var BASE_MONTHLY = 15;
var COV_FACTOR = { '10000':0.75, '20000':0.90, '30000':1.00, '40000':1.10, '50000':1.18, '75000':1.32, '100000':1.45 };
var DED_FACTOR = { '250':1.18, '500':1.00, '1000':0.88, '2500':0.75 };
var LIAB_FACTOR = { '100000':1.00, '300000':1.05, '500000':1.08 };

function money(n){ return '$' + Math.round(n).toLocaleString('en-US'); }

document.addEventListener('DOMContentLoaded', function(){
  var sel = document.getElementById('state');
  Object.keys(STATE_NAMES).forEach(function(ab){
    var o = document.createElement('option');
    o.value = ab; o.textContent = STATE_NAMES[ab];
    sel.appendChild(o);
  });
  sel.value = 'TX';

  function calc(){
    var st = sel.value;
    var mult = STATE_MULT[st] || 1.0;
    var cov = document.getElementById('coverage').value;
    var ded = document.getElementById('deductible').value;
    var liab = document.getElementById('liability').value;
    var valuables = parseFloat(document.getElementById('valuables').value) || 0;

    var monthly = BASE_MONTHLY * mult * COV_FACTOR[cov] * DED_FACTOR[ded] * LIAB_FACTOR[liab];
    // scheduled valuables floater: ~$13 per $1,000 of jewelry per year
    monthly += (valuables / 1000) * (13 / 12);

    var disc = 1.0, applied = [];
    if (document.getElementById('d-bundle').checked){ disc *= 0.90; applied.push('Multi-policy bundle (−10%)'); }
    if (document.getElementById('d-safety').checked){ disc *= 0.95; applied.push('Protective devices (−5%)'); }
    if (document.getElementById('d-claims').checked){ disc *= 0.95; applied.push('Claims-free 3+ years (−5%)'); }
    monthly *= disc;

    var annual = monthly * 12;
    var res = document.getElementById('result');
    res.classList.add('show');
    document.getElementById('r-monthly').textContent = money(monthly);
    document.getElementById('r-annual').textContent = money(annual);
    var natl = BASE_MONTHLY * COV_FACTOR[cov] * DED_FACTOR[ded] * LIAB_FACTOR[liab];
    var diff = Math.round(((monthly - natl) / natl) * 100);
    var cmp = diff > 5 ? 'about ' + diff + '% ABOVE the national average — mostly due to your state.' :
              diff < -5 ? 'about ' + Math.abs(diff) + '% BELOW the national average — ' + STATE_NAMES[st] + ' is one of the cheaper states.' :
              'roughly in line with the national average.';
    document.getElementById('r-compare').textContent = 'That\'s ' + cmp;
    var det = 'Estimated for ' + STATE_NAMES[st] + ' · ' + money(cov) + ' personal property · ' +
      money(liab) + ' liability · ' + money(ded) + ' deductible' +
      (applied.length ? ' · Discounts: ' + applied.join(', ') : '');
    document.getElementById('r-detail').textContent = det;
  }

  document.getElementById('calc-form').addEventListener('submit', function(e){ e.preventDefault(); calc(); });
  document.getElementById('calc-form').addEventListener('change', calc);
  calc();
});
