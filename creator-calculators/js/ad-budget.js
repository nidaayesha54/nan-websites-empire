// Ad Budget Calculator
// Sales: maxCPA = price * 0.30; monthly = target * maxCPA; daily = monthly / 30
// Leads: valuePerLead = deal * closeRate; maxCPL = valuePerLead * 0.30
// Test budget = max($20*14, maxCPAorCPL * 50) total over 14 days
function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function toggleGoal() {
  var goal = document.getElementById("goal").value;
  var isSales = goal === "sales";
  document.getElementById("price-field").style.display = isSales ? "block" : "none";
  document.getElementById("conv-field").style.display = isSales ? "block" : "none";
  document.getElementById("deal-field").style.display = isSales ? "none" : "block";
  document.getElementById("close-field").style.display = isSales ? "none" : "block";
  document.querySelector('label[for="target"]').textContent =
    isSales ? "Target sales per month" : "Target leads per month";
  calculate();
}

function calculate() {
  var goal = document.getElementById("goal").value;
  var isSales = goal === "sales";
  var target = parseFloat(document.getElementById("target").value) || 0;
  if (target <= 0) {
    alert("Please enter a target greater than 0.");
    return;
  }

  var unitValue, maxCost, label;
  if (isSales) {
    var price = parseFloat(document.getElementById("price").value) || 0;
    unitValue = price;
    maxCost = price * 0.30;
    label = "cost per sale";
  } else {
    var deal = parseFloat(document.getElementById("deal").value) || 0;
    var closePct = parseFloat(document.getElementById("close").value) || 0;
    var closeRate = Math.min(Math.max(closePct, 0), 100) / 100;
    unitValue = deal * closeRate; // value per lead
    maxCost = unitValue * 0.30;
    label = "cost per lead";
  }

  var monthly = target * maxCost;
  var daily = monthly / 30;
  var revenue = target * unitValue;
  var testTotal = Math.max(20 * 14, maxCost * 50);

  document.getElementById("r-daily").textContent = fmt(daily);
  document.getElementById("r-cpa").textContent = fmt(maxCost);
  document.getElementById("r-cpa-label").textContent = label;
  document.getElementById("r-monthly").textContent = fmt(monthly);
  document.getElementById("r-rev").textContent = fmt(revenue);
  document.getElementById("r-test").textContent = fmt(testTotal) + " (" + fmt(testTotal / 14) + "/day)";
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("DOMContentLoaded", calculate);
