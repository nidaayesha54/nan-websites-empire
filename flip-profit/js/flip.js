/* FlipProfit — fix-and-flip calculator logic (vanilla JS) */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };

  function num(id) {
    var v = parseFloat($("in-" + id).value);
    return isNaN(v) || v < 0 ? 0 : v;
  }

  function money(n) {
    if (!isFinite(n)) return "$0";
    var sign = n < 0 ? "-" : "";
    n = Math.abs(Math.round(n));
    return sign + "$" + n.toLocaleString("en-US");
  }

  function pct(n) {
    if (!isFinite(n)) return "0%";
    return (Math.round(n * 10) / 10).toLocaleString("en-US") + "%";
  }

  function setVerdict(el, cls, html) {
    el.className = "verdict " + cls;
    el.innerHTML = html;
    el.style.display = "block";
  }

  function calc() {
    var purchase = num("purchase"),
        rehab = num("rehab"),
        arv = num("arv"),
        months = num("months"),
        monthly = num("holding"),
        sellPct = num("sell") / 100;

    if (arv <= 0) {
      $("flip-results").style.display = "none";
      $("flip-verdict").style.display = "none";
      return;
    }

    var holdingTotal = months * monthly;
    var sellingTotal = arv * sellPct;
    var totalCost = purchase + rehab + holdingTotal + sellingTotal;
    var profit = arv - totalCost;
    var totalInvested = purchase + rehab + holdingTotal; // cash in (before sale)
    var roi = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;

    // 70% rule: max purchase price = ARV * 0.70 - rehab
    var maxBuy = arv * 0.7 - rehab;
    var rule70Pass = purchase <= maxBuy;

    // MAO with target profit margin of 15% of ARV (investor standard)
    var targetProfit = arv * 0.15;
    var mao = arv - rehab - holdingTotal - sellingTotal - targetProfit;

    $("r-costs").textContent = money(totalCost);
    $("r-purchase").textContent = money(purchase);
    $("r-rehab").textContent = money(rehab);
    $("r-holding").textContent = money(holdingTotal);
    $("r-selling").textContent = money(sellingTotal);
    $("r-profit").textContent = money(profit);
    $("r-profit").className = "v " + (profit >= 0 ? "v-pos" : "v-neg");
    $("r-roi").textContent = pct(roi);
    $("r-roi").className = "v " + (roi >= 20 ? "v-pos" : roi >= 0 ? "v-warn" : "v-neg");
    $("r-mao").textContent = money(mao);
    $("r-70rule").textContent = rule70Pass ? "PASS ✓" : "FAIL ✗";
    $("r-70rule").className = "v " + (rule70Pass ? "v-pos" : "v-neg");

    $("flip-results").style.display = "block";

    var v = $("flip-verdict");
    if (profit > 0 && rule70Pass && roi >= 15) {
      setVerdict(v, "good", "<strong>Strong deal.</strong> Positive profit, passes the 70% rule, and ROI is healthy. Run your comps one more time before you commit.");
    } else if (profit > 0) {
      setVerdict(v, "meet", "<strong>Marginal deal.</strong> It shows a profit, but it fails a key safety check (70% rule or ROI). Tighten your offer price or negotiate rehab costs down.");
    } else {
      setVerdict(v, "bad", "<strong>Walk away.</strong> This deal loses money at the current numbers. Your offer must be at or below <strong>" + money(mao) + "</strong> to hit a safe 15% margin.");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var inputs = document.querySelectorAll("#flip-form input");
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", calc);
    }
    var faq = document.querySelectorAll(".faq-q");
    for (var j = 0; j < faq.length; j++) {
      faq[j].addEventListener("click", function () {
        this.parentElement.classList.toggle("open");
      });
    }
    calc();
  });
})();
