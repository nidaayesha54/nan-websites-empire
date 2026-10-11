// AIReelsMaker — Viral Hook Generator
(function(){
"use strict";
var DATA = {
  "Fitness": {
    topic: "your workout routine",
    keys: ["your workout routine","your diet","your fitness progress","your gym sessions"],
    templates: {
      Question: ["Why is nobody talking about this {k} mistake?","Are you sabotaging {k} without knowing it?","What if everything you know about {k} is wrong?","Still struggling with {k}? Watch this."],
      Shock: ["I wasted 2 years on {k} before learning this.","Nobody tells beginners this about {k}.","Stop doing {k} like this.","This {k} truth will make you angry."],
      List: ["3 {k} mistakes killing your progress","5 {k} tips that actually work in 2026","7 signs {k} is working (you'll miss #4)","The only 3 {k} rules you need"],
      Story: ["How I fixed {k} in 30 days","I tried this {k} hack for 90 days — results shocked me","My {k} transformation: what actually changed","Day 1 vs Day 60 of fixing {k}"],
      Myth: ["The biggest myth about {k} — debunked","{k} advice from 2019 is holding you back","Stop believing this {k} lie","Experts don't want you to know this about {k}"]
    }
  },
  "Finance": {
    topic: "your money habits",
    keys: ["your money habits","your savings","your investments","your budget"],
    templates: {
      Question: ["Why are you still broke with {k} like this?","What would you do with $10k extra from {k}?","Are {k} quietly making you poorer?","Why doesn't anyone teach this about {k}?"],
      Shock: ["Banks don't want you to know this about {k}.","I lost $4,000 before fixing {k}.","Rich people treat {k} completely differently.","This {k} trick is borderline unfair."],
      List: ["5 {k} rules the wealthy follow","3 {k} mistakes to avoid in 2026","7 {k} secrets that compound fast","The 1 {k} habit that changed everything"],
      Story: ["How I fixed {k} on a low income","From paycheck-to-paycheck to saving 30%: my {k} story","What 6 months of disciplined {k} did for me","I tracked {k} for 100 days — here's the data"],
      Myth: ["The #1 myth about {k} — debunked","Stop following this outdated {k} advice","{k} gurus are lying about one thing","The truth about {k} nobody posts"]
    }
  },
  "Food": {
    topic: "this recipe",
    keys: ["this recipe","your cooking","your meal prep","your snacks"],
    templates: {
      Question: ["Why does this {k} only take 10 minutes?","Have you been cooking {k} wrong your whole life?","What makes this {k} go viral every time?","Can 3 ingredients really make this {k}?"],
      Shock: ["This {k} broke my group chat.","I've made this {k} 47 times. Zero regrets.","Stop ordering takeout — make this {k} instead.","The {k} restaurants don't want you making at home."],
      List: ["3 ingredients. One viral {k}.","5 {k} hacks that save 20 minutes","7 {k} combos that shouldn't work (but do)","The only {k} recipe you need in 2026"],
      Story: ["Rating my grandma's {k} after 10 years","I cooked this {k} for a chef — his reaction…","My {k} failed 5 times before this version","Taste-testing viral {k} so you don't have to"],
      Myth: ["Stop making this {k} mistake","The {k} myth restaurants spread","Why your {k} is bland (fix in 10 seconds)","This {k} rule is actually wrong"]
    }
  },
  "Fashion": {
    topic: "your outfits",
    keys: ["your outfits","your wardrobe","your style","your closet"],
    templates: {
      Question: ["Why does this $20 outfit look designer?","Are you wearing {k} wrong?","What if your closet already has the perfect outfit?","Still buying fast fashion for {k}?"],
      Shock: ["This thrift flip shocked my followers.","I styled {k} 5 ways from one bag.","Stylists hate this {k} shortcut.","Nobody believes this outfit cost under $25."],
      List: ["5 {k} upgrades under $10","3 {k} trends to steal in 2026","7 {k} mistakes making you look cheap","One piece, 5 {k} — watch"],
      Story: ["Thrift flip: $8 jacket to designer look","I let a stylist raid my closet for {k}","My {k} glow-up: before and after","Wearing the same {k} 7 days straight"],
      Myth: ["Stop believing this {k} myth","Fashion rules that are officially dead","Why expensive {k} isn't better","The {k} lie influencers sell you"]
    }
  },
  "Travel": {
    topic: "your next trip",
    keys: ["your next trip","your travel plans","your vacation","your itinerary"],
    templates: {
      Question: ["Why is everyone sleeping on this destination?","What if {k} cost half of what you think?","Still overpaying for {k}?","Would you visit this place for $30/day?"],
      Shock: ["This place looks fake. It's real.","I found paradise 2 hours from the city.","Skip the tourist traps — do this for {k}.","The cheapest {k} hack of 2026."],
      List: ["5 hidden spots for {k}","3 {k} mistakes that waste money","7-day {k} under $500 — full breakdown","10 {k} tips locals actually use"],
      Story: ["I planned {k} in 24 hours — here's how","My $400 {k} that felt like $4,000","Solo trip diaries: {k} edition","What went wrong on {k} (so yours won't)"],
      Myth: ["Stop believing this {k} myth","Travel influencers lie about {k}","Why peak season ruins {k}","The {k} advice that's actually a scam"]
    }
  },
  "Motivation": {
    topic: "your mindset",
    keys: ["your mindset","your mornings","your discipline","your goals"],
    templates: {
      Question: ["What if {k} is the only thing holding you back?","Why do you keep quitting on {k}?","Are you busy or just avoiding {k}?","What would future-you say about {k}?"],
      Shock: ["Nobody is coming to fix {k}.","Your comfort zone is killing {k}.","This 2-minute {k} reset changed my life.","Stop waiting. Start {k}."],
      List: ["5 {k} rules for 2026","3 {k} habits of unstoppable people","7 brutal truths about {k}","The 1% {k} rule explained"],
      Story: ["How I rebuilt {k} from rock bottom","365 days of {k}: the honest recap","I almost gave up on {k} — then this happened","My {k} before coffee vs after"],
      Myth: ["Motivation is a myth — do this instead","Stop waiting to 'feel ready' for {k}","The {k} lie keeping you stuck","Discipline beats motivation: proof"]
    }
  },
  "Pets": {
    topic: "your pet",
    keys: ["your pet","your dog","your cat","your furry friend"],
    templates: {
      Question: ["Why does {k} do this weird thing?","Is {k} secretly judging you?","What is {k} trying to tell you?","Does {k} actually understand you?"],
      Shock: ["{k} did the unthinkable today.","POV: {k} runs the household.","Wait for {k}'s reaction at the end.","{k} understood the assignment."],
      List: ["5 signs {k} loves you","3 {k} tricks to teach this week","7 things {k} wishes you knew","{k} morning routine (too cute)"],
      Story: ["Rescue to spoiled: {k}'s glow-up","A day in the life of {k}","{k}'s first snow — pure joy","Teaching {k} one new trick daily"],
      Myth: ["Stop believing this {k} myth","Vets wish you knew this about {k}","The {k} mistake most owners make","Why {k} misbehaves (it's not stubbornness)"]
    }
  },
  "Tech & AI": {
    topic: "your workflow",
    keys: ["your workflow","your content","your business","your daily tasks"],
    templates: {
      Question: ["Why is everyone using this AI for {k}?","What if AI did {k} for you?","Still doing {k} manually in 2026?","Which AI tool wins for {k}?"],
      Shock: ["This AI does {k} in 10 seconds.","I replaced 3 apps with one AI for {k}.","Nobody believes AI can do {k} this well.","Stop paying for {k} tools."],
      List: ["5 free AI tools for {k}","3 AI prompts that fix {k}","7 AI tricks for {k} in 2026","The only AI stack you need for {k}"],
      Story: ["I let AI run {k} for 30 days","Testing viral AI tools for {k}","My AI {k} setup — full tour","AI vs me: {k} challenge"],
      Myth: ["AI won't replace you — but this will","Stop fearing AI for {k}","The AI {k} hype vs reality","Why most AI {k} advice is wrong"]
    }
  }
};

var FORMAT_ORDER = ["Question","Shock","List","Story","Myth"];
var FORMAT_LABEL = {Question:"❓ Question hooks",Shock:"⚡ Shock hooks",List:"📋 List hooks",Story:"📖 Story hooks",Myth:"🚫 Myth-bust hooks"};

function generate(){
  var niche = document.getElementById("niche").value;
  var fmt = document.getElementById("format").value;
  var box = document.getElementById("results");
  var d = DATA[niche];
  var formats = (fmt === "All") ? FORMAT_ORDER : [fmt];
  var out = "";
  var count = 0, n = 0;
  while(count < 10){
    var f = formats[n % formats.length];
    var tpl = d.templates[f];
    var t = tpl[(n / formats.length | 0) % tpl.length];
    var key = d.keys[n % d.keys.length];
    var hook = t.replace(/\{k\}/g, key);
    count++;
    out += '<div class="hook"><p><strong>'+count+'.</strong> '+escapeHtml(hook)+'</p><button class="copy" onclick="copyText(this.previousElementSibling.innerText.replace(/^[0-9]+\\.\\s*/, \'\'), this)">Copy</button></div>';
    n++;
    if(n > 60) break;
  }
  var heading = (fmt === "All") ? "🎯 10 viral hooks" : FORMAT_LABEL[fmt];
  box.innerHTML = '<h3 style="margin:18px 0 6px">'+heading+' — '+escapeHtml(niche)+'</h3>' + out;
}
function escapeHtml(s){ return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
window.generateHooks = generate;
})();
