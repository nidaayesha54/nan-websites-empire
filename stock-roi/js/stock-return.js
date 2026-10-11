/* Stock Return Calculator */
(function(){
  function $(id){return document.getElementById(id);}
  function fmt(n,dec){dec=(dec===undefined)?2:dec;return Number(n).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});}
  function calc(){
    var buy=parseFloat($('buyPrice').value)||0,
        sell=parseFloat($('sellPrice').value)||0,
        shares=parseFloat($('shares').value)||0,
        div=parseFloat($('dividends').value)||0,
        yrs=parseFloat($('years').value)||0;
    var invested=buy*shares,
        proceeds=sell*shares,
        gain=proceeds-invested,
        totalReturn=gain+div;
    var retPct=invested>0?(totalReturn/invested*100):0;
    var annPct=0;
    if(yrs>0&&invested>0){var endVal=invested+totalReturn;annPct=(Math.pow(endVal/invested,1/yrs)-1)*100;}
    $('rInvested').textContent='$'+fmt(invested);
    $('rProceeds').textContent='$'+fmt(proceeds);
    $('rGain').textContent='$'+fmt(gain);
    $('rGain').className='val '+(gain>=0?'positive':'negative');
    $('rDividends').textContent='$'+fmt(div);
    $('rTotal').textContent='$'+fmt(totalReturn);
    $('rTotal').className='val '+(totalReturn>=0?'positive':'negative');
    $('rPct').textContent=fmt(retPct)+'%';
    $('rPct').className='val '+(retPct>=0?'positive':'negative');
    $('rAnn').textContent=yrs>0?fmt(annPct)+'%':'—';
    $('rAnn').className='val '+(annPct>=0?'positive':'negative');
  }
  document.addEventListener('DOMContentLoaded',function(){
    ['buyPrice','sellPrice','shares','dividends','years'].forEach(function(id){
      var el=$(id); if(el){el.addEventListener('input',calc);}
    });
    calc();
  });
})();
