/* BizROI — break-even calculator logic */
function fmt(n){return '$'+Math.round(n).toLocaleString('en-US');}

function calcBE(){
  var fixed=parseFloat(document.getElementById('fixed-costs').value)||0;
  var price=parseFloat(document.getElementById('unit-price').value)||0;
  var variable=parseFloat(document.getElementById('variable-cost').value)||0;
  var sales=parseFloat(document.getElementById('monthly-sales').value)||0;

  var margin=price-variable;
  var beUnits=margin>0?fixed/margin:Infinity;
  var beRevenue=isFinite(beUnits)?beUnits*price:Infinity;
  var months=isFinite(beUnits)&&sales>0?beUnits/sales:Infinity;
  var monthlyProfit=sales*margin-fixed;

  setVal('b-units',isFinite(beUnits)?Math.ceil(beUnits).toLocaleString('en-US'):'—','');
  setVal('b-revenue',isFinite(beRevenue)?fmt(beRevenue):'—','');
  setVal('b-months',isFinite(months)?months.toFixed(1)+' mo':'—',isFinite(months)&&months<=12?'good':'');
  setVal('b-margin',margin>0?fmt(margin)+' / unit':'$0 — invalid',margin>0?'good':'bad');
  setVal('b-profit',fmt(monthlyProfit),monthlyProfit>0?'good':(monthlyProfit<0?'bad':''));

  var v=document.getElementById('be-verdict');
  var msg;
  if(margin<=0){
    msg='<strong>Problem:</strong> your variable cost is equal to or higher than your price — every sale loses money. Raise the price or cut variable costs before anything else.';
  }else if(!isFinite(months)){
    msg='Enter your expected monthly sales to see how long until break-even.';
  }else if(months<=6){
    msg='<strong>Healthy.</strong> Break-even in '+months.toFixed(1)+' months at '+Math.ceil(beUnits).toLocaleString('en-US')+' units ('+fmt(beRevenue)+') is a strong position. Focus on hitting that sales pace.';
  }else if(months<=12){
    msg='<strong>Workable.</strong> Break-even in '+months.toFixed(1)+' months needs '+Math.ceil(beUnits).toLocaleString('en-US')+' units. Make sure you have enough cash runway — most small businesses underestimate this.';
  }else{
    msg='<strong>Risky.</strong> '+months.toFixed(1)+' months to break even at current sales is a long runway. Lower fixed costs, raise prices, or plan for '+Math.ceil(beUnits).toLocaleString('en-US')+' units before profitability.';
  }
  v.innerHTML=msg;
}
function setVal(id,txt,cls){
  var el=document.getElementById(id);
  el.textContent=txt;
  el.parentElement.className='result '+cls;
}
['fixed-costs','unit-price','variable-cost','monthly-sales'].forEach(function(id){
  var el=document.getElementById(id);
  if(el){el.addEventListener('input',calcBE);}
});
calcBE();
