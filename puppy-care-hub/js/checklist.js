/* PuppyCareHub — new puppy shopping checklist generator */
(function () {
  "use strict";

  var ITEMS = [
    {
      cat: "🍽️ Food & Feeding",
      items: [
        { name: "Puppy food (large bag, age-appropriate formula)", note: "AAFCO-balanced puppy kibble; ask breeder/vet what the pup already eats", cost: { budget: 45, mid: 65, premium: 95 } },
        { name: "Stainless steel food & water bowls", note: "Non-tip, dishwasher-safe; avoid plastic (acne, chewing)", cost: { budget: 15, mid: 25, premium: 45 } },
        { name: "Treat pouch + training treats", note: "Small, soft, pea-sized treats for reward-based training", cost: { budget: 15, mid: 25, premium: 40 } }
      ]
    },
    {
      cat: "🏠 Crate & Bedding",
      items: [
        { name: "Wire crate with divider", note: "Size for adult weight; divider keeps space cozy while growing", cost: { budget: 45, mid: 70, premium: 120 } },
        { name: "Crate pad / dog bed", note: "Machine-washable; buy one that fits inside the crate", cost: { budget: 25, mid: 50, premium: 90 } },
        { name: "Blanket for comfort", note: "Something that smells like you or the breeder's home", cost: { budget: 10, mid: 20, premium: 35 } }
      ]
    },
    {
      cat: "🦮 Walking & ID",
      items: [
        { name: "Flat collar + ID tag", note: "Engraved with your phone number — day one essential", cost: { budget: 15, mid: 30, premium: 50 } },
        { name: "6-ft leash", note: "Nylon or leather; skip retractable leashes for puppies", cost: { budget: 12, mid: 25, premium: 45 } },
        { name: "Puppy harness", note: "Front-clip style protects the neck while learning to walk", cost: { budget: 20, mid: 35, premium: 60 } }
      ]
    },
    {
      cat: "🏥 Health & Grooming",
      items: [
        { name: "First vet visit (within 3 days)", note: "Wellness exam + vaccination plan; budget $75–$150", cost: { budget: 80, mid: 120, premium: 150 } },
        { name: "Puppy shampoo", note: "Gentle, pH-balanced formula for puppies", cost: { budget: 10, mid: 16, premium: 25 } },
        { name: "Brush + nail clippers", note: "Brush matched to coat type; start nail trims early", cost: { budget: 18, mid: 30, premium: 50 } },
        { name: "Pet insurance (1st month)", note: "Enroll before any pre-existing conditions develop", cost: { budget: 25, mid: 45, premium: 70 } }
      ]
    },
    {
      cat: "🧠 Training & Enrichment",
      items: [
        { name: "Puzzle feeder / Kong", note: "Mental stimulation = a tired, happy puppy", cost: { budget: 12, mid: 20, premium: 35 } },
        { name: "Variety toy pack (chew, squeak, tug)", note: "Rotate toys weekly to keep them interesting", cost: { budget: 20, mid: 35, premium: 60 } },
        { name: "Puppy training book or online course", note: "One consistent method the whole household follows", cost: { budget: 0, mid: 40, premium: 150 } },
        { name: "Baby gates", note: "For puppy-proofing stairs and off-limits rooms", cost: { budget: 30, mid: 60, premium: 100 } }
      ]
    },
    {
      cat: "🧹 Cleanup",
      items: [
        { name: "Enzyme cleaner", note: "The ONLY thing that truly removes potty accident odor", cost: { budget: 12, mid: 18, premium: 28 } },
        { name: "Poop bags (bulk roll)", note: "You'll use more than you think — buy in bulk", cost: { budget: 10, mid: 15, premium: 22 } },
        { name: "Puppy pads (optional)", note: "Helpful for apartments; wean off them early", cost: { budget: 20, mid: 30, premium: 45 } }
      ]
    }
  ];

  var TIERS = { budget: "Budget", mid: "Mid-Range", premium: "Premium" };
  var STORAGE_KEY = "puppyCareHubChecklist";

  var tierRadios = document.querySelectorAll('input[name="tier"]');
  var resultsEl = document.getElementById("checklist-results");
  var checked = loadChecked();

  function loadChecked() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }
  function saveChecked() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch (e) {}
  }

  function money(n) { return n === 0 ? "Free" : "$" + n; }

  function itemId(catIndex, itemIndex) { return "t-" + catIndex + "-" + itemIndex; }

  function currentTier() {
    for (var i = 0; i < tierRadios.length; i++) {
      if (tierRadios[i].checked) return tierRadios[i].value;
    }
    return "mid";
  }

  function render() {
    var tier = currentTier();
    var total = 0, doneCount = 0, totalCount = 0;
    var html = "";

    ITEMS.forEach(function (section, si) {
      html += '<h3 class="cat-head">' + section.cat + "</h3>";
      section.items.forEach(function (item, ii) {
        var id = itemId(si, ii);
        var cost = item.cost[tier];
        total += cost;
        totalCount++;
        var isDone = !!checked[id];
        if (isDone) doneCount++;
        html += '<label class="check-item' + (isDone ? " done" : "") + '" data-id="' + id + '">'
          + '<input type="checkbox"' + (isDone ? " checked" : "") + ' aria-label="' + escapeHtml(item.name) + '">'
          + '<span class="item-name">' + escapeHtml(item.name)
          + '<span class="item-note">' + escapeHtml(item.note) + "</span></span>"
          + '<span class="item-cost">' + money(cost) + "</span>"
          + "</label>";
      });
    });

    var pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
    html += '<div class="total-bar"><span>💰 ' + TIERS[tier] + " total: $" + total + '</span>'
      + '<span class="pct">' + doneCount + "/" + totalCount + " packed (" + pct + "%)</span></div>";
    html += '<div class="progress-wrap"><div class="progress-bar" style="width:' + pct + '%"></div></div>';
    html += '<button type="button" class="reset-link" id="reset-checklist">Reset checklist</button>';

    resultsEl.innerHTML = html;

    resultsEl.querySelectorAll(".check-item").forEach(function (el) {
      el.addEventListener("change", function () {
        var id = el.getAttribute("data-id");
        var box = el.querySelector("input");
        if (box.checked) { checked[id] = true; el.classList.add("done"); }
        else { delete checked[id]; el.classList.remove("done"); }
        saveChecked();
        updateCounts();
      });
    });

    var resetBtn = document.getElementById("reset-checklist");
    resetBtn.addEventListener("click", function () {
      checked = {};
      saveChecked();
      render();
    });
  }

  function updateCounts() {
    var done = 0, total = 0;
    resultsEl.querySelectorAll(".check-item").forEach(function (el) {
      total++;
      if (el.querySelector("input").checked) done++;
    });
    var pct = total ? Math.round((done / total) * 100) : 0;
    var bar = resultsEl.querySelector(".total-bar .pct");
    if (bar) bar.textContent = done + "/" + total + " packed (" + pct + "%)";
    var prog = resultsEl.querySelector(".progress-bar");
    if (prog) prog.style.width = pct + "%";
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  tierRadios.forEach(function (r) { r.addEventListener("change", render); });
  render();
})();
