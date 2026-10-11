"use strict";
var TOOLS = [
  { name: "Luma Dream Machine", free: "Free tier (~30 generations/mo)", credits: "★ ★ ★ ☆", maxLen: "5–10s", quality: "Very High", imageInput: true, bestFor: "Cinematic realistic motion", price: "Paid from $29.99/mo" },
  { name: "Runway Gen-3", free: "Free trial credits (~125)", credits: "★ ★ ★ ☆", maxLen: "5–16s", quality: "Very High", imageInput: true, bestFor: "Pro-quality, longer clips", price: "Paid from $15/mo" },
  { name: "Pika 2", free: "Free tier (daily credits)", credits: "★ ★ ★ ★", maxLen: "5–10s", quality: "High", imageInput: true, bestFor: "Fun effects, quick clips", price: "Paid from $8/mo" },
  { name: "Leonardo Motion", free: "Free tier (daily tokens)", credits: "★ ★ ★ ★", maxLen: "4s", quality: "High", imageInput: true, bestFor: "AI art & character animation", price: "Paid from $12/mo" },
  { name: "Kling 1.6", free: "Free trial credits", credits: "★ ★ ☆ ☆", maxLen: "5–10s", quality: "Very High", imageInput: true, bestFor: "Photorealistic humans", price: "Paid plans available" },
  { name: "Haiper", free: "Free tier (limited)", credits: "★ ★ ★ ☆", maxLen: "4s", quality: "Good", imageInput: true, bestFor: "Simple quick animations", price: "Paid plans available" }
];

function renderTable(sortKey) {
  var rows = TOOLS.slice();
  if (sortKey) rows.sort(function (a, b) { return String(a[sortKey]).localeCompare(String(b[sortKey])); });
  var tb = document.getElementById("cmpBody");
  tb.innerHTML = "";
  rows.forEach(function (t) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td><strong>" + t.name + "</strong></td>" +
      "<td>" + t.free + "<br><small>" + t.credits + "</small></td>" +
      "<td>" + t.maxLen + "</td>" +
      "<td>" + t.quality + "</td>" +
      "<td>" + (t.imageInput ? "✅ Yes" : "❌ No") + "</td>" +
      "<td>" + t.bestFor + "</td>" +
      "<td>" + t.price + "</td>";
    tb.appendChild(tr);
  });
}

function filterTools() {
  var q = document.getElementById("cmpSearch").value.toLowerCase();
  var sort = document.getElementById("cmpSort").value;
  var rows = TOOLS.filter(function (t) {
    return (t.name + t.free + t.bestFor + t.quality).toLowerCase().indexOf(q) !== -1;
  });
  if (sort) rows.sort(function (a, b) { return String(a[sort]).localeCompare(String(b[sort])); });
  var tb = document.getElementById("cmpBody");
  tb.innerHTML = "";
  rows.forEach(function (t) {
    var tr = document.createElement("tr");
    tr.innerHTML =
      "<td><strong>" + t.name + "</strong></td>" +
      "<td>" + t.free + "<br><small>" + t.credits + "</small></td>" +
      "<td>" + t.maxLen + "</td>" +
      "<td>" + t.quality + "</td>" +
      "<td>✅ Yes</td>" +
      "<td>" + t.bestFor + "</td>" +
      "<td>" + t.price + "</td>";
    tb.appendChild(tr);
  });
  document.getElementById("cmpCount").textContent = rows.length + " tool(s) shown";
}

function recommend() {
  var use = document.getElementById("recUse").value;
  var budget = document.getElementById("recBudget").value;
  var map = {
    "portraits": "Kling 1.6 — best photorealistic humans; Luma Dream Machine as free backup.",
    "products": "Runway Gen-3 — sharpest commercial motion; Leonardo Motion for stylized product art.",
    "landscapes": "Luma Dream Machine — stunning natural camera moves and water/sky physics.",
    "fun": "Pika 2 — generous free daily credits and playful effects."
  };
  var extra = budget === "free" ? " Stay on the free tier; generate during off-peak hours to avoid queues." : " A $8–15/mo starter plan unlocks 10x more generations.";
  document.getElementById("recOut").innerHTML = "<strong>🏆 Recommended:</strong> " + map[use] + extra;
}

document.addEventListener("DOMContentLoaded", function () {
  renderTable();
  document.getElementById("cmpSearch").addEventListener("input", filterTools);
  document.getElementById("cmpSort").addEventListener("change", filterTools);
  document.getElementById("recBtn").addEventListener("click", recommend);
});
