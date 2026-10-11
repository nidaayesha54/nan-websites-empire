// Video Cost Calculator
// Base rates per video (organic usage), [low, high]:
var RATES = {
  ugc:          { "15": [100, 150], "30": [150, 250], "60": [250, 400], tier: "Mid-market UGC creators" },
  ai:           { "15": [150, 200], "30": [200, 300], "60": [300, 500], tier: "AI video specialists" },
  spokesperson: { "15": [300, 500], "30": [500, 900], "60": [900, 1500], tier: "Professional presenters" }
};

function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

// Bulk discount tiers: qty -> discount fraction
function bulkDiscount(qty) {
  if (qty >= 20) return 0.25;
  if (qty >= 10) return 0.20;
  if (qty >= 4) return 0.10;
  return 0;
}

function calculate() {
  var type = document.getElementById("vtype").value;
  var length = document.getElementById("length").value;
  var qty = parseInt(document.getElementById("qty").value, 10) || 0;
  var usage = parseFloat(document.getElementById("usage").value) || 1;

  if (qty < 1) {
    alert("Please enter a quantity of at least 1 video.");
    return;
  }

  var base = RATES[type][length];
  var discount = bulkDiscount(qty);

  var perLow = base[0] * usage * (1 - discount);
  var perHigh = base[1] * usage * (1 - discount);
  var totalLow = perLow * qty;
  var totalHigh = perHigh * qty;

  document.getElementById("r-range").textContent = fmt(totalLow) + " – " + fmt(totalHigh);
  document.getElementById("r-qty").textContent = qty;
  document.getElementById("r-per").textContent = fmt(perLow) + " – " + fmt(perHigh) + " each";
  document.getElementById("r-tier").textContent =
    RATES[type].tier + (discount > 0 ? " (" + Math.round(discount * 100) + "% bulk discount applied)" : "");
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("DOMContentLoaded", calculate);
