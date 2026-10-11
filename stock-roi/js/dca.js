/* Dollar-Cost Averaging Calculator */
(function(){
  function $(id){return document.getElementById(id);}
  function fmt(n){return '$'+Number(n).toLocaleString('en-US',{maximumFractionDigits:0});}
  function calc(){
    var monthly=parseFloat($('monthly').value)||0,
        years=parseFloat($('years').value)||0,
        rate=(parseFloat($('rate').value)||0)/100,
        start=(parseFloat($('startAmt').value)||0);
    var months=Math.round(years*12);
    var r=rate/12;
    // Future value of annuity (end-of-period contributions)
    var fvContrib=0;
    if(r>0){fvContrib=monthly*((Math.pow(1+r,months)-1)/r);}
    else{fvContrib=monthly*months;}
    var fvStart=start*Math.pow(1+r,months);
    var fv=fvStart+fvContrib;
    var invested=start+monthly*months;
    var gain=fv-invested;
    $('rInvested').textContent=fmt(invested);
    $('rValue').textContent=fmt(fv);
    $('rGain').textContent=fmt(gain);
    $('rGain').className='val '+(gain>=0?'positive':'negative');
    var mult=invested>0?fv/invested:0;
    $('rMult').textContent=mult>0?mult.toFixed(2)+'x':'—';
    $('rNote').textContent='Assumes a steady '+(parseFloat($('rate').value)||0)+'% annual return, compounded monthly. Real market returns vary — past performance never guarantees future results.';
  }
  document.addEventListener('DOMContentLoaded',function(){
    ['monthly','years','rate','startAmt'].forEach(function(id){
      var el=$(id); if(el){el.addEventListener('input',calc);}
    });
    calc();
  });
})();
