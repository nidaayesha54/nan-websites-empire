// Rumor tracker: localStorage-backed demo list with reliability scores
(function(){
  "use strict";
  var KEY='fth_rumors_v1';
  var form=document.getElementById('rumorForm');
  var tbody=document.getElementById('rumorBody');
  if(!form||!tbody)return;

  function load(){
    try{return JSON.parse(localStorage.getItem(KEY))||[];}
    catch(e){return[];}
  }
  function save(list){localStorage.setItem(KEY,JSON.stringify(list));}
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function score(tier){ // tier 1 -> 95, tier 5 -> 15
    return Math.max(5,100-(tier-1)*20);
  }
  function scoreLabel(s){
    if(s>=80)return 'Very high';if(s>=60)return 'High';
    if(s>=40)return 'Medium';if(s>=20)return 'Low';return 'Very low';
  }
  function render(){
    var list=load();
    if(!list.length){
      tbody.innerHTML='<tr><td colspan="5" style="color:var(--muted)">No rumors yet — add the first one above!</td></tr>';
      return;
    }
    tbody.innerHTML='';
    list.forEach(function(r,i){
      var s=score(r.tier);
      var tr=document.createElement('tr');
      tr.innerHTML='<td><strong>'+esc(r.player)+'</strong></td>'+
        '<td>'+esc(r.from)+' → '+esc(r.to)+'</td>'+
        '<td>Tier '+r.tier+'</td>'+
        '<td><strong style="color:'+(s>=60?'var(--green)':(s>=40?'var(--gold)':'#f87171'))+'">'+s+'%</strong> <small style="color:var(--muted)">'+scoreLabel(s)+'</small></td>'+
        '<td><button data-i="'+i+'" style="background:none;border:0;color:var(--muted);cursor:pointer;font-size:1.1rem" title="Remove">✕</button></td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('button[data-i]').forEach(function(b){
      b.addEventListener('click',function(){
        var list=load();
        list.splice(parseInt(b.getAttribute('data-i'),10),1);
        save(list);render();
      });
    });
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var player=document.getElementById('player').value.trim();
    var from=document.getElementById('fromClub').value.trim();
    var to=document.getElementById('toClub').value.trim();
    var tier=parseInt(document.getElementById('tier').value,10);
    if(!player||!from||!to){alert('Please fill in all fields.');return;}
    var list=load();
    list.unshift({player:player,from:from,to:to,tier:tier,added:Date.now()});
    save(list);render();form.reset();
  });
  render();
})();
