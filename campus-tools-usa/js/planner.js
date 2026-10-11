/* Study planner — weighted scheduling by difficulty and urgency */
(function(){
  "use strict";
  var subjectsEl = document.getElementById("subjects");
  var count = 0;

  function todayISO(){
    var d = new Date();
    return d.toISOString().slice(0,10);
  }

  function addSubject(name, examDate, difficulty){
    count++;
    var div = document.createElement("div");
    div.className = "course-row";
    div.innerHTML =
      '<div><label>Subject '+count+'</label><input type="text" class="s-name" placeholder="e.g. Organic Chemistry" value="'+(name||"")+'"></div>'+
      '<div><label>Exam Date</label><input type="date" class="s-date" value="'+(examDate||"")+'"></div>'+
      '<div><label>Difficulty (1-5)</label><select class="s-diff">'+
        [1,2,3,4,5].map(function(d){return '<option value="'+d+'"'+(d===(difficulty||3)?' selected':'')+'>'+d+'</option>';}).join("")+
      '</select></div>'+
      '<div><label>&nbsp;</label><button class="btn btn-sm btn-danger s-remove" type="button">✕</button></div>';
    div.querySelector(".s-remove").addEventListener("click", function(){ div.remove(); });
    subjectsEl.appendChild(div);
  }

  function fmtDate(d){
    return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
  }

  function buildPlan(){
    var hoursPerDay = parseFloat(document.getElementById("hoursPerDay").value)||0;
    var startStr = document.getElementById("startDate").value || todayISO();
    var start = new Date(startStr+"T12:00:00");
    var rows = subjectsEl.querySelectorAll(".course-row");
    var subjects = [];
    rows.forEach(function(row){
      var name = row.querySelector(".s-name").value.trim() || "Subject";
      var dateStr = row.querySelector(".s-date").value;
      var diff = parseInt(row.querySelector(".s-diff").value,10)||3;
      if (!dateStr) return;
      var exam = new Date(dateStr+"T12:00:00");
      var daysLeft = Math.max(1, Math.round((exam - start)/(1000*60*60*24)));
      subjects.push({name:name, exam:exam, diff:diff, daysLeft:daysLeft});
    });
    var box = document.getElementById("resultBox");
    var tbody = document.getElementById("planBody");
    tbody.innerHTML = "";
    if (!subjects.length || hoursPerDay<=0){ box.classList.remove("show"); return; }

    // weight = difficulty / daysLeft (urgent + hard = priority)
    var totalWeight = 0;
    subjects.forEach(function(s){ s.weight = s.diff / s.daysLeft; totalWeight += s.weight; });

    // find last exam date
    var lastExam = subjects.reduce(function(a,b){ return a.exam>b.exam?a:b; }).exam;
    var totalDays = Math.max(1, Math.round((lastExam - start)/(1000*60*60*24)));

    // allocate per day
    var planRows = [];
    for (var d=0; d<totalDays; d++){
      var day = new Date(start.getTime()); day.setDate(day.getDate()+d);
      // active subjects: exam not yet passed
      var active = subjects.filter(function(s){ return s.exam > day; });
      if (!active.length) continue;
      var wSum = active.reduce(function(a,s){return a+s.weight;},0);
      active.forEach(function(s){
        var hrs = Math.round((s.weight/wSum)*hoursPerDay*2)/2;
        if (hrs < 0.5) return;
        var daysToExam = Math.round((s.exam-day)/(1000*60*60*24));
        var focus = daysToExam<=2 ? "Review + practice problems" :
                    daysToExam<=5 ? "Active recall + weak topics" : "Learn new material";
        planRows.push({date:new Date(day.getTime()), subject:s.name, hours:hrs, focus:focus});
      });
    }

    // render (cap at 60 rows for sanity)
    planRows.slice(0,60).forEach(function(r){
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>"+fmtDate(r.date)+"</td><td>"+escapeHtml(r.subject)+"</td><td>"+r.hours+"h</td><td>"+r.focus+"</td>";
      tbody.appendChild(tr);
    });
    document.getElementById("planSummary").textContent =
      subjects.length+" subjects · "+totalDays+" study days · "+hoursPerDay+"h/day. Harder, sooner exams get priority. Last 2 days before each exam = review.";
    box.classList.add("show");
  }

  function escapeHtml(s){ return s.replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  document.getElementById("addSubject").addEventListener("click", function(){ addSubject(); });
  document.getElementById("buildPlan").addEventListener("click", buildPlan);
  document.getElementById("startDate").value = todayISO();

  // seed examples
  var d1 = new Date(); d1.setDate(d1.getDate()+14);
  var d2 = new Date(); d2.setDate(d2.getDate()+9);
  var d3 = new Date(); d3.setDate(d3.getDate()+5);
  function iso(d){ return d.toISOString().slice(0,10); }
  addSubject("Organic Chemistry", iso(d1), 5);
  addSubject("US History", iso(d2), 3);
  addSubject("Statistics", iso(d3), 4);
})();
