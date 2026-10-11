var LS_KEY='ich_claims_v1';
function loadClaims(){try{return JSON.parse(localStorage.getItem(LS_KEY))||[];}catch(e){return[];}}
function saveClaims(c){localStorage.setItem(LS_KEY,JSON.stringify(c));}
function addClaim(){
  var g=function(id){return document.getElementById(id).value.trim();};
  var claim=g('cClaim');
  if(!claim){alert('Please enter a claim number.');return;}
  var c={claim:claim,ins:g('cIns'),prov:g('cProv'),dos:g('cDos'),amt:g('cAmt'),
         filed:g('cFiled')||new Date().toISOString().slice(0,10),status:g('cStatus'),notes:g('cNotes'),
         added:new Date().toISOString()};
  var all=loadClaims();all.push(c);saveClaims(all);render();
  ['cClaim','cIns','cProv','cDos','cAmt','cFiled','cNotes'].forEach(function(id){document.getElementById(id).value='';});
}
function delClaim(i){var all=loadClaims();all.splice(i,1);saveClaims(all);render();}
function setStatus(i,sel){var all=loadClaims();all[i].status=sel.value;saveClaims(all);render();}
function clearAll(){if(confirm('Delete ALL logged claims?')){localStorage.removeItem(LS_KEY);render();}}
function render(){
  var all=loadClaims();
  document.getElementById('cCount').textContent=all.length;
  var list=document.getElementById('claimList');
  if(!all.length){list.innerHTML='<p>No claims logged yet. Add your first claim above.</p>';}
  else{
    var html='<table><tr><th>Claim #</th><th>Insurer</th><th>Filed</th><th>Billed</th><th>Status</th><th></th></tr>';
    all.forEach(function(c,i){
      html+='<tr><td><strong>'+esc(c.claim)+'</strong><br><small>'+esc(c.prov||'')+'</small></td><td>'+esc(c.ins||'-')+'</td><td>'+esc(c.filed||'-')+'</td><td>'+(c.amt?fmtUSD(c.amt):'-')+'</td><td><select onchange="setStatus('+i+',this)">'+
      ['Filed — awaiting decision','Under review','Approved','Denied — appeal pending','Paid'].map(function(s){return '<option'+(s===c.status?' selected':'')+'>'+s+'</option>';}).join('')+'</select></td><td><button onclick="delClaim('+i+')">✕</button></td></tr>';
      if(c.notes)html+='<tr><td colspan="6"><small>Notes: '+esc(c.notes)+'</small></td></tr>';
    });
    list.innerHTML=html+'</table>';
  }
  // reminders: claims filed >30 days ago still pending
  var rem=document.getElementById('reminders');
  var now=new Date();var flagged=[];
  all.forEach(function(c){
    if(/Filed|Under review/.test(c.status||'')&&c.filed){
      var days=Math.floor((now-new Date(c.filed))/864e5);
      if(days>30)flagged.push({c:c,days:days});
    }
  });
  if(!flagged.length)rem.innerHTML='<p>Nothing needs follow-up right now.</p>';
  else rem.innerHTML='<ul>'+flagged.map(function(f){return '<li><strong>'+esc(f.c.claim)+'</strong> — filed '+f.days+' days ago, still "'+esc(f.c.status)+'". Call '+(esc(f.c.ins)||'your insurer')+' for an update.</li>';}).join('')+'</ul>';
}
document.addEventListener('DOMContentLoaded',render);
