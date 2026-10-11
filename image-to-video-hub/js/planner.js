"use strict";
var PHASES = [
  { title: "1️⃣ Image Prep", items: ["Source image is high resolution (1080p+)", "Subject is centered with space around edges", "No text or logos on the image (they warp)", "Faces are clear and front-facing if animated", "Aspect ratio matches target platform (16:9 / 9:16)"] },
  { title: "2️⃣ Prompt Writing", items: ["Subject named clearly", "Specific motion described (not 'move')", "Camera move chosen", "Mood/lighting set", "Prompt under tool character limit", "Generated prompt via Motion Prompt Generator"] },
  { title: "3️⃣ Generation", items: ["Tool chosen from comparator", "Free credits confirmed available", "Seed set for consistency (if chaining clips)", "2–3 variations generated", "Best take picked"] },
  { title: "4️⃣ Edit & Publish", items: ["Clip trimmed to best seconds", "Jittery frames cut", "Music/SFX added", "AI-generated label/disclosure added", "Exported at platform resolution", "Posted at USA prime time (7–9 PM ET)"] }
];

var state = {};
try { state = JSON.parse(localStorage.getItem("itv_planner") || "{}"); } catch (e) { state = {}; }

function render() {
  var box = document.getElementById("phases");
  box.innerHTML = "";
  var total = 0, done = 0;
  PHASES.forEach(function (ph, pi) {
    var h = document.createElement("h3");
    h.textContent = ph.title;
    h.style.margin = "22px 0 8px";
    box.appendChild(h);
    var wrap = document.createElement("div");
    wrap.className = "checklist";
    ph.items.forEach(function (item, ii) {
      var key = pi + "-" + ii;
      total++;
      if (state[key]) done++;
      var lab = document.createElement("label");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!state[key];
      cb.addEventListener("change", function () {
        state[key] = cb.checked;
        try { localStorage.setItem("itv_planner", JSON.stringify(state)); } catch (e) {}
        updateProgress(total, done + (cb.checked ? 1 : -1));
        cb.parentElement.style.opacity = cb.checked ? ".55" : "1";
      });
      lab.appendChild(cb);
      var sp = document.createElement("span");
      sp.textContent = item;
      lab.appendChild(sp);
      if (state[key]) lab.style.opacity = ".55";
      wrap.appendChild(lab);
    });
    box.appendChild(wrap);
  });
  updateProgress(total, done);
  var proj = document.getElementById("projName");
  proj.value = state._name || "";
  proj.addEventListener("input", function () { state._name = proj.value; save(); });
  var notes = document.getElementById("projNotes");
  notes.value = state._notes || "";
  notes.addEventListener("input", function () { state._notes = notes.value; save(); });
}

function updateProgress(total, done) {
  var pct = total ? Math.round(done / total * 100) : 0;
  document.getElementById("pbar").style.width = pct + "%";
  document.getElementById("ptext").textContent = done + "/" + total + " steps done (" + pct + "%)";
}

function save() { try { localStorage.setItem("itv_planner", JSON.stringify(state)); } catch (e) {} }

function resetAll() {
  if (confirm("Reset the whole checklist?")) {
    state = {}; try { localStorage.removeItem("itv_planner"); } catch (e) {}
    render();
  }
}

function exportPlan() {
  var lines = ["IMAGE-TO-VIDEO PROJECT PLAN", "Project: " + (state._name || "(unnamed)"), ""];
  PHASES.forEach(function (ph, pi) {
    lines.push(ph.title);
    ph.items.forEach(function (item, ii) {
      lines.push((state[pi + "-" + ii] ? "[x] " : "[ ] ") + item);
    });
    lines.push("");
  });
  lines.push("Notes: " + (state._notes || "-"));
  var blob = new Blob([lines.join("\n")], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "image-to-video-plan.txt";
  a.click();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
}

document.addEventListener("DOMContentLoaded", function () {
  render();
  document.getElementById("resetBtn").addEventListener("click", resetAll);
  document.getElementById("exportBtn").addEventListener("click", exportPlan);
});
