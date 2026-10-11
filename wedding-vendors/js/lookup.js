/* VendorCompare — cost lookup logic */
(function () {
  var vendorSel = document.getElementById("vendor");
  var regionSel = document.getElementById("region");
  var quoteInput = document.getElementById("quote");
  var result = document.getElementById("result");

  Object.keys(VENDOR_DATA).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = VENDOR_DATA[k].icon + " " + VENDOR_DATA[k].name;
    vendorSel.appendChild(o);
  });
  Object.keys(REGION_MULT).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k; o.textContent = REGION_MULT[k].name;
    regionSel.appendChild(o);
  });

  function check() {
    var v = VENDOR_DATA[vendorSel.value];
    var r = adjRange(v, regionSel.value);
    var unitNote = r.unit === "per-person" ? " per person" : "";

    document.getElementById("rName").textContent = v.icon + " " + v.name;
    document.getElementById("rDesc").textContent = v.desc;
    document.getElementById("rTypical").textContent = fmt(r.typical) + unitNote + " typical";
    document.getElementById("rBand").textContent = "Fair range: " + fmt(r.low) + " – " + fmt(r.high) + unitNote + " (" + REGION_MULT[regionSel.value].name + ")";

    var q = parseFloat(quoteInput.value);
    var verdictEl = document.getElementById("rVerdict");
    if (q > 0) {
      var vd = verdictFor(q, r.typical);
      verdictEl.innerHTML = '<span class="verdict ' + vd.cls + '">Your quote ' + fmt(q) + unitNote + ": " + vd.text + "</span>";
    } else {
      verdictEl.innerHTML = "";
    }

    document.getElementById("rIncludes").innerHTML = v.includes.map(function (i) {
      return "<tr><td><span class='check'>✓</span> " + i + "</td></tr>";
    }).join("");
    document.getElementById("rFlags").innerHTML = v.redFlags.map(function (f) {
      return "<li>" + f + "</li>";
    }).join("");
    document.getElementById("rQuestions").textContent = v.questions;

    result.classList.add("show");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("checkBtn").addEventListener("click", check);
  check(); // auto-run with defaults
})();
