/* Social Security timing analyzer — pure math (testable), FRA = 67 */
var FRA = 67;

function ssMonthlyAt(fraBenefit, claimAge){
  if(claimAge < FRA){
    var monthsEarly = Math.round((FRA - claimAge)*12);
    var red;
    if(monthsEarly <= 36){ red = monthsEarly * (5/9) / 100; }
    else { red = (36*(5/9) + (monthsEarly-36)*(5/12)) / 100; }
    return fraBenefit * (1 - red);
  }
  if(claimAge > FRA){
    var yrs = Math.min(claimAge, 70) - FRA;   // 8% delayed credits per year to 70
    return fraBenefit * (1 + 0.08*yrs);
  }
  return fraBenefit;
}

function ssLifetime(monthly, claimAge, lifeExpectancy){
  var yrs = Math.max(0, lifeExpectancy - claimAge);
  return monthly * 12 * yrs;
}

/* ==== DOM wiring ==== */
document.addEventListener('DOMContentLoaded', function(){
  var form = $('ssForm');
  if(!form) return;
  var slider = $('claimAge');
  function render(){
    var fraB = num('fraBenefit'), life = num('lifeExp');
    var age = parseInt(slider.value, 10);
    $('claimAgeVal').textContent = age;
    var box = $('ssResults');
    if(!(fraB>0) || !(life>age)){
      setError('ssResults','Enter a positive FRA benefit and a life expectancy above your claiming age.');
      return;
    }
    var monthly = ssMonthlyAt(fraB, age);
    var life1 = ssLifetime(monthly, age, life);
    var html = '<div class="result-hero"><div class="lbl">Monthly benefit at age '+age+'</div><div class="big">'+money(monthly)+'</div>' +
      '<div class="lbl">Estimated lifetime total (to age '+life+')</div><div class="big" style="font-size:1.6rem">'+money(life1)+'</div></div>';
    html += '<h3>Key claiming ages compared</h3>';
    [62, FRA, 70].forEach(function(a){
      var mb = ssMonthlyAt(fraB, a), lt = ssLifetime(mb, a, life);
      var tag = a===62 ? 'Earliest (~70% of FRA)' : (a===FRA ? 'Full retirement age (100%)' : 'Maximum (~124% of FRA)');
      html += '<div class="stat-row"><span class="k">Age '+a+' <span class="hint">'+tag+'</span></span><span class="v">'+money(mb)+'/mo · '+money(lt)+' lifetime</span></div>';
    });
    var at70 = ssLifetime(ssMonthlyAt(fraB,70), 70, life);
    var at62 = ssLifetime(ssMonthlyAt(fraB,62), 62, life);
    html += '<p class="hint" style="margin-top:14px">With a life expectancy of '+life+', claiming at 70 pays about <strong>'+money(Math.max(0,at70-at62))+'</strong> more over your lifetime than claiming at 62. Shorter life expectancy favors claiming earlier; longer favors waiting. This is an estimate — your actual benefit depends on your earnings record.</p>';
    box.innerHTML = html;
  }
  form.addEventListener('submit', function(e){ e.preventDefault(); render(); });
  ['fraBenefit','lifeExp'].forEach(function(id){ $(id).addEventListener('input', render); });
  slider.addEventListener('input', render);
  render();
});
