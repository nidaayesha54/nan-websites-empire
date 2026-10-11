// AIReelsMaker — Reels Posting Schedule Planner
(function(){
"use strict";
var PILLARS = {
  "Growth": [
    ["Hook reel", "A high-retention hook-first reel designed for shares.", "Comment your take 👇"],
    ["Trend remix", "Your niche spin on a trending sound/format.", "Follow for daily remixes"],
    ["Value bomb", "One actionable tip, fast-paced captions.", "Save this for later"],
    ["Story reel", "Personal/behind-the-scenes story in your niche.", "Share with a friend"],
    ["Myth-bust", "Debunk a common myth — sparks comments.", "Agree or disagree? 👇"],
    ["List reel", "3–5 quick tips in list format.", "Save + follow"],
    ["Loop reel", "Seamless loop so it replays automatically.", "Watch till the end 👀"]
  ],
  "Leads": [
    ["Problem reel", "Name your audience's #1 pain + tease the fix.", "DM me \"HELP\""],
    ["Authority reel", "Proof, results, or credentials — build trust.", "Link in bio"],
    ["Value bomb", "Teach one thing fully — generosity converts.", "Save this for later"],
    ["FAQ reel", "Answer the question prospects always ask.", "DM your question"],
    ["Story reel", "Client win / personal journey story.", "Link in bio to start"],
    ["Myth-bust", "Break a misconception your buyers hold.", "Comment \"INFO\""],
    ["Offer teaser", "Soft pitch: what you do + who it's for.", "Link in bio 🔗"]
  ],
  "Sales": [
    ["Demo reel", "Show the product/service in action.", "Shop link in bio"],
    ["Result reel", "Before/after or transformation proof.", "Get yours — link in bio"],
    ["Urgency reel", "Limited offer, countdown, or bonus.", "Offer ends soon ⏰"],
    ["Review reel", "Customer testimonial or unboxing.", "Tap to shop"],
    ["Value bomb", "Free tip related to your product.", "Full version in bio"],
    ["Story reel", "Founder story — why you built it.", "Support us — link in bio"],
    ["FAQ reel", "Handle the #1 purchase objection.", "Questions? DM us"]
  ]
};
var TIMES = {
  "USA": "7–9 PM ET",
  "UK/Europe": "6–8 PM GMT",
  "Pakistan/India": "8–10 PM PKT",
  "Global": "12 PM + 7 PM ET (two windows)"
};
var DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
function esc(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function plan(){
  var niche = (document.getElementById("niche").value || "your niche").trim();
  var goal = document.getElementById("goal").value;
  var perWeek = parseInt(document.getElementById("perweek").value, 10);
  var audience = document.getElementById("audience").value;
  var pillars = PILLARS[goal];
  var time = TIMES[audience];

  var html = '<h3 style="margin:18px 0 6px">📅 Your weekly plan — '+esc(niche)+' · '+esc(goal)+' goal</h3>';
  html += '<div class="note"><strong>Posting window:</strong> '+esc(time)+' · <strong>'+perWeek+' reels/week</strong> · Post consistently at the same time; batch-film on weekends.</div>';
  html += '<table class="plan"><tr><th>Day</th><th>Reel type</th><th>Topic angle ('+esc(niche)+')</th><th>CTA</th></tr>';

  var spread = perWeek >= 7 ? DAYS : pickDays(perWeek);
  var pi = 0;
  DAYS.forEach(function(day){
    if(spread.indexOf(day) === -1){
      html += '<tr><td><strong>'+day+'</strong></td><td colspan="3" style="color:#999">Rest / engage: reply to comments, like niche posts (30 min)</td></tr>';
      return;
    }
    var p = pillars[pi % pillars.length]; pi++;
    html += '<tr><td><strong>'+day+'</strong></td><td>'+esc(p[0])+'</td><td>'+esc(p[1])+'</td><td>'+esc(p[2])+'</td></tr>';
  });
  html += '</table>';

  html += '<div class="script-block"><h4>⚡ Planner rules for '+esc(goal.toLowerCase())+'-focused accounts</h4><ul>';
  var rules = {
    "Growth": ["First 3 seconds decide everything — hook or die.","Reply to every comment in the first hour.","Post at the same time daily so the algorithm learns your slot.","One niche only — mixed niches confuse the algorithm."],
    "Leads": ["Every 4th reel should softly pitch your offer.","Pin your best authority reel to your profile.","Use story polls to segment your audience.","DM everyone who comments — conversations convert."],
    "Sales": ["Show the product in the first 5 seconds.","Pin your top-converting demo reel.","Answer purchase objections in comments publicly.","Track which reel type drives bio-link clicks and double down."]
  }[goal];
  rules.forEach(function(r){ html += '<li>'+esc(r)+'</li>'; });
  html += '</ul></div>';

  var text = "WEEKLY PLAN ("+niche+", "+goal+")\nPosting window: "+time+"\n";
  spread.forEach(function(day, i){ var p = pillars[i % pillars.length]; text += day+": "+p[0]+" — "+p[2]+"\n"; });
  html += '<button class="go" onclick="copyText(\''+jsq(text)+'\', this)">📋 Copy weekly plan</button>';
  document.getElementById("results").innerHTML = html;
}
function pickDays(n){
  // spread across the week: always include weekend-adjacent high-traffic days
  var order = ["Monday","Wednesday","Friday","Tuesday","Thursday","Saturday","Sunday"];
  return order.slice(0, n);
}
function jsq(s){ return s.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n"); }
window.makePlan = plan;
})();
