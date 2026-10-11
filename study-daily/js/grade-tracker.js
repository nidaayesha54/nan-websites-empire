/* Study Daily — Grade tracker (vanilla JS, no dependencies) */
(function () {
  "use strict";
  var tbody = document.getElementById("gt-body");
  var result = document.getElementById("gt-result");
  var resultTitle = document.getElementById("gt-result-title");
  var resultBody = document.getElementById("gt-result-body");

  function letterGrade(pct) {
    if (pct >= 97) return "A+"; if (pct >= 93) return "A"; if (pct >= 90) return "A-";
    if (pct >= 87) return "B+"; if (pct >= 83) return "B"; if (pct >= 80) return "B-";
    if (pct >= 77) return "C+"; if (pct >= 73) return "C"; if (pct >= 70) return "C-";
    if (pct >= 67) return "D+"; if (pct >= 63) return "D"; if (pct >= 60) return "D-";
    return "F";
  }
  function num(id, fallback) {
    var el = document.getElementById(id);
    var v = parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  }
  function addRow(name, weight, earned, possible) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td><input type="text" class="gt-name" placeholder="e.g. Midterm" value="' + (name || "") + '"></td>' +
      '<td><input type="number" class="gt-weight" min="0" max="100" step="any" placeholder="%" value="' + (weight || "") + '"></td>' +
      '<td><input type="number" class="gt-earned" min="0" step="any" placeholder="points" value="' + (earned || "") + '"></td>' +
      '<td><input type="number" class="gt-possible" min="0" step="any" placeholder="points" value="' + (possible || "") + '"></td>' +
      '<td><button type="button" class="remove-row" aria-label="Remove row">✕</button></td>';
    tr.querySelector(".remove-row").addEventListener("click", function () {
      tr.remove(); calculate();
    });
    tbody.appendChild(tr);
    tr.querySelectorAll("input").forEach(function (i) {
      i.addEventListener("input", calculate);
    });
    return tr;
  }
  function calculate() {
    var rows = tbody.querySelectorAll("tr");
    var totalWeight = 0, weightedSum = 0, gradedWeight = 0;
    rows.forEach(function (tr) {
      var w = parseFloat(tr.querySelector(".gt-weight").value);
      var e = parseFloat(tr.querySelector(".gt-earned").value);
      var p = parseFloat(tr.querySelector(".gt-possible").value);
      if (isNaN(w) || w <= 0) return;
      totalWeight += w;
      if (!isNaN(e) && !isNaN(p) && p > 0) {
        weightedSum += (e / p) * w;
        gradedWeight += w;
      }
    });
    result.classList.add("show");
    if (gradedWeight <= 0) {
      resultTitle.textContent = "Add your grades";
      resultBody.innerHTML = "<p>Enter assignment weights and your scores above — your projected grade appears here.</p>";
      return;
    }
    var current = (weightedSum / gradedWeight) * 100;
    var html = '<p>Your current grade: <span class="big">' + current.toFixed(1) + "% (" +
      letterGrade(current) + ")</span></p>";
    html += "<p>Based on " + gradedWeight.toFixed(0) + "% of coursework graded.</p>";

    // What-if: what score is needed on remaining work for target grades?
    var remaining = totalWeight - gradedWeight;
    if (remaining > 0.001) {
      var targets = [90, 80, 70];
      html += "<p><strong>What you need on the remaining " + remaining.toFixed(0) +
        "% to finish with:</strong></p><ul style='list-style:none;padding:0'>";
      targets.forEach(function (t) {
        var need = ((t - weightedSum) / remaining) * 100;
        var txt = need <= 0 ? "already secured ✓"
          : need > 100 ? "not possible (" + need.toFixed(0) + "% needed)"
          : need.toFixed(1) + "% average needed";
        html += "<li>" + t + "% (" + letterGrade(t) + "): " + txt + "</li>";
      });
      html += "</ul>";
    }
    if (Math.abs(totalWeight - 100) > 0.01 && totalWeight > 0) {
      html += "<p>⚠️ Weights add up to " + totalWeight.toFixed(0) +
        "% — they should total 100% for an accurate projection.</p>";
    }
    resultTitle.textContent = "Your Grade Projection";
    resultBody.innerHTML = html;
  }
  document.getElementById("gt-add").addEventListener("click", function () { addRow(); });
  document.getElementById("gt-example").addEventListener("click", function () {
    tbody.innerHTML = "";
    addRow("Homework", 20, 85, 100);
    addRow("Midterm", 30, 78, 100);
    addRow("Project", 20, "", 100);
    addRow("Final Exam", 30, "", 100);
    calculate();
  });
  document.getElementById("gt-clear").addEventListener("click", function () {
    tbody.innerHTML = "";
    addRow(); addRow(); addRow();
    result.classList.remove("show");
  });
  // Seed with 3 empty rows
  addRow(); addRow(); addRow();
})();
