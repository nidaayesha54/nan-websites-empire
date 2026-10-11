function calcDiscount(){
  var price=parseFloat(document.getElementById('price').value);
  var disc=parseFloat(document.getElementById('disc').value);
  if(!(price>=0)||isNaN(disc)||disc<0||disc>100){alert('Please enter a valid price and a discount between 0 and 100%.');return;}
  var sale=price*(1-disc/100);
  var save=price-sale;
  document.getElementById('saleBig').textContent='$'+sale.toFixed(2);
  document.getElementById('saveDetail').textContent=
    'You save $'+save.toFixed(2)+' ('+disc+'% off the original $'+price.toFixed(2)+').';
  document.getElementById('res').classList.add('show');
}
