// AIVideoTutorials — Workflow Checklists (localStorage progress)
(function () {
  "use strict";

  var CHECKLISTS = {
    ads: {
      label: "Video Ad",
      items: [
        { t: "Lock the single offer & CTA", d: "Write the exact offer and the exact call-to-action in one sentence each." },
        { t: "Write 5 hook options", d: "First 3 seconds — pick the strongest visual + spoken hook." },
        { t: "Script the 15–30s ad", d: "Hook → problem → product → proof → CTA. Read aloud to time it." },
        { t: "Generate hero product shots", d: "3–6 AI shots: close-up, lifestyle, one 'wow' shot. One consistent style." },
        { t: "Add voiceover & music", d: "VO generated or recorded; music at −20dB under voice; cuts on beats." },
        { t: "Burn in captions", d: "Large word-by-word captions — most ad views start muted." },
        { t: "Compliance check", d: "Ad disclosure, platform ad policy, commercial-use license on the AI tool." },
        { t: "Export & launch", d: "9:16 + 1:1 versions, thumbnail frame, UTM on the link, launch & watch 48h." }
      ]
    },
    reels: {
      label: "Social Reel",
      items: [
        { t: "Pick a proven format", d: "Transformation, before/after, POV, challenge or mini-story." },
        { t: "Write the hook first", d: "Opening line/visual in the first 1–2 seconds. Open mid-action." },
        { t: "Generate 2–4 clips", d: "3–8s each, high motion, vertical 9:16, consistent character/style." },
        { t: "Choose trending audio", d: "Sound trending in your niche in the last 48 hours." },
        { t: "Edit for retention", d: "Cut every 2–3s, word-by-word captions, sync to the beat. 21–34s total." },
        { t: "Write caption + hashtags", d: "Hook line in caption, 3–5 niche hashtags, keyword-rich for search." },
        { t: "AI-label check", d: "Enable the platform's AI-generated label if required before posting." },
        { t: "Post & engage", d: "Publish at peak hours; reply to every early comment within the hour." }
      ]
    },
    explainers: {
      label: "Explainer Video",
      items: [
        { t: "Outline: problem → 3 points → takeaway", d: "One idea per scene. No more than 8 scenes for a 2-minute video." },
        { t: "Write & time the script", d: "~130–150 words/min. Scratch-record to time each scene." },
        { t: "Storyboard each scene", d: "List each scene with its exact narration line. Lock script first." },
        { t: "Set a style anchor", d: "One style phrase reused in every prompt for visual consistency." },
        { t: "Generate scene visuals", d: "5–8 scenes; regenerate any shot with warping or artifacts." },
        { t: "Record final narration", d: "Clean VO take, paced to the visuals. De-noise and level." },
        { t: "Assemble & polish", d: "Cut visuals to VO, animate key terms as text, music low underneath." },
        { t: "Export & publish", d: "1080p, chapters for YouTube, thumbnail, keyword title + description." }
      ]
    }
  };

  var STORE_KEY = "avt-checklist-v1";
  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { state = {}; }
  var current = "ads";

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function renderTabs() {
    var wrap = document.getElementById("checkTabs");
    if (!wrap) return;
    var html = "";
    for (var key in CHECKLISTS) {
      if (CHECKLISTS.hasOwnProperty(key)) {
        html += "<button data-k='" + key + "'" + (key === current ? " class='active'" : "") + ">" + CHECKLISTS[key].label + "</button>";
      }
    }
    wrap.innerHTML = html;
    var btns = wrap.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        current = this.getAttribute("data-k");
        renderTabs();
        renderList();
      });
    }
  }

  function renderList() {
    var list = document.getElementById("checkList");
    var bar = document.getElementById("progressBar");
    var label = document.getElementById("progressLabel");
    if (!list) return;
    var items = CHECKLISTS[current].items;
    if (!state[current]) state[current] = [];
    var done = 0;
    var html = "";
    for (var i = 0; i < items.length; i++) {
      var checked = !!state[current][i];
      if (checked) done++;
      html += "<label class='check-item" + (checked ? " done" : "") + "'>" +
        "<input type='checkbox' data-i='" + i + "'" + (checked ? " checked" : "") + ">" +
        "<span><span class='ct'>" + (i + 1) + ". " + items[i].t + "</span><br><span class='cd'>" + items[i].d + "</span></span>" +
        "</label>";
    }
    list.innerHTML = html;
    var pct = Math.round((done / items.length) * 100);
    if (bar) bar.style.width = pct + "%";
    if (label) label.textContent = done + " / " + items.length + " complete (" + pct + "%)";
    var boxes = list.querySelectorAll("input[type=checkbox]");
    for (var j = 0; j < boxes.length; j++) {
      boxes[j].addEventListener("change", function () {
        var idx = parseInt(this.getAttribute("data-i"), 10);
        state[current][idx] = this.checked;
        save();
        renderList();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderTabs();
    renderList();
    var reset = document.getElementById("resetChecklist");
    if (reset) {
      reset.addEventListener("click", function () {
        state[current] = [];
        save();
        renderList();
      });
    }
  });
})();
