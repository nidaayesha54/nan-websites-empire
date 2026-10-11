/* Crypto Profit Calculator */
(function(){
  function $(id){return document.getElementById(id);}
  function fmt(n,dec){dec=(dec===undefined)?2:dec;return Number(n).toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});}
  function calc(){
    var buy=parseFloat($('buyPrice').value)||0,
        sell=parseFloat($('sellPrice').value)||0,
        amt=parseFloat($('amount').value)||0,
        buyFee=(parseFloat($('buyFee').value)||0)/100,
        sellFee=(parseFloat($('sellFee').value)||0)/100;
    var cost=buy*amt,
        buyFeeAmt=cost*buyFee,
        revenue=sell*amt,
        sellFeeAmt=revenue*sellFee,
        net=revenue-sellFeeAmt-cost-buyFeeAmt;
    var roi=cost>0?(net/cost*100):0;
    // breakeven: sell price where after-fee revenue = cost + buy fee
    var be=cost>0?(cost+buyFeeAmt)/(amt*(1-sellFee)):0;
    $('rCost').textContent='$'+fmt(cost);
    $('rFees').textContent='$'+fmt(buyFeeAmt+sellFeeAmt);
    $('rRevenue').textContent='$'+fmt(revenue-sellFeeAmt);
    $('rNet').textContent='$'+fmt(net);
    $('rNet').className='val '+(net>=0?'positive':'negative');
    $('rRoi').textContent=fmt(roi)+'%';
    $('rRoi').className='val '+(roi>=0?'positive':'negative');
    $('rBe').textContent=cost>0?'$'+fmt(be,4):'—';
  }
  document.addEventListener('DOMContentLoaded',function(){
    ['buyPrice','sellPrice','amount','buyFee','sellFee'].forEach(function(id){
      var el=$(id); if(el){el.addEventListener('input',calc);}
    });
    calc();
  });
})();
