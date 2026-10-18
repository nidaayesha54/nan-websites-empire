/* NAN Virtual Office dashboard — renders bots.json client-side */
(function () {
  "use strict";

  var state = { bots: [], departments: [], deptFilter: "all", query: "" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function tickClock() {
    var el = document.getElementById("pktClock");
    try {
      el.textContent = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
      }).format(new Date());
    } catch (e) {
      el.textContent = new Date().toLocaleTimeString();
    }
  }

  function filteredBots() {
    var q = state.query.trim().toLowerCase();
    return state.bots.filter(function (b) {
      if (state.deptFilter !== "all" && b.dept !== state.deptFilter) return false;
      if (q && (b.name + " " + b.role + " " + (b.id || "")).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
  }

  function renderStats() {
    var active = state.bots.filter(function (b) { return b.status === "active"; }).length;
    var onDemand = state.bots.length - active;
    var cards = [
      ["Total Bots", state.bots.length],
      ["🟢 Active Now", active],
      ["🟡 On-Demand", onDemand],
      ["Departments", state.departments.length]
    ];
    document.getElementById("stats").innerHTML = cards.map(function (c) {
      return '<div class="stat"><div class="num">' + c[1] + '</div><div class="lbl">' + esc(c[0]) + "</div></div>";
    }).join("");
    document.getElementById("footCount").textContent = state.bots.length + "+";
  }

  function renderFilters() {
    var btns = [{ id: "all", icon: "🏢", name: "All" }].concat(state.departments);
    document.getElementById("deptFilters").innerHTML = btns.map(function (d) {
      var cls = "fbtn" + (state.deptFilter === d.id ? " active" : "");
      return '<button class="' + cls + '" data-dept="' + esc(d.id) + '">' + esc(d.icon) + " " + esc(d.name) + "</button>";
    }).join("");
    var btnEls = document.querySelectorAll("#deptFilters .fbtn");
    for (var i = 0; i < btnEls.length; i++) {
      btnEls[i].addEventListener("click", function () {
        state.deptFilter = this.getAttribute("data-dept");
        renderFilters();
        renderDepartments();
      });
    }
  }

  function cardHtml(b) {
    var active = b.status === "active";
    var powers = (b.powers || []).map(function (p) {
      return '<span class="chip">' + esc(p) + "</span>";
    }).join("");
    return (
      '<article class="card">' +
      '<div class="card-top"><h3>' + esc(b.name) + '</h3>' +
      '<span class="idbadge">' + esc(b.id) + "</span></div>" +
      '<p class="role">' + esc(b.role) + "</p>" +
      '<p class="schedule">⏰ ' + esc(b.schedule) + "</p>" +
      '<span class="badge ' + (active ? "on" : "off") + '">' +
      (active ? "🟢 Active" : "🟡 On-demand") + "</span>" +
      '<div class="powers">' + powers + "</div>" +
      "</article>"
    );
  }

  function renderDepartments() {
    var bots = filteredBots();
    var byDept = {};
    bots.forEach(function (b) {
      (byDept[b.dept] = byDept[b.dept] || []).push(b);
    });
    var html = state.departments.map(function (d) {
      var list = byDept[d.id] || [];
      if (!list.length) return "";
      return (
        '<div class="dept"><div class="dept-head">' +
        '<span class="dicon">' + esc(d.icon) + "</span><h2>" + esc(d.name) + "</h2>" +
        '<span class="count">' + list.length + " bots</span></div>" +
        '<div class="grid">' + list.map(cardHtml).join("") + "</div></div>"
      );
    }).join("");
    document.getElementById("departments").innerHTML = html;
    document.getElementById("noResults").hidden = bots.length > 0;
  }

  function init(data) {
    state.bots = data.bots || [];
    state.departments = data.departments || [];
    renderStats();
    renderFilters();
    renderDepartments();
    document.getElementById("searchBox").addEventListener("input", function (e) {
      state.query = e.target.value;
      renderDepartments();
    });
    tickClock();
    setInterval(tickClock, 1000);
  }

  fetch("bots.json")
    .then(function (r) { if (!r.ok) throw new Error("bots.json " + r.status); return r.json(); })
    .then(init)
    .catch(function (err) {
      document.getElementById("departments").innerHTML =
        '<p class="no-results">⚠️ Could not load bot roster: ' + esc(err.message) + "</p>";
    });
})();
