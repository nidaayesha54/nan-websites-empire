/* BizROI — business ROI calculator logic */
function fmt(n){return '$'+Math.round(n).toLocaleString('en-US');}
function fmtPct(n){return n.toFixed(1)+'%';}

function calcROI(){
  var cost=parseFloat(document.getElementById('startup-cost').value)||0;
  var rev=parseFloat(document.getElementById('monthly-rev').value)||0;
  var exp=parseFloat(document.getElementById('monthly-exp').value)||0;
  var horizon=parseInt(document.getElementById('horizon').value)||12;

  var profit=Math.max(0,rev-exp);
  var totalProfit=profit*horizon;
  var roi=cost>0?((totalProfit-cost)/cost)*100:0;
  var payback=profit>0?cost/profit:Infinity;
  var multiple=cost>0?totalProfit/cost:0;

  setVal('r-profit',fmt(profit),profit>0?'good':'');
  setVal('r-roi',fmtPct(roi),roi>=100?'good':(roi<0?'bad':''));
  setVal('r-payback',isFinite(payback)?payback.toFixed(1)+' mo':'—',isFinite(payback)&&payback<=12?'good':'');
  setVal('r-multiple',multiple.toFixed(2)+'x',multiple>=2?'good':'');
  setVal('r-total',fmt(totalProfit),totalProfit>cost?'good':'');

  var v=document.getElementById('verdict');
  var msg;
  if(cost<=0||profit<=0){
    msg='Enter a positive startup cost and make sure monthly revenue exceeds monthly expenses to see a meaningful ROI.';
  }else if(roi>=200){
    msg='<strong>Excellent.</strong> A '+fmtPct(roi)+' ROI over '+horizon+' months with payback in '+payback.toFixed(1)+' months is outstanding for a small business. This is the kind of profile investors love.';
  }else if(roi>=100){
    msg='<strong>Strong.</strong> '+fmtPct(roi)+' ROI means you more than double your investment in '+horizon+' months. Payback in '+payback.toFixed(1)+' months is healthy — keep costs controlled as you scale.';
  }else if(roi>=0){
    msg='<strong>Positive but modest.</strong> '+fmtPct(roi)+' ROI with a '+payback.toFixed(1)+'-month payback is viable. Consider whether your time earns more elsewhere, or find ways to lift margins.';
  }else{
    msg='<strong>Losing money.</strong> At these numbers the business does not pay back its startup cost within '+horizon+' months. Cut expenses, raise prices, or rethink the model before investing.';
  }
  v.innerHTML=msg;
}
function setVal(id,txt,cls){
  var el=document.getElementById(id);
  el.textContent=txt;
  el.parentElement.className='result '+cls;
}
['startup-cost','monthly-rev','monthly-exp','horizon'].forEach(function(id){
  var el=document.getElementById(id);
  if(el){el.addEventListener('input',calcROI);el.addEventListener('change',calcROI);}
});
calcROI();
