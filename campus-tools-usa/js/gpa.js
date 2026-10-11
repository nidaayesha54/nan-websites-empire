/* GPA calculator logic — US 4.0 scale */
(function(){
  "use strict";
  var GRADE_POINTS = {"A+":4.0,"A":4.0,"A-":3.7,"B+":3.3,"B":3.0,"B-":2.7,"C+":2.3,"C":2.0,"C-":1.7,"D+":1.3,"D":1.0,"D-":0.7,"F":0.0};
  var coursesEl = document.getElementById("courses");
  var rowCount = 0;

  function gradeOptions(selected){
    var html = "";
    Object.keys(GRADE_POINTS).forEach(function(g){
      html += '<option value="'+g+'"'+(g===selected?' selected':'')+'>'+g+'</option>';
    });
    return html;
  }

  function addCourse(name, grade, credits){
    rowCount++;
    var div = document.createElement("div");
    div.className = "course-row";
    div.innerHTML =
      '<div><label>Course '+(rowCount)+'</label><input type="text" class="c-name" placeholder="e.g. Biology 101" value="'+(name||"")+'"></div>'+
      '<div><label>Grade</label><select class="c-grade">'+gradeOptions(grade||"A")+'</select></div>'+
      '<div><label>Credits</label><input type="number" class="c-credits" min="0" max="12" step="0.5" value="'+(credits==null?3:credits)+'"></div>'+
      '<div><label>&nbsp;</label><button class="btn btn-sm btn-danger c-remove" type="button">✕</button></div>';
    div.querySelector(".c-remove").addEventListener("click", function(){ div.remove(); calculate(); });
    div.querySelectorAll("input,select").forEach(function(el){ el.addEventListener("input", calculate); el.addEventListener("change", calculate); });
    coursesEl.appendChild(div);
  }

  function calculate(){
    var rows = coursesEl.querySelectorAll(".course-row");
    var totalPoints = 0, totalCredits = 0;
    var tbody = document.getElementById("breakdownBody");
    tbody.innerHTML = "";
    rows.forEach(function(row){
      var name = row.querySelector(".c-name").value.trim() || "Course";
      var grade = row.querySelector(".c-grade").value;
      var credits = parseFloat(row.querySelector(".c-credits").value) || 0;
      var pts = GRADE_POINTS[grade] * credits;
      totalPoints += pts; totalCredits += credits;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>"+escapeHtml(name)+"</td><td>"+grade+"</td><td>"+credits+"</td><td>"+pts.toFixed(2)+"</td>";
      tbody.appendChild(tr);
    });
    document.getElementById("breakdownTable").style.display = rows.length ? "table" : "none";

    var semGpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    var priorGpa = parseFloat(document.getElementById("priorGpa").value);
    var priorCredits = parseFloat(document.getElementById("priorCredits").value) || 0;
    var out = document.getElementById("gpaOut");
    var detail = document.getElementById("gpaDetail");

    if (totalCredits === 0 && !(priorCredits > 0)) {
      out.textContent = "—";
      detail.textContent = "Add at least one course to calculate.";
      return;
    }
    if (!isNaN(priorGpa) && priorCredits > 0) {
      var cumPoints = priorGpa * priorCredits + totalPoints;
      var cumCredits = priorCredits + totalCredits;
      var cum = cumPoints / cumCredits;
      out.textContent = cum.toFixed(2);
      detail.textContent = "Cumulative GPA (" + cumCredits + " total credits) · This semester: " + semGpa.toFixed(2) + " (" + totalCredits + " credits)";
    } else {
      out.textContent = semGpa.toFixed(2);
      detail.textContent = "Semester GPA · " + totalCredits + " credit hours · " + totalPoints.toFixed(2) + " grade points";
    }
  }

  function escapeHtml(s){ return s.replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  document.getElementById("addCourse").addEventListener("click", function(){ addCourse(); });
  document.getElementById("priorGpa").addEventListener("input", calculate);
  document.getElementById("priorCredits").addEventListener("input", calculate);

  // seed 4 sample rows
  addCourse("English 101","A",3); addCourse("Calculus I","B+",4); addCourse("History 201","A-",3); addCourse("Chemistry Lab","B",1);
  calculate();
})();
