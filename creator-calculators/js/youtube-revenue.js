// YouTube Revenue Calculator
// monthly revenue = (views / 1000) * RPM * geoFactor
function fmt(n) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

function calculate() {
  var views = parseFloat(document.getElementById("views").value) || 0;
  var nicheParts = document.getElementById("niche").value.split(",");
  var rpmMid = parseFloat(nicheParts[0]);
  var rpmLow = parseFloat(nicheParts[1]);
  var rpmHigh = parseFloat(nicheParts[2]);
  var geo = parseFloat(document.getElementById("geo").value) || 1;

  if (views < 0) views = 0;

  var low = (views / 1000) * rpmLow * geo;
  var high = (views / 1000) * rpmHigh * geo;
  var mid = (low + high) / 2;

  document.getElementById("r-range").textContent = fmt(low) + " – " + fmt(high);
  document.getElementById("r-year").textContent = fmt(mid * 12) + " / yr (midpoint)";
  document.getElementById("r-rpm").textContent = "$" + (rpmLow * geo).toFixed(2) + " – $" + (rpmHigh * geo).toFixed(2);
  document.getElementById("r-million").textContent = fmt(rpmMid * geo * 1000) + " (avg)";
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.addEventListener("DOMContentLoaded", calculate);
