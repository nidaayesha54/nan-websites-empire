// Freelance Rate Calculator — formula:
// gross = (income + expenses) / (1 - taxRate); minRate = gross / hours; recRate = minRate * 1.15
function fmt(n) {
  return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function calculate() {
  var income = parseFloat(document.getElementById("income").value) || 0;
  var expenses = parseFloat(document.getElementById("expenses").value) || 0;
  var taxPct = parseFloat(document.getElementById("tax").value) || 0;
  var hours = parseFloat(document.getElementById("hours").value) || 0;

  if (hours <= 0) {
    alert("Please enter your billable hours per month (must be greater than 0).");
    return;
  }
  if (taxPct < 0) taxPct = 0;
  if (taxPct >= 100) taxPct = 99;

  var taxRate = taxPct / 100;
  var gross = (income + expenses) / (1 - taxRate);
  var minRate = gross / hours;
  var recRate = minRate * 1.15;

  document.getElementById("r-rate").textContent = fmt(Math.ceil(recRate));
  document.getElementById("r-min").textContent = fmt(Math.ceil(minRate));
  document.getElementById("r-gross").textContent = fmt(Math.round(gross));
  document.getElementById("r-small").textContent = fmt(Math.round(recRate * 5));
  document.getElementById("r-med").textContent = fmt(Math.round(recRate * 20));
  document.getElementById("r-large").textContent = fmt(Math.round(recRate * 40));
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Auto-calculate on load with defaults
window.addEventListener("DOMContentLoaded", calculate);
