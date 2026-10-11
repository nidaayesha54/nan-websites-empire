// Statistics Calculator logic
(function(){
  document.getElementById('calc').addEventListener('click', calc);
  calc();

  function calc(){
    var raw = document.getElementById('nums').value;
    var nums = raw.split(/[\s,;]+/).map(function(s){return s.trim();})
      .filter(function(s){return s!=='';}).map(Number)
      .filter(function(v){return !isNaN(v);});
    if(!nums.length){
      document.getElementById('out').style.display='none';
      return;
    }
    var s = statsOf(nums);
    function f(v){
      if(!isFinite(v)) return '—';
      return String(Math.round(v*10000)/10000);
    }
    var cards = [
      ['Count', s.n], ['Sum', f(s.sum)], ['Mean', f(s.mean)], ['Median', f(s.median)],
      ['Mode', s.modes.length ? s.modes.join(', ') : '—'],
      ['Min', f(s.min)], ['Max', f(s.max)], ['Range', f(s.range)],
      ['Variance', f(s.variance)], ['Std Deviation', f(s.std)]
    ];
    var html='';
    cards.forEach(function(c){
      html += '<div class="stat"><div class="v">'+escapeHtml(String(c[1]))+'</div><div class="l">'+c[0]+'</div></div>';
    });
    document.getElementById('stats').innerHTML = html;
    document.getElementById('p-q1').textContent = f(s.q1);
    document.getElementById('p-med').textContent = f(s.median);
    document.getElementById('p-q3').textContent = f(s.q3);
    document.getElementById('p-90').textContent = f(s.p90);
    document.getElementById('p-95').textContent = f(s.p95);
    document.getElementById('out').style.display='block';
  }
})();
