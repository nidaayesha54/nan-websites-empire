// प्रति घंटा रेट कैलकुलेटर — Hindi Freelance Rate Calculator
(function () {
  function fmt(n) {
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function calc() {
    var income = parseFloat(document.getElementById("income").value) || 0;
    var hours = parseFloat(document.getElementById("hours").value) || 0;
    var expenses = parseFloat(document.getElementById("expenses").value) || 0;
    var tax = parseFloat(document.getElementById("tax").value) || 0;

    var err = document.getElementById("calc-error");
    var res = document.getElementById("results");
    err.style.display = "none";

    if (hours <= 0) {
      err.textContent = "कृपया बिल वाले घंटे 0 से ज़्यादा डालें।";
      err.style.display = "block";
      res.classList.remove("show");
      return;
    }
    if (income < 0 || expenses < 0 || tax < 0 || tax >= 100) {
      err.textContent = "कृपया सही मान डालें (टैक्स 0–99% के बीच)।";
      err.style.display = "block";
      res.classList.remove("show");
      return;
    }

    var totalNeeded = income + expenses;
    var baseRate = totalNeeded / hours;
    var taxFactor = 1 - tax / 100;
    var grossRate = baseRate / taxFactor;
    var recommended = grossRate * 1.1; // 10% buffer
    var monthlyGross = recommended * hours;

    document.getElementById("r-min").textContent = fmt(baseRate);
    document.getElementById("r-min-note").textContent =
      "इतना कमाने पर आपके खर्च पूरे होंगे, लेकिन टैक्स और छुट्टियों का हिसाब नहीं है।";
    document.getElementById("r-rec").textContent = fmt(recommended);
    document.getElementById("r-rec-note").textContent =
      "टैक्स (" + tax + "%) + 10% सुरक्षा मार्जिन के साथ आपकी असली रेट।";
    document.getElementById("r-monthly").textContent = fmt(monthlyGross);
    document.getElementById("r-monthly-note").textContent =
      "इस रेट पर " + hours + " घंटे काम करने से अनुमानित मासिक कमाई।";

    res.classList.add("show");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calc-btn").addEventListener("click", calc);
    calc(); // auto-run with defaults
  });
})();
