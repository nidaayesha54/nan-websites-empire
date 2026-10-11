const TOPICS=[
  "Pharmacology & medication administration",
  "Adult health / med-surg",
  "Fundamentals of nursing care",
  "Maternal & newborn care",
  "Pediatric nursing",
  "Mental health / psychiatric nursing",
  "Critical care & emergency",
  "Leadership, ethics & legal issues",
  "Practice questions & test strategy"
];

document.addEventListener("DOMContentLoaded",()=>{
  document.getElementById("calc").addEventListener("submit",e=>{
    e.preventDefault();
    const weeks=parseInt(document.getElementById("weeks").value,10)||8;
    const hrsDay=parseFloat(document.getElementById("hrs").value)||3;
    const daysPerWeek=parseInt(document.getElementById("days").value,10)||6;
    const totalHrs=weeks*daysPerWeek*hrsDay;
    const perTopic=(totalHrs/TOPICS.length);

    let rows="";
    TOPICS.forEach((t,i)=>{
      const wk=Math.floor(i*weeks/TOPICS.length)+1;
      rows+="<tr><td>Week "+wk+"</td><td>"+t+"</td><td>"+perTopic.toFixed(1)+" hrs</td><td>"+
        (i<TOPICS.length-1?"Study + 25 practice Qs":"Full mock exam + review")+"</td></tr>";
    });

    document.getElementById("out").innerHTML=
      "<h3>Your "+weeks+"-week NCLEX study plan</h3>"+
      '<div class="big">'+Math.round(totalHrs)+"</div><p>total study hours planned</p>"+
      "<table><tr><th>When</th><th>Topic</th><th>Hours</th><th>Focus</th></tr>"+rows+"</table>"+
      "<p style='margin-top:12px'><strong>Tip:</strong> do at least <strong>75–150 practice questions per week</strong> "+
      "and one full timed mock in your final week. Review every wrong answer — that's where the learning happens.</p>";
    document.getElementById("out").classList.add("show");
  });
});
