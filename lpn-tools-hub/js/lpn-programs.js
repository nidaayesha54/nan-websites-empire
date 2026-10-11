// LPN Program Finder Quiz — maps answers to program-type recommendations.
(function(){
  var STATES = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas",
  "Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York",
  "North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
  "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming"];

  function $(id){ return document.getElementById(id); }
  function checked(name){
    var els = document.querySelectorAll('input[name="'+name+'"]:checked');
    return els.length ? els[0].value : null;
  }
  function fmt(n){ return "$" + n.toLocaleString("en-US"); }

  document.addEventListener("DOMContentLoaded", function(){
    var stateSel = $("pq-state");
    if(!stateSel) return;
    STATES.forEach(function(s){
      var o = document.createElement("option");
      o.value = s; o.textContent = s;
      stateSel.appendChild(o);
    });

    $("pq-btn").addEventListener("click", function(){
      var state = stateSel.value;
      if(!state){ alert("Please select your state."); return; }
      var budget = checked("pq-budget");
      var schedule = checked("pq-schedule");
      var timeline = checked("pq-timeline");
      if(!budget || !schedule || !timeline){ alert("Please answer all three questions."); return; }

      var recs = [];

      // 1) Community college route — cheapest, budget-friendly
      if(budget !== "high"){
        recs.push({
          name:"Community College LPN Certificate",
          tag: budget === "low" ? "Best match for your budget" : "Affordable public option",
          best: budget === "low",
          cost:"$4,000–$12,000 total tuition",
          duration:"12–18 months",
          pros:["Lowest tuition of any route — financial aid & Pell Grants often cover most of it",
               "Strong NCLEX-PN pass rates at accredited programs",
               "Easy transfer credits into an LPN-to-RN bridge later"],
          cons:["Waitlists of 6–18 months are common — apply early",
               "Limited schedule flexibility vs. private schools"]
        });
      }

      // 2) Technical/vocational school — fastest
      if(timeline === "fast"){
        recs.push({
          name:"Technical / Vocational School (Career College)",
          tag:"Fastest path to licensure",
          best: budget === "med",
          cost:"$10,000–$22,000 total tuition",
          duration:"9–12 months accelerated",
          pros:["Start classes year-round with new cohorts monthly",
               "Built for working adults — evening & weekend clinical rotations",
               "Dedicated job-placement teams and employer partnerships"],
          cons:["Higher cost; verify ACEN/CNEA accreditation + NCLEX-PN pass rate before enrolling",
               "Federal aid eligible at most, but check the school's default rate"]
        });
      }

      // 3) Private college
      if(budget === "high"){
        recs.push({
          name:"Private College / University LPN Diploma",
          tag:"Premium campus experience",
          best: false,
          cost:"$20,000–$35,000 total tuition",
          duration:"12–15 months",
          pros:["Small clinical groups and modern simulation labs",
               "On-campus support services and career coaching",
               "Strong alumni networks at regional hospitals"],
          cons:["Highest debt load — weigh carefully against your expected LPN salary in "+state,
               "Confirm the program is on your state board's approved list"]
        });
      }

      // 4) Hybrid/online-friendly
      if(schedule !== "fulltime"){
        recs.push({
          name:"Hybrid LPN Program (Online Theory + In-Person Clinicals)",
          tag: schedule === "evening" ? "Best match for your schedule" : "Flexible for working adults",
          best: schedule === "evening",
          cost:"$12,000–$25,000 total tuition",
          duration:"14–18 months part-time friendly",
          pros:["Lectures online; clinicals arranged at local hospitals/nursing homes in "+state,
               "Keep your current job while you train",
               "Self-paced theory modules suit parents and second-career students"],
          cons:["100% online LPN programs do not exist — clinical hours are always in person",
               "Requires strong self-discipline to keep up with coursework"]
        });
      }

      // Fallback: always show at least the community-college recommendation
      if(recs.length === 0){
        recs.push({
          name:"Community College LPN Certificate",
          tag:"Best overall value",
          best:true,
          cost:"$4,000–$12,000 total tuition",
          duration:"12–18 months",
          pros:["Lowest tuition with the strongest bridge pathway to RN later"],
          cons:["Waitlists are common — apply to multiple colleges in "+state]
        });
      }

      var box = $("pq-result");
      var html = "<h3>Your LPN program matches for " + state + "</h3>";
      recs.forEach(function(r){
        html += '<div class="rec'+(r.best?' best':'')+'">' +
          (r.best ? '<span class="badge">★ BEST MATCH</span><br>' : '') +
          '<h4>'+r.name+'</h4><p><strong>'+r.tag+'</strong></p>' +
          '<p>💲 '+r.cost+' &nbsp;·&nbsp; ⏱ '+r.duration+'</p>' +
          '<p><strong>Pros:</strong></p><ul>' + r.pros.map(function(p){return "<li>"+p+"</li>";}).join("") + '</ul>' +
          '<p><strong>Watch out:</strong></p><ul>' + r.cons.map(function(p){return "<li>"+p+"</li>";}).join("") + '</ul>' +
          '</div>';
      });
      html += '<p><strong>Next step:</strong> confirm every program is approved by your state board of nursing and check its NCLEX-PN pass rate (aim for 85%+). Read our full <a href="../guides/how-to-become-lpn-2026.html">How to Become an LPN in 2026</a> guide for the application checklist.</p>';
      box.innerHTML = html;
      box.classList.add("show");
      box.scrollIntoView({behavior:"smooth", block:"nearest"});
    });
  });
})();
