// फीवरी/अपवर्क फीस कैलकुलेटर — Platform Fee Calculator
(function () {
  var FEES = {
    fiverr: { rate: 0.20, name: "Fiverr" },
    upwork: { rate: 0.10, name: "Upwork" },
    upwork_vip: { rate: 0.05, name: "Upwork (पुराना क्लाइंट, $10k+)" }
  };

  function fmt(n, cur) {
    if (cur === "USD") return "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    return "₹" + Math.round(n).toLocaleString("en-IN");
  }

  function calc() {
    var amount = parseFloat(document.getElementById("amount").value) || 0;
    var platform = document.getElementById("platform").value;
    var currency = document.getElementById("currency").value;

    var err = document.getElementById("calc-error");
    var res = document.getElementById("results");
    err.style.display = "none";

    if (amount <= 0) {
      err.textContent = "कृपया प्रोजेक्ट की राशि 0 से ज़्यादा डालें।";
      err.style.display = "block";
      res.classList.remove("show");
      return;
    }

    var fee = FEES[platform];
    var feeAmt = amount * fee.rate;
    var net = amount - feeAmt;

    document.getElementById("r-platform").textContent = fee.name;
    document.getElementById("r-fee").textContent = fmt(feeAmt, currency) + " (" + Math.round(fee.rate * 100) + "%)";
    document.getElementById("r-net").textContent = fmt(net, currency);
    document.getElementById("r-note").textContent =
      currency === "INR"
        ? "नोट: पेमेंट गेटवे (Payoneer/PayPal) का 1–3% अलग से कट सकता है।"
        : "Note: Payoneer/PayPal may deduct an additional 1–3%.";

    res.classList.add("show");
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("calc-btn").addEventListener("click", calc);
    document.getElementById("currency").addEventListener("change", calc);
    document.getElementById("platform").addEventListener("change", calc);
    calc(); // auto-run with defaults
  });
})();
