// Auto loan calculator: vehicle price - down payment - trade-in = amount financed
function calcAutoLoan() {
  var price = parseFloat(document.getElementById('price').value) || 0;
  var down = parseFloat(document.getElementById('down').value) || 0;
  var trade = parseFloat(document.getElementById('trade').value) || 0;
  var rate = parseFloat(document.getElementById('rate').value) || 0;
  var years = parseFloat(document.getElementById('years').value) || 0;
  var tax = parseFloat(document.getElementById('tax').value) || 0;
  var months = Math.round(years * 12);

  if (price <= 0 || months <= 0) {
    alert('Please enter the vehicle price and loan term.');
    return;
  }
  var taxedPrice = price * (1 + tax / 100);
  var financed = Math.max(0, taxedPrice - down - trade);
  var pmt = monthlyPayment(financed, rate, months);
  var total = pmt * months;
  var interest = total - financed;

  document.getElementById('r-monthly').textContent = fmt(pmt);
  document.getElementById('r-financed').textContent = fmt(financed);
  document.getElementById('r-total').textContent = fmt(total);
  document.getElementById('r-interest').textContent = fmt(interest);
  document.getElementById('r-taxed').textContent = fmt(taxedPrice);

  document.getElementById('result').classList.add('show');
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}
