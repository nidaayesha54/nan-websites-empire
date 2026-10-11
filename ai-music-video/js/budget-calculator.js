/* AI Music Video Budget Calculator */
const TIERS = {
  "indie":     { name:"Indie / DIY", aiSub:0,   aiPerScene:2,  crewDay:1200,  locDay:300,  gearDay:250,  editHr:40 },
  "pro":       { name:"Pro Indie",   aiSub:30,  aiPerScene:5,  crewDay:4500,  locDay:1500, gearDay:1200, editHr:90 },
  "cinematic": { name:"Cinematic",   aiSub:80,  aiPerScene:12, crewDay:12000, locDay:5000, gearDay:4000, editHr:200 }
};
function money(n){ return "$" + Math.round(n).toLocaleString("en-US"); }
function calcBudget(){
  var len = parseFloat(document.getElementById('vidLen').value) || 210;
  var scenes = parseInt(document.getElementById('scenes').value) || 12;
  var tier = TIERS[document.getElementById('tier').value];
  var lipSync = document.getElementById('lipSync').checked;
  var upscale = document.getElementById('upscale').checked;
  var avatar  = document.getElementById('avatar').checked;

  // AI costs
  var aiGen = tier.aiSub + scenes * tier.aiPerScene;
  var aiAdd = (lipSync ? 15 : 0) + (upscale ? 10 : 0) + (avatar ? 25 : 0);
  var aiEditHrs = Math.max(4, len / 60 * 2);
  var aiEdit = aiEditHrs * 25; // your own time valued
  var aiTotal = aiGen + aiAdd + aiEdit;

  // Traditional costs
  var shootDays = Math.max(1, Math.ceil(scenes / 8));
  var tradCrew = shootDays * tier.crewDay;
  var tradLoc = shootDays * tier.locDay;
  var tradGear = shootDays * tier.gearDay;
  var tradEdit = Math.max(8, len / 60 * 6) * tier.editHr;
  var tradTalent = tier.name === "Indie / DIY" ? 200 : tier.name === "Pro Indie" ? 2500 : 10000;
  var tradTotal = tradCrew + tradLoc + tradGear + tradEdit + tradTalent;

  var save = tradTotal - aiTotal;
  var pct = tradTotal > 0 ? Math.round(save / tradTotal * 100) : 0;

  var html = "<h3>💰 Estimate — " + tier.name + " · " + len + "s · " + scenes + " scenes</h3>";
  html += "<table class='plan'><tr><th>Line item</th><th>🤖 AI Production</th><th>🎥 Traditional Shoot</th></tr>";
  html += "<tr><td>Generation / shoot</td><td>" + money(aiGen) + " (subscription + " + scenes + " scenes)</td><td>" + money(tradCrew) + " (" + shootDays + " crew day" + (shootDays>1?"s":"") + ")</td></tr>";
  html += "<tr><td>Location / sets</td><td>$0 — virtual sets</td><td>" + money(tradLoc) + "</td></tr>";
  html += "<tr><td>Camera & gear</td><td>$0 — cloud rendering</td><td>" + money(tradGear) + "</td></tr>";
  html += "<tr><td>Lip-sync / upscale / avatar</td><td>" + money(aiAdd) + "</td><td>$0 (n/a)</td></tr>";
  html += "<tr><td>Talent / extras</td><td>$0 — AI performers</td><td>" + money(tradTalent) + "</td></tr>";
  html += "<tr><td>Edit & finish (" + Math.round(aiEditHrs) + "h AI / " + Math.round(Math.max(8, len/60*6)) + "h trad)</td><td>" + money(aiEdit) + "</td><td>" + money(tradEdit) + "</td></tr>";
  html += "<tr><td><strong>TOTAL</strong></td><td class='big-number'>" + money(aiTotal) + "</td><td class='big-number'>" + money(tradTotal) + "</td></tr></table>";
  html += "<p class='save'>🎉 You save ~" + money(save) + " (" + pct + "% cheaper with AI)</p>";
  html += "<h3>💡 Where the savings come from</h3><ul>"
    + "<li><strong>Zero shoot days:</strong> no crew, catering, insurance, or weather delays.</li>"
    + "<li><strong>Infinite locations:</strong> Tokyo rooftop, Mars desert — same price: $0.</li>"
    + "<li><strong>Instant reshoots:</strong> regenerate a scene in minutes instead of rebooking a set.</li>"
    + "<li>Reinvest 10% of savings into promotion — distribution beats production value.</li></ul>";
  document.getElementById('budgetResult').innerHTML = html;
}
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('calcBtn');
  if (btn) btn.addEventListener('click', calcBudget);
});
