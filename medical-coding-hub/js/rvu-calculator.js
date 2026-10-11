// RVU calculator — payment = (wRVU*wGPCI + peRVU*peGPCI + mpRVU*mpGPCI) x conversion factor
// Sample RVUs are approximate/educational — verify against the current CMS Physician Fee Schedule.
var RVU_SAMPLES = {
  '99202':{w:0.93,pe:1.10,mp:0.09,label:'Office visit, new pt, straightforward'},
  '99203':{w:1.60,pe:1.60,mp:0.14,label:'Office visit, new pt, low'},
  '99204':{w:2.60,pe:2.29,mp:0.22,label:'Office visit, new pt, moderate'},
  '99205':{w:3.50,pe:2.95,mp:0.31,label:'Office visit, new pt, high'},
  '99212':{w:0.70,pe:0.70,mp:0.06,label:'Office visit, est pt, straightforward'},
  '99213':{w:1.30,pe:1.14,mp:0.10,label:'Office visit, est pt, low'},
  '99214':{w:1.92,pe:1.66,mp:0.15,label:'Office visit, est pt, moderate'},
  '99215':{w:2.80,pe:2.34,mp:0.22,label:'Office visit, est pt, high'},
  '99283':{w:1.60,pe:0.90,mp:0.18,label:'ED visit, moderate'},
  '99284':{w:2.60,pe:1.35,mp:0.30,label:'ED visit, high'},
  '93000':{w:0.17,pe:0.34,mp:0.02,label:'ECG with interpretation'},
  '20610':{w:0.79,pe:1.20,mp:0.08,label:'Major joint injection'},
  '10060':{w:1.20,pe:1.80,mp:0.12,label:'I&D abscess, simple'},
  '36415':{w:0.00,pe:0.10,mp:0.00,label:'Venipuncture'},
  '71046':{w:0.18,pe:0.55,mp:0.02,label:'Chest X-ray, 2 views'},
  '96372':{w:0.17,pe:0.35,mp:0.02,label:'Therapeutic injection IM/SC'}
};

function money(n){ return '$' + n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}); }

function fillSample(){
  var sel = document.getElementById('sampleCode');
  var v = sel.value;
  if(RVU_SAMPLES[v]){
    document.getElementById('wrvu').value = RVU_SAMPLES[v].w;
    document.getElementById('pervu').value = RVU_SAMPLES[v].pe;
    document.getElementById('mprvu').value = RVU_SAMPLES[v].mp;
  }
}

function calcRVU(){
  var w  = parseFloat(document.getElementById('wrvu').value)||0;
  var pe = parseFloat(document.getElementById('pervu').value)||0;
  var mp = parseFloat(document.getElementById('mprvu').value)||0;
  var cf = parseFloat(document.getElementById('cf').value)||0;
  var wg = parseFloat(document.getElementById('wg').value)||1;
  var pg = parseFloat(document.getElementById('pg').value)||1;
  var mg = parseFloat(document.getElementById('mg').value)||1;
  var totalRVU = w*wg + pe*pg + mp*mg;
  var payment = totalRVU * cf;
  var box = document.getElementById('result');
  box.classList.add('show');
  box.innerHTML = '<h3>Estimated Medicare Payment</h3>' +
    '<div class="big">'+money(payment)+'</div>' +
    '<table class="data"><tr><th>Component</th><th>RVU</th><th>GPCI</th><th>Adjusted</th></tr>' +
    '<tr><td>Work</td><td>'+w+'</td><td>'+wg+'</td><td>'+(w*wg).toFixed(3)+'</td></tr>' +
    '<tr><td>Practice expense</td><td>'+pe+'</td><td>'+pg+'</td><td>'+(pe*pg).toFixed(3)+'</td></tr>' +
    '<tr><td>Malpractice</td><td>'+mp+'</td><td>'+mg+'</td><td>'+(mp*mg).toFixed(3)+'</td></tr>' +
    '<tr><td><strong>Total RVUs</strong></td><td colspan="2"></td><td><strong>'+totalRVU.toFixed(3)+'</strong></td></tr>' +
    '<tr><td>Conversion factor</td><td colspan="2"></td><td>'+money(cf)+'</td></tr></table>' +
    '<p class="sub" style="margin-top:10px">Formula: (wRVU x wGPCI + peRVU x peGPCI + mpRVU x mpGPCI) x CF. Educational estimate only — actual payment varies by payer contract.</p>';
}

document.addEventListener('DOMContentLoaded', function(){
  var sel = document.getElementById('sampleCode');
  if(sel){
    Object.keys(RVU_SAMPLES).forEach(function(k){
      var o = document.createElement('option');
      o.value = k; o.textContent = k + ' — ' + RVU_SAMPLES[k].label;
      sel.appendChild(o);
    });
    sel.addEventListener('change', fillSample);
  }
});
